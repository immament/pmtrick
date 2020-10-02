import { isPlayerPosition, PlayerPositionType } from '@src/common/model/player.model';
import { PlayerSkills } from '@src/common/model/playerSkills.model';

export class PlayerRowExtractor {
    private cells: HTMLCollectionOf<HTMLTableDataCellElement | HTMLTableHeaderCellElement>;

    constructor(row: HTMLTableRowElement) {
        this.cells = row.cells;
    }

    getNumber(index: number): number {
        return Number(this.cells[index].textContent?.trim());
    }

    getText(index: number): string | undefined {
        return this.cells[index].textContent?.trim();
    }

    getSkills(firsSkillCellIndex: number): PlayerSkills {
        return {
            handling: this.getNumber(firsSkillCellIndex),
            outOfArea: this.getNumber(firsSkillCellIndex + 1),
            reflexes: this.getNumber(firsSkillCellIndex + 2),
            agility: this.getNumber(firsSkillCellIndex + 3),
            tackling: this.getNumber(firsSkillCellIndex + 4),
            heading: this.getNumber(firsSkillCellIndex + 5),
            passing: this.getNumber(firsSkillCellIndex + 6),
            positioning: this.getNumber(firsSkillCellIndex + 7),
            finishing: this.getNumber(firsSkillCellIndex + 8),
            technique: this.getNumber(firsSkillCellIndex + 9),
            speed: this.getNumber(firsSkillCellIndex + 10),
            strength: this.getNumber(firsSkillCellIndex + 11),
        };
    }

    // TODO: from various languages
    // TODO: Konwersja ne ekstrakcjs
    fullPositionToZone(fullPosition?: string): PlayerPositionType | undefined {
        if (fullPosition && isPlayerPosition(fullPosition[0])) {
            return fullPosition[0];
        }
        return;
    }
}
