export class FullTrainings {
    constructor({
        currentSeasonLeagueMatches,
        currentSeasonFriendlyMatches,
        fullSeasonLeagueMatches = 18,
        fullSeasonFriendlyMatches = 12,
    }: {
        currentSeasonLeagueMatches: number;
        currentSeasonFriendlyMatches: number;
        fullSeasonLeagueMatches?: number;
        fullSeasonFriendlyMatches?: number;
    }) {
        this.curentSeason = currentSeasonLeagueMatches + currentSeasonFriendlyMatches / 2;
        this.fullSeason = fullSeasonLeagueMatches + fullSeasonFriendlyMatches / 2;
    }

    curentSeason: number;
    fullSeason: number;
}
