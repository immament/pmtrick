import log from 'loglevel';

import { BaseSettings, settings } from './settings';

export const _futurePredicationSettingsKey = 'futurePredicationSettings';

@settings(_futurePredicationSettingsKey, new FuturePredicationSettings())
export class FuturePredicationSettings extends BaseSettings {
    currentSeasonLeagueMatches = 0;
    currentSeasonFriendlyMatches = 0;
    fullSeasonLeagueMatches = 12;
    fullSeasonFriendlyMatches = 8;
    futureAge = 25;
}
