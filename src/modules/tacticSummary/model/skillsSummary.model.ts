import { PlayerPositionType } from '../../../common/model/player.model';

export interface SkillsSummary {
    main: number;
    secondary: number;
    tertiary: number;
    physical: number;
    gs: number;
    position: PlayerPositionType;
    rank?: number;
}

type SkillsGroups = 'main' | 'secondary' | 'physical' | 'tertiary';

export const skillsSummaryOrder: SkillsGroups[] = ['main', 'secondary', 'physical', 'tertiary'];
