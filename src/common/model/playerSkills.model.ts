export interface PlayerSkills {
    tackling: number;
    heading: number;
    passing: number;
    positioning: number;
    finishing: number;
    technique: number;
    speed: number;
    strength: number;
    handling: number;
    outOfArea: number;
    reflexes: number;
    agility: number;
}

export type PlayerSkillsType =
    | 'tackling'
    | 'heading'
    | 'passing'
    | 'positioning'
    | 'finishing'
    | 'technique'
    | 'speed'
    | 'strength'
    | 'handling'
    | 'outOfArea'
    | 'reflexes'
    | 'agility';

export enum PlayerSkillsEnum {
    'tackling' = 'tackling',
    'heading' = 'heading',
    'passing' = 'passing',
    'positioning' = 'positioning',
    'finishing' = 'finishing',
    'technique' = 'technique',
    'speed' = 'speed',
    'strength' = 'strength',
    'handling' = 'handling',
    'outOfArea' = 'outOfArea',
    'reflexes' = 'reflexes',
    'agility' = 'agility',
}
