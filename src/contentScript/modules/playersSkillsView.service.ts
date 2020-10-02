import log from 'loglevel';
import { singleton } from 'tsyringe';

import { FullTrainings } from '@src/common/model/fullTranings.model';
import { Player, PlayerWithSkillsSummaries, SkillsSummaryCombo } from '@src/common/model/player.model';
import { getPotentialConfig } from '@src/common/model/potential.model';
import { HtmlElementExtractor } from '@src/common/services/extractors/htmlElement.mapper';
import { getPlayerMapper } from '@src/common/services/extractors/htmlPlayer.mapper';
import { FuturePlayersRankService } from '@src/common/services/playersRank.service';
import {
    MatchesInSeasons,
    maxMatchesInSeasons,
    SkillsTableOptionsRepository,
} from '@src/common/services/storage/skillsTableOptions.repository';
import { DataRow, Header, Table } from '@src/common/services/table.wrapper';

import { FutureSkillsService } from '../../common/services/futureSkills.service';
import { SkillCalculatorService } from '../../common/services/skillCalculator.service';

import { PlayersSkillsTableService } from './playersSkillsTable.service';

const _potentialConfig = getPotentialConfig();

/**
 * Przetwarza tabele graczy <Player> z umiejątnościami
 * Oblicza dodatkowe dane graczy
 * Dodaje kolumny do tabeli graczy
 */
@singleton()
export class PlayersSkillsViewService {
    private playersTable?: Table<PlayerWithSkillsSummaries>;

    private fullTrainings?: FullTrainings;
    private futureAge?: number;
    private options: MatchesInSeasons = maxMatchesInSeasons;

    constructor(
        private readonly skillCaluclatorService: SkillCalculatorService,
        private readonly futureSkillsService: FutureSkillsService,
        private readonly skillsTableOptionsRepository: SkillsTableOptionsRepository,
        private readonly view: PlayersSkillsTableService,
        private readonly futurePlayersRankService: FuturePlayersRankService,
    ) {
        log.debug('PlayersSkillsViewService.ctor +');
    }

    public async run(): Promise<void> {
        log.info('PlayersSkillsViewService.run + this.playersTable:', !!this.playersTable);
        await this.refreshConfig();
        if (!this.playersTable) {
            this.playersTable = this.extractTableFromHtml();
        }

        this.update(this.playersTable);
    }

    private async refreshConfig(): Promise<void> {
        const options = await this.skillsTableOptionsRepository.getOptions();
        log.debug('options:', options);
        this.futureAge = options.futureAge;
        this.fullTrainings = new FullTrainings(options);
        this.options = options;

        await this.futurePlayersRankService.init(true);

        log.debug('refreshConfig', this.futureAge, this.fullTrainings);
    }

    private async update(playersTable?: Table<PlayerWithSkillsSummaries>): Promise<void> {
        if (!playersTable) {
            return;
        }

        for (const row of playersTable.rows) {
            const player = row.data;
            row.data = this.processPlayer(player);

            row.applyHtmlCells(this.createSkillsSummaryCells(row.data.skillsSummaries));
        }
        for (const header of playersTable.headers) {
            header.applyHtmlCells(this.createHeaderCells());
        }
    }

    private createHeaderCells(): HTMLTableCellElement[] {
        return [this.view.createHeaderCell('GS'), this.view.createHeaderCell('GS>'), this.view.createHeaderCell('GS<')];
    }

    // #region Przetwarza tabele graczy <Player> z umiejątnościami
    private extractTableFromHtml(): Table<Player> | undefined {
        const htmlPlayersTable = this.view.getPlayersTable();
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

    // Dodaje kolumny do tabeli graczy

    private createSkillsSummaryCells(summaries?: SkillsSummaryCombo): HTMLTableCellElement[] {
        return [
            this.view.createSkillsSummaryCell(summaries?.current?.best),
            this.view.createFutureSkillsSummaryCell(summaries?.future),
            this.view.createFutureSkillsSummaryCell(summaries?.futureMax),
        ];
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
                    this.options,
                );
            } else {
                const potentialDelta = _potentialConfig[player.potential];

                skillsSummaries.future = this.futureSkillsService.countSkillsInFuture(
                    skillsSummaries.current,
                    player.age,
                    this.futureAge,
                    this.fullTrainings,
                    potentialDelta.min,
                    this.options,
                );

                skillsSummaries.futureMax = this.futureSkillsService.countSkillsInFuture(
                    skillsSummaries.current,
                    player.age,
                    this.futureAge,
                    this.fullTrainings,
                    potentialDelta.max,
                    this.options,
                );
            }
        }
        return { ...player, skillsSummaries };
    }
}
