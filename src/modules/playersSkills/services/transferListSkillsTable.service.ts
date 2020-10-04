import { singleton } from 'tsyringe';

import { SkillsSummaryCombo } from '@src/common/model/player.model';
import { PlayersSkillsTableService } from '@src/modules/playersSkills/services/playersSkillsTable.service';

@singleton()
export class TransferListSkillsTableService extends PlayersSkillsTableService {
    prepareTable(playersTable: HTMLTableElement) {
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
