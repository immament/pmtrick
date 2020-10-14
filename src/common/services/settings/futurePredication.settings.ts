import log from 'loglevel';

import { BaseSettings, settings } from './settings';

export const _futurePredicationSettingsKey = 'futurePredicationSettings';

const _futurePredicationSettingsDefault = {
    currentSeasonLeagueMatches: 0,
    currentSeasonFriendlyMatches: 0,
    fullSeasonLeagueMatches: 12,
    fullSeasonFriendlyMatches: 8,
    futureAge: 25,
};

@settings(_futurePredicationSettingsKey, _futurePredicationSettingsDefault)
export class FuturePredicationSettings extends BaseSettings {
    currentSeasonLeagueMatches = 0;
    currentSeasonFriendlyMatches = 0;
    fullSeasonLeagueMatches = 12;
    fullSeasonFriendlyMatches = 8;
    futureAge = 25;
}
