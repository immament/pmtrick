import { injectable } from 'tsyringe';

import { FutureSkillsSummaryWithBest } from '@src/common/model/player.model';
import { createFutureSkillsTootip } from '@src/common/renders/createFutureSkillsTooltip';
import { SkillsSummary } from '@src/modules/tacticSummary/model/skillsSummary.model';

@injectable()
export class PlayersSkillsTableService {
    createFutureSkillsSummaryCell(skillsSummary?: FutureSkillsSummaryWithBest): HTMLTableCellElement {
        const cell = this.createSkillsSummaryCell(skillsSummary?.best);
        if (skillsSummary) {
            cell.title += '\n' + createFutureSkillsTootip(skillsSummary);
        }
        return cell;
    }

    createSkillsSummaryCell(skillsSummary?: SkillsSummary): HTMLTableCellElement {
        if (skillsSummary) {
            const classStyles: string[] = [];
            const rank = skillsSummary.rank ? skillsSummary.rank : 'last';
            this.applyStyle(skillsSummary, classStyles);
            return this.createGsCell(
                this.formatGs(skillsSummary.gs),
                `Place in team: ${rank}`,
                classStyles.length > 0 ? classStyles : undefined,
            );
        } else {
            return this.createGsCell('-');
        }
    }

    getPlayersTable(): HTMLTableElement | undefined {
        const tables = document.querySelectorAll<HTMLTableElement>('table.table_border');

        for (const table of Object.values(tables)) {
            if (this.isSkillsTable(table)) {
                return table;
            }
        }

        return;
    }

    private createGsCell(content: string, tooltip?: string, classStyles?: string[]): HTMLTableCellElement {
        const cell = document.createElement('td');
        cell.width = '3%';
        cell.align = 'center';
        cell.classList.add('team_players');
        if (classStyles) {
            cell.classList.add(...classStyles);
        }
        cell.innerHTML = content;
        if (tooltip) {
            cell.title = tooltip;
        }

        return cell;
    }

    private applyStyle(skillsSummary: SkillsSummary, classStyles: string[]): void {
        if (skillsSummary.rank) {
            if (skillsSummary.rank < 2) {
                classStyles.push('bg-danger');
                classStyles.push('pmt-font-weight-bold');
            } else if (skillsSummary.rank < 6) {
                classStyles.push('bg-danger');
            } else if (skillsSummary.rank < 12) {
                classStyles.push('bg-success');
            }
        }
    }

    private formatGs(gs: number): string {
        return gs ? gs.toFixed(2) : '';
    }

    createHeaderCell(content: string): HTMLTableCellElement {
        const cell = document.createElement('td');
        cell.width = '3%';
        cell.classList.add('cabecalhos');
        cell.innerHTML = content;

        return cell;
    }

    private isSkillsTable(table: HTMLTableElement): boolean {
        // TODO: better check
        return table.rows[0].cells.length > 15;
    }

    // private getHeaderRow(playersTable: HTMLTableElement): HTMLTableRowElement | null {
    //     return playersTable.querySelector<HTMLTableRowElement>('table.table_border tr.table_header');
    // }
}
