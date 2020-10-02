import { PlayerPositionType } from './player.model';
import { PlayerSkills } from './playerSkills.model';

type Skills = keyof PlayerSkills;

export enum SkillsGroup {
    main = 'main',
    secondary = 'secondary',
    tertiary = 'tertiary',
    // physical = 'physical'
}

export type SkillPartition = {
    [group in SkillsGroup]: Skills[];
};

export type SkillPartitions = {
    [position in PlayerPositionType]: SkillPartition;
};

const skillsPartitions: SkillPartitions = {
    G: {
        main: ['handling', 'outOfArea'],
        secondary: ['reflexes', 'agility'],
        tertiary: ['tackling', 'heading', 'passing', 'positioning', 'finishing', 'technique'],
    },
    D: {
        main: ['tackling', 'heading'],
        secondary: ['passing', 'positioning'],
        tertiary: ['handling', 'outOfArea', 'reflexes', 'agility', 'finishing', 'technique'],
    },
    M: {
        main: ['passing', 'positioning'],
        secondary: ['tackling', 'technique'],
        tertiary: ['handling', 'outOfArea', 'reflexes', 'agility', 'heading', 'finishing'],
    },
    F: {
        main: ['finishing', 'technique'],
        secondary: ['positioning', 'heading'],
        tertiary: ['handling', 'outOfArea', 'reflexes', 'agility', 'tackling', 'passing'],
    },
};

export function getSkillsPartitions(): SkillPartitions {
    return skillsPartitions;
}
