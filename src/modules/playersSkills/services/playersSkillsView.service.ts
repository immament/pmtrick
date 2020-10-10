import log from 'loglevel';
import { Subscription } from 'rxjs';
import { inject, registry, singleton } from 'tsyringe';

import { FullTrainings } from '@src/common/model/fullTranings.model';
import {
    FutureSkillsSummaryWithBest,
    Player,
    playerPositionValues,
    PlayerWithSkillsSummaries,
    SkillsSummaryCombo,
} from '@src/common/model/player.model';
import { getPotentialConfig } from '@src/common/model/potential.model';
import { HtmlElementExtractor } from '@src/common/services/extractors/htmlElement.mapper';
import { getPlayerMapper } from '@src/common/services/extractors/htmlPlayer.mapper';
import { PlayersRankService, PlayersRankServiceFactory } from '@src/common/services/playersRank.service';
import {
    _futurePredicationSettingsKey,
    FuturePredicationSettings,
} from '@src/common/services/settings/futurePredication.settings';
import { _rankingsSettingsKey, RankingsSettings } from '@src/common/services/settings/settings';
import { SettingsChange, SettingsRepository } from '@src/common/services/settings/settings.repository';
import { DataRow, Header, Table } from '@src/common/services/table.wrapper';

import { FutureSkillsService } from '../../../common/services/futureSkills.service';
import { SkillCalculatorService } from '../../../common/services/skillCalculator.service';

import { playersSkillsTableFactory } from './playersSkillsTable.factory';
import { PlayersSkillsTableService } from './playersSkillsTable.service';

const _potentialConfig = getPotentialConfig();

/**
 * Przetwarza tabele graczy <Player> z umiejątnościami
 * Oblicza dodatkowe dane graczy
 * Dodaje kolumny do tabeli graczy
 */
@registry([
    {
        token: 'PlayersSkillsTableService',
        useFactory: playersSkillsTableFactory,
    },
])
@singleton()
export class PlayersSkillsViewService {
    private playersTable?: Table<PlayerWithSkillsSummaries>;

    private fullTrainings?: FullTrainings;
    private futureAge?: number;
    private futurePredicationSettings?: FuturePredicationSettings;
    private rankService?: PlayersRankService;

    private onSettingsChangedSubs?: Subscription;

    constructor(
        private readonly skillCaluclatorService: SkillCalculatorService,
        private readonly futureSkillsService: FutureSkillsService,
        private readonly settingsRepository: SettingsRepository,
        private readonly playersRankServiceFactory: PlayersRankServiceFactory,
        @inject('PlayersSkillsTableService') private readonly tableService: PlayersSkillsTableService,
    ) {
        log.trace('PlayersSkillsViewService.ctor +');
    }

    public async run(): Promise<void> {
        log.debug('PlayersSkillsViewService.run + this.playersTable is defined:', !!this.playersTable);
        if (!this.playersTable) {
            this.listenSettingsChanges();
            this.playersTable = this.extractTableFromHtml();
            this.playersTable && this.tableService?.prepareTable(this.playersTable.htmlTable);
            await this.loadSettings();
        }
        return this.updatePlayers(this.playersTable);
    }

    private async updatePlayers(playersTable?: Table<PlayerWithSkillsSummaries>): Promise<void> {
        if (!playersTable) {
            return;
        }

        for (const row of playersTable.rows) {
            const player = row.data;
            row.data = this.processPlayer(player);
            this.updateRanking(row.data.skillsSummaries);
            row.applyHtmlCells(this.tableService.createSkillsSummaryCells(row.data.skillsSummaries));
        }

        for (const header of playersTable.headers) {
            header.applyHtmlCells(this.tableService.createHeaderCells());
        }
    }

