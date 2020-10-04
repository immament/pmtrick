import { singleton } from 'tsyringe';

import { SkillsSummaryCombo } from '@src/common/model/player.model';
import { PlayersSkillsTableService } from '@src/modules/playersSkills/services/playersSkillsTable.service';

@singleton()
export class TeamPlayersSkillsTableService extends PlayersSkillsTableService {
    prepareTable(playersTable: HTMLTableElement): void {
        playersTable.classList.add('pmt-tpl-skills');
    }

    createHeaderCells(): HTMLTableCellElement[] {
        return [this.createHeaderCell('gs')];
    }

    createSkillsSummaryCells(summaries?: SkillsSummaryCombo): HTMLTableCellElement[] {
        return [this.createSkillsSummaryCell(summaries?.current?.best)];
    }
}
