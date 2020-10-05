import { MatchesInSeasons } from '@src/common/services/storage/skillsTableOptions.repository';

import { SkillsSummary } from '../../modules/tacticSummary/model/skillsSummary.model';

import { PlayerSkills } from './playerSkills.model';

export type PlayerPositionType = 'G' | 'D' | 'M' | 'F';
export const playerPositionValues: PlayerPositionType[] = ['G', 'D', 'M', 'F'];

export enum PlayerPositionEnum {
    G,
    D,
    M,
    F,
}

export function isPlayerPosition(pos: string): pos is PlayerPositionType {
    return pos in playerPositionValues;
}

export enum PlayerQuality {
    'Terrible',
    'Very Bad',
    'Bad',
    'Low',
    'Passable',
    'Good',
    'Very Good',
    'Excellent',
    'Formidable',
    'World Class',
}

export type SkillsSummaries = {
    [position in PlayerPositionType]: SkillsSummary;
};

export interface PlayerWithSkillsSummaries extends Player {
    skillsSummaries?: SkillsSummaryCombo;
}

export interface SkillsSummaryWithBest extends SkillsSummaries {
    best?: SkillsSummary;
}

export interface FutureSkillsSummaryWithBest extends SkillsSummaryWithBest {
    options?: MatchesInSeasons;
}

export interface SkillsSummaryCombo {
    current?: SkillsSummaryWithBest;
    future?: FutureSkillsSummaryWithBest;
    futureMax?: FutureSkillsSummaryWithBest;
}

export interface Player {
    age: number;
    experience: PlayerQuality;
    experienceText: string;
    fitness: number;
    form?: string;
    id: number;
    maxTraining?: number;
    name: string;
    penalties: PlayerQuality;
    penaltiesText: string;
    position: string;
    positionZone: PlayerPositionType;
    potential: PlayerQuality;
    potentialText: string;
    quality: PlayerQuality;
    qualityText: string;
    skills: PlayerSkills;
    talent?: number;
    talentText?: string;
    temperament?: string | number; // TODO: enum
    value?: number;
    wage?: number;
}

export interface TlPlayer extends Player {
    deadline: string | number;
    price: string | number;
}
