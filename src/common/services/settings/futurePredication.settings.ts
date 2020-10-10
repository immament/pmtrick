import log from 'loglevel';

import { BaseSettings, settings } from './settings';

export const _futurePredicationSettingsKey = 'FuturePredication';

// export const _futurePredicationSettingsDeafults = {
//     currentSeasonLeagueMatches: 8, // !to remove
//     currentSeasonFriendlyMatches: 3, // !to remove
//     fullSeasonLeagueMatches: 12,
//     fullSeasonFriendlyMatches: 18,
//     futureAge: 25,
// };

@settings(_futurePredicationSettingsKey, new FuturePredicationSettings())
export class FuturePredicationSettings extends BaseSettings {
    currentSeasonLeagueMatches = 0;
    currentSeasonFriendlyMatches = 0;
    fullSeasonLeagueMatches = 12;
    fullSeasonFriendlyMatches = 8;
    futureAge = 25;
}
