import log from 'loglevel';
import { singleton } from 'tsyringe';

import { SkillsSummaryCombo } from '@src/common/model/player.model';
import { PlayersSkillsTableService } from '@src/modules/playersSkills/services/playersSkillsTable.service';

const _columnsConfig: Record<string, number> = {
    country: 3,
    wage: 16,
    gs: 21,
    gsFutureMin: 22,
    gsFutureMax: 23,
};
@singleton()
export class TransferListSkillsTableService extends PlayersSkillsTableService {
    constructor() {
        super(_columnsConfig);
    }

    prepareTable(playersTable: HTMLTableElement): void {
        playersTable.classList.add('pmt-tl-skills');
    }

    createHeaderCells(): HTMLTableCellElement[] {
        return [this.createHeaderCell('gs'), this.createHeaderCell('gs>'), this.createHeaderCell('gs<')];
    }

    createSkillsSummaryCells(summaries?: SkillsSummaryCombo): HTMLTableCellElement[] {
        return [
            this.createSkillsSummaryCell(summaries?.current?.best),
            this.createFutureSkillsSummaryCell(summaries?.future),
            this.createFutureSkillsSummaryCell(summaries?.futureMax),
        ];
    }
}
