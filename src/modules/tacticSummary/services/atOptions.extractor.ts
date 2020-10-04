import log from 'loglevel';
import { singleton } from 'tsyringe';

import { AdvanceTacticTypes } from '../model/tacticStats.model';

type AdvAnceTacticSelectIdsWithValue =
    | 'Offside_Trap_1'
    | 'Pressing_1'
    | 'Pressing_2'
    | 'Counter_Attack_1'
    | 'High_Balls_1'
    | 'One_on_Ones_1'
    | 'Keeping_Style_1'
    | 'Keeping_Style_2'
    | 'Marking_1'
    | 'Marking_2'
    | 'RematesLonge_1'
    | 'RematesPrimeira_1';

const atsConvertMap = new Map<AdvAnceTacticSelectIdsWithValue, AdvanceTacticTypes>([
    ['Offside_Trap_1', 'offside'],
    ['Pressing_1', 'pressingHigh'],
    ['Pressing_2', 'pressingLow'],
    ['Counter_Attack_1', 'counterAttack'],
    ['High_Balls_1', 'highBalls'],
    ['One_on_Ones_1', 'oneOnOnes'],
    ['Keeping_Style_1', 'gkStand'],
    ['Keeping_Style_2', 'gkRush'],
    ['Marking_1', 'markingMan'],
    ['Marking_2', 'markingZonal'],
    ['RematesLonge_1', 'longShots'],
    ['RematesPrimeira_1', 'firstTimeShots'],
]);

@singleton()
export class AtOptionsExtractor {
    extract(): AdvanceTacticTypes[] {
        const atsElements = document.querySelectorAll<HTMLSelectElement>('#adv_options select');
        const ats = Array.from(atsElements).reduce((atsResult, at) => {
            const atResult = atsConvertMap.get(`${at.id}_${at.value}` as AdvAnceTacticSelectIdsWithValue);
            if (atResult) {
                atsResult.push(atResult);
            }
            return atsResult;
        }, [] as AdvanceTacticTypes[]);
        return ats;
    }
}

// type AdvanceTacticSelectIds =
//     | 'Offside_Trap'
//     | 'Pressing'
//     | 'Counter_Attack'
//     | 'High_Balls'
//     | 'One_on_Ones'
//     | 'Keeping_Style'
//     | 'Marking'
//     | 'RematesLonge'
//     | 'RematesPrimeira';
