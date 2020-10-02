import { Player, TlPlayer } from '@src/common/model/player.model';

import { DetailsTooltipExtractor } from './extractFromDetailsTooltip';
import { HtmlElementExtractor } from './htmlElement.mapper';
import { PlayerRowExtractor } from './playerRowExtractor';

export interface PlayerRowExtractorContract extends HtmlElementExtractor<HTMLTableRowElement, Player> {
    extract(row: HTMLTableRowElement): Player;
}

/** *******************************************
 * mapPlayerRowFromAndvenceTl
 **/
const mapPlayerRowFromAndvenceTlCellsConfig = {
    position: 0,
    name: 1,
    age: 2,
    firstSkill: 4,
    wage: 16,
    transfer: {
        price: 17,
        deadline: 19,
    },
    detailsTooltip: 18,
};

export class AndvenceTlPlayerRowExtractor implements PlayerRowExtractorContract {
    extract(row: HTMLTableRowElement): Player {
        const cellsConfig = mapPlayerRowFromAndvenceTlCellsConfig;
        const extractor = new PlayerRowExtractor(row);

        const positionText = extractor.getText(cellsConfig.position);

        let player = {
            position: positionText,
            positionZone: extractor.fullPositionToZone(positionText),
            name: extractor.getText(cellsConfig.name),
            age: extractor.getNumber(cellsConfig.age),
            skills: extractor.getSkills(cellsConfig.firstSkill),
            wage: extractor.getText(cellsConfig.wage),
            price: extractor.getText(cellsConfig.transfer.price),
            deadline: extractor.getText(cellsConfig.transfer.deadline),
        } as TlPlayer;

        const detailsTooltipExtractor = new DetailsTooltipExtractor();
        const playerTip = detailsTooltipExtractor.extract(row.cells[cellsConfig.detailsTooltip]);
        if (playerTip) {
            player = { ...player, ...playerTip };
        }

        return player;
    }
}

/* /********************************************
 *  mapPlayerRowFromTeamSkills
 **/

const mapPlayerRowFromTeamSkillsCellsConfig = {
    position: 1,
    name: 2,
    age: 3,
    firstSkill: 5,
};

export class TeamSkillsPlayerRowExtractor implements PlayerRowExtractorContract {
    extract(row: HTMLTableRowElement): Player {
        const cellsConfig = mapPlayerRowFromTeamSkillsCellsConfig;
        const extractor = new PlayerRowExtractor(row);

        const positionText = extractor.getText(cellsConfig.position);

        const player = {
            position: positionText,
            positionZone: extractor.fullPositionToZone(positionText),
            name: extractor.getText(cellsConfig.name),
            age: extractor.getNumber(cellsConfig.age),
            skills: extractor.getSkills(cellsConfig.firstSkill),
        } as Player;

        return player;
    }
}

/* FACTORY *******************************************/
export function getPlayerMapper(): PlayerRowExtractorContract | undefined {
    const url = window.location.href;

    if (url.indexOf('procurar.asp') >= 0) {
        return new AndvenceTlPlayerRowExtractor();
    } else if (url.indexOf('plantel.asp') >= 0) {
        return new TeamSkillsPlayerRowExtractor();
    }
    return undefined;
}
