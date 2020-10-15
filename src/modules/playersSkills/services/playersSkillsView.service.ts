import log from 'loglevel';
import { Subscription } from 'rxjs';
import { singleton } from 'tsyringe';

import { Player, PlayerWithSkillsSummaries } from '@src/common/model/player.model';
import { getPotentialConfig } from '@src/common/model/potential.model';
import { HtmlElementExtractor } from '@src/common/services/extractors/htmlElement.mapper';
import { getPlayerMapper } from '@src/common/services/extractors/htmlPlayer.mapper';
import {
    _futurePredicationSettingsKey,
    FuturePredicationSettings,
} from '@src/common/services/settings/futurePredication.settings';
import { _rankingsSettingsKey, BaseSettings } from '@src/common/services/settings/settings';
import { SettingsChange, SettingsRepository } from '@src/common/services/settings/settings.repository';
import { DataRow, Header, Table } from '@src/common/services/table.wrapper';

import { PlayersSkillsFactory } from './playersSkills.factory';
import { PlayersSkillsTableService } from './playersSkillsTable.service';
import { PlayersSkillsViewServiceSettings } from './playersSkillsViewServiceSettings';
import { PageSettingsService, PlayersSkillsViewSettings } from './playersSkillsViewSettings';
import { ProcessPlayerService } from './processPlayer.service';

export const _potentialConfig = getPotentialConfig();

/**
 * Przetwarza tabele graczy <Player> z umiejątnościami
 * Oblicza dodatkowe dane graczy
 * Dodaje kolumny do tabeli graczy
 */
@singleton()
export class PlayersSkillsViewService {
    private playersTable?: Table<PlayerWithSkillsSummaries>;

    private onSettingsChangedSubs?: Subscription;

    private readonly tableService: PlayersSkillsTableService;
    private readonly pageSettingsService: PageSettingsService;

    private settings: PlayersSkillsViewSettings = { hiddenColumns: [] };

    constructor(
        private readonly settingsRepository: SettingsRepository,
        playersSkillsFactory: PlayersSkillsFactory,
        private readonly processPlayerService: ProcessPlayerService,
    ) {
        log.trace('PlayersSkillsViewService.ctor +');

        this.tableService = playersSkillsFactory.getPlayersSkillsTableService();
        this.pageSettingsService = playersSkillsFactory.getPlayersSettingsService();
    }

    public async run(): Promise<void> {
        if (!this.playersTable) {
            this.listenSettingsChanges();
            this.playersTable = this.extractTableFromHtml();
            if (this.playersTable) {
                this.tableService?.prepareTable(this.playersTable.htmlTable);
            }
            await this.loadSettings();
        }
        await this.updatePlayers(this.playersTable);
    }

    private async updatePlayers(playersTable?: Table<PlayerWithSkillsSummaries>): Promise<void> {
        if (!playersTable) {
            return;
        }

        for (const row of playersTable.rows) {
            const player = row.data;
            row.data = this.processPlayerService.processPlayer(player);
            this.processPlayerService.updatePlayerRanking(row.data.skillsSummaries);
            row.applyHtmlCells(this.tableService.createSkillsSummaryCells(row.data.skillsSummaries));
        }

        for (const header of playersTable.headers) {
            header.applyHtmlCells(this.tableService.createHeaderCells());
        }
        await this.updateColumnsVisibility(this.playersTable);
    }

    private async updateRanking(playersTable?: Table<PlayerWithSkillsSummaries>): Promise<void> {
        if (!playersTable) {
            return;
        }

        for (const row of playersTable.rows) {
            this.processPlayerService.updatePlayerRanking(row.data.skillsSummaries);
            row.applyHtmlCells(this.tableService.createSkillsSummaryCells(row.data.skillsSummaries));
        }
        await this.updateColumnsVisibility(this.playersTable);
    }

    private async updateColumnsVisibility(playersTable?: Table<PlayerWithSkillsSummaries>): Promise<void> {
        if (!playersTable) {
            return;
        }

        log.debug('playersSkillsView.service', 'updateColumnsVisibility', this.settings.hiddenColumns);

        if (!this.settings.hiddenColumns) return;

        for (const header of playersTable.headers) {
            this.tableService.hideColumns(this.settings.hiddenColumns, header.htmlRow);
        }

        for (const row of playersTable.rows) {
            this.tableService.hideColumns(this.settings.hiddenColumns, row.htmlRow);
        }
    }

    // #regions SETTINGS
    private listenSettingsChanges(): void {
        if (!this.onSettingsChangedSubs) {
            this.onSettingsChangedSubs = this.settingsRepository.onChanged.subscribe((changes) =>
                this.onSettingsChanged(changes),
            );
        }
    }

    private onSettingsChanged(changes: Record<string, SettingsChange>) {
        for (const key in changes) {
            switch (key) {
                case _futurePredicationSettingsKey:
                    {
                        this.processPlayerService.refreshFuturePredicationSettings(
                            changes[_futurePredicationSettingsKey].newValue,
                        );
                        if (this.playersTable) {
                            this.updatePlayers(this.playersTable);
                        }
                    }
                    break;
                case _rankingsSettingsKey:
                    {
                        const rankingsSettings = changes[_rankingsSettingsKey].newValue;
                        this.processPlayerService
                            .prepareRankings(rankingsSettings)
                            .then(() => this.updateRanking(this.playersTable));
                    }
                    break;
                case this.pageSettingsService.key:
                    {
                        this.settings = { ...this.settings, ...changes[key].newValue };
                        this.updateColumnsVisibility(this.playersTable);
                    }
                    break;
            }
        }
    }

    private async loadSettings(): Promise<void> {
        const loadedSettings = await this.settingsRepository.getMultipleSettings<
            PlayersSkillsViewServiceSettings & Record<string, BaseSettings>
        >([_rankingsSettingsKey, _futurePredicationSettingsKey, this.pageSettingsService.key]);

        log.debug('playersSkillsView.service', 'settings', loadedSettings);
        this.settings = { ...this.settings, ...loadedSettings[this.pageSettingsService.key] };
        this.processPlayerService.refreshFuturePredicationSettings(
            loadedSettings.futurePredicationSettings as FuturePredicationSettings,
        );
        await this.processPlayerService.prepareRankings(loadedSettings.rankingsSettings);
    }

    // #endregion

    // #region Przetwarza tabele graczy <Player> z umiejątnościami
    private extractTableFromHtml(): Table<Player> | undefined {
        const htmlPlayersTable = this.tableService.getPlayersTable();
        if (!htmlPlayersTable) {
            log.warn('No players list on page!');
            return;
        }
        const mapPlayer = getPlayerMapper();
        if (!mapPlayer) {
            log.warn('No mapper for page!');
            return;
        }

        return this.createTable(htmlPlayersTable, mapPlayer);
    }

    private isHeaderRow(_htmlRow: HTMLTableRowElement, index: string): boolean {
        return index === '0';
    }

    private createTable(
        htmlPlayersTable: HTMLTableElement,
        playerMapper: HtmlElementExtractor<HTMLTableRowElement, Player>,
    ): Table<Player> {
        const playersTable = new Table<Player>(htmlPlayersTable);
        playersTable.init((htmlRow, index): DataRow<Player> | Header | undefined => {
            if (this.isHeaderRow(htmlRow, index)) {
                return new Header(htmlRow);
            }

            const player = playerMapper.extract(htmlRow);
            if (player) {
                return new DataRow(player, player.id?.toString() || player.name, htmlRow);
            }
        });
        return playersTable;
    }
    // #endregion
}
