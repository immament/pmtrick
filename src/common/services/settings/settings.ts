import log from 'loglevel';

import { GsFormula } from '@src/common/model/gsFormula.model';

export const settingsConfig: Record<string, BaseSettings | undefined> = {};

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor = new (...args: unknown[]) => {};

// Settings decorator
export function settings<S extends BaseSettings>(
    key: string,
    defaultValue?: S,
): <T extends Constructor>(constructor: T) => T {
    settingsConfig[key] = defaultValue;
    return <T extends Constructor>(constructor: T) => {
        return constructor;
    };
}

// Future - in separate files
// matches in season
// feature to Age

// gs formula

export abstract class BaseSettings {}

export class GsFormulaSettings extends BaseSettings {
    useDefault = true;
    customFormula?: GsFormula;
}

// Rankings current min-max
// Rankings future min-max

const _rankingsSettingsDefault: RankingsSettings = {
    current: { min: 80, max: 85 },
    future: { min: 80, max: 85 },
    useRanking: 'PlayersRangeRankService',
};
export const _rankingsSettingsKey = 'rankingsSettings';

export interface RankingRange {
    min: number;
    max: number;
}

@settings(_rankingsSettingsKey, _rankingsSettingsDefault)
export class RankingsSettings extends BaseSettings {
    current?: RankingRange;
    future?: RankingRange;
    useRanking?: string;
}

// Transfer list settings

export const _transferListSettingsKey = 'transferListSettings';

const _transferListSettingsDefault: TransferListSettings = {
    hiddenColumns: [],
};
@settings(_transferListSettingsKey, _transferListSettingsDefault)
export class TransferListSettings extends BaseSettings {
    hiddenColumns: string[] = [];
}

export const _teamPlayersSkillsSettingsKey = 'teamPlayersSkillsSettings';

const _teamPlayersSkillsSettingsDefault: TeamPlayersSkillsSettings = {
    hiddenColumns: [],
};
@settings(_teamPlayersSkillsSettingsKey, _teamPlayersSkillsSettingsDefault)
export class TeamPlayersSkillsSettings extends BaseSettings {
    hiddenColumns: string[] = [];
}
