import log from 'loglevel';

import { BaseSettings, settings } from './settings';

export const _futurePredicationSettingsKey = 'futurePredicationSettings';

const _futurePredicationSettingsDefault = {
    currentSeasonLeagueMatches: 18,
    currentSeasonFriendlyMatches: 12,
    fullSeasonLeagueMatches: 18,
    fullSeasonFriendlyMatches: 12,
    futureAge: 25,
};

@settings(_futurePredicationSettingsKey, _futurePredicationSettingsDefault)
export class FuturePredicationSettings extends BaseSettings {
    currentSeasonLeagueMatches = 18;
    currentSeasonFriendlyMatches = 12;
    fullSeasonLeagueMatches = 18;
    fullSeasonFriendlyMatches = 12;
    futureAge = 25;
}
