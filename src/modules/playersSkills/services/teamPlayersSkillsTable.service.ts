import { singleton } from 'tsyringe';

import { SkillsSummaryCombo } from '@src/common/model/player.model';
import { PlayersSkillsTableService } from '@src/modules/playersSkills/services/playersSkillsTable.service';

const _columnsConfig: Record<string, number> = {
    country: 4,
    gs: 19,
};

@singleton()
export class TeamPlayersSkillsTableService extends PlayersSkillsTableService {
    constructor() {
        super(_columnsConfig);
    }

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