    private async updateRankig(playersTable?: Table<PlayerWithSkillsSummaries>): Promise<void> {
        if (!playersTable) {
            return;
        }

        for (const row of playersTable.rows) {
            this.updateRanking(row.data.skillsSummaries);
            row.applyHtmlCells(this.tableService.createSkillsSummaryCells(row.data.skillsSummaries));
        }

        // for (const header of playersTable.headers) {
        //     header.applyHtmlCells(this.tableService.createHeaderCells());
        // }
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
                        this.refreshFuturePredicationSettings(changes[_futurePredicationSettingsKey].newValue);
                        if (this.playersTable) {
                            this.updatePlayers(this.playersTable);
                        }
                    }
                    break;
                case _rankingsSettingsKey:
                    {
                        const rankingsSettings = changes[_rankingsSettingsKey].newValue;
                        this.prepareRankings(rankingsSettings).then(() => this.updateRankig(this.playersTable));
                    }
                    break;
            }
        }
    }

    private async loadSettings(): Promise<void> {
        const futurePredicationSettings = await this.settingsRepository.getSettings<FuturePredicationSettings>(
            _futurePredicationSettingsKey,
        );
        this.refreshFuturePredicationSettings(futurePredicationSettings);

        const rankingsSettings = await this.settingsRepository.getSettings<RankingsSettings>(_rankingsSettingsKey);
        return this.prepareRankings(rankingsSettings);
    }

    private async prepareRankings(rankingsSettings: RankingsSettings) {
        if (!this.rankService) {
            this.rankService = await this.playersRankServiceFactory.getRanking(rankingsSettings);
        } else {
            this.rankService.init(rankingsSettings);
        }
    }

    private refreshFuturePredicationSettings(futurePredicationSettings: FuturePredicationSettings): void {
        log.trace('refreshSettings:', futurePredicationSettings);
        this.futureAge = futurePredicationSettings.futureAge;
        this.fullTrainings = new FullTrainings(futurePredicationSettings);
        this.futurePredicationSettings = futurePredicationSettings;
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

    private updateRanking(skillsSummaryCombo?: SkillsSummaryCombo) {
        if (!skillsSummaryCombo || !this.rankService) return;
        if (skillsSummaryCombo.current) {
            this.updateRankingPerPositon(skillsSummaryCombo.current, this.rankService);
        }
        if (skillsSummaryCombo.future) {
            this.updateRankingPerPositon(
                skillsSummaryCombo.future,
                this.rankService,
                this.futurePredicationSettings?.futureAge,
            );
        }
        if (skillsSummaryCombo.futureMax) {
            this.updateRankingPerPositon(
                skillsSummaryCombo.futureMax,
                this.rankService,
                this.futurePredicationSettings?.futureAge,
            );
        }
    }

    private updateRankingPerPositon(
        skillsSummary: FutureSkillsSummaryWithBest,
        rankService: PlayersRankService,
        futureAge?: number,
    ) {
        playerPositionValues.forEach((positionType) => {
            const summary = skillsSummary[positionType];
            summary.rank = rankService.getRank(summary.gs, futureAge);
        });
    }

    // Oblicza dodatkowe dane graczy
    private processPlayer(player: Player): PlayerWithSkillsSummaries {
        const skillsSummaries: SkillsSummaryCombo = {
            current: this.skillCaluclatorService.calculateGs(player),
        };
        if (skillsSummaries.current && this.futureAge && this.fullTrainings) {
            if (player.maxTraining) {
                skillsSummaries.future = this.futureSkillsService.countSkillsInFuture(
                    skillsSummaries.current,
                    player.age,
                    this.futureAge,
                    this.fullTrainings,
                    player.maxTraining,
                    this.futurePredicationSettings,
                );
            } else {
                const potentialDelta = _potentialConfig[player.potential];

                if (potentialDelta) {
                    skillsSummaries.future = this.futureSkillsService.countSkillsInFuture(
                        skillsSummaries.current,
                        player.age,
                        this.futureAge,
                        this.fullTrainings,
                        potentialDelta.min,
                        this.futurePredicationSettings,
                    );

                    skillsSummaries.futureMax = this.futureSkillsService.countSkillsInFuture(
                        skillsSummaries.current,
                        player.age,
                        this.futureAge,
                        this.fullTrainings,
                        potentialDelta.max,
                        this.futurePredicationSettings,
                    );
                }
            }
        }
        return { ...player, skillsSummaries };
    }
}
