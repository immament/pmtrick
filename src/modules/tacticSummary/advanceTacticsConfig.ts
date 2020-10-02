import { AdvanceTacticsValues } from './model/tacticStats.model';

interface AdvanceTacticItem {
    key: keyof AdvanceTacticsValues;
    name: string;
    groups: string[];
    vsGroups: string[];
}
export const atConfig: AdvanceTacticItem[] = [
    {
        name: 'Offside Trap',
        key: 'offside',
        groups: ['Positioning (D)', 'Speed (D)'],
        vsGroups: ['Positioning (F)', 'Speed (F)'],
    },
    {
        name: 'Pressing - High',
        key: 'pressingHigh',
        groups: ['Passing (All)', 'Speed (All)'],
        vsGroups: ['Passing (All)', 'Speed (All)'],
    },
    {
        name: 'Pressing - Low',
        key: 'pressingLow',
        groups: ['Tackling (All)', 'Speed (All) lower best'],
        vsGroups: ['Tackling (All)', 'Speed (All) lower best'],
    },
    {
        name: 'Counter attack',
        key: 'counterAttack',
        groups: ['Passing (All)', 'Speed (All)'],
        vsGroups: ['Passing (All)', 'Speed (All)'],
    },
    {
        name: 'High Balls',
        key: 'highBalls',
        groups: ['Heading (All)', 'Strength (All)'],
        vsGroups: ['Heading (All)', 'Strength (All)'],
    },
    // One condition ATS..
    {
        name: 'Marking - Zonal',
        key: 'markingZonal',
        groups: ['Tackling (D + M)', 'Speed (D + M)', 'AT value'],
        vsGroups: ['Positioning (M + F)', 'Speed (M + F)', 'AT value '],
    },
    {
        name: 'Marking - Man to Man',
        key: 'markingMan',
        groups: ['Tackling (D + M)', 'Strength (D + M)', 'AT value'],
        vsGroups: ['Positioning (M + F)', 'Strength (M + F)', 'AT value '],
    },
    {
        name: 'One on Ones',
        key: 'oneOnOnes',
        groups: ['Technique (M + F)', 'Strength (M + F)', 'AT value'],
        vsGroups: ['Tackling (D + M)', 'Strength (D + M)', 'AT value'],
    },
    {
        name: 'Gk Stand In',
        key: 'gkStand',
        groups: ['Reflex', 'Handling', 'AT value'],
        vsGroups: ['Finishing (F)', 'Heading (F)', 'AT value'],
    },
    {
        name: 'Gk Rushing Out',
        key: 'gkRush',
        groups: ['Agility', 'Crossing', 'AT value'],
        vsGroups: ['Techique (F)', 'Heading (F)', 'AT value'],
    },
    {
        name: 'Long Shots',
        key: 'longShots',
        groups: ['Finishing (M + F)', 'Technique (M + F)', 'AT value'],
        vsGroups: ['Agility (GK)', 'Positioning (D)', 'AT value'],
    },
    {
        name: 'First Time Shots',
        key: 'firstTimeShots',
        groups: ['Finishing (F)', 'Heading (F)', 'AT value'],
        vsGroups: ['Reflexes (GK)', 'Heading (D)', 'AT value'],
    },
];
