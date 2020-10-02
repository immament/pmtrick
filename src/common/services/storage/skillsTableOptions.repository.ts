import log from 'loglevel';
import { injectable } from 'tsyringe';

export enum SkillsTableOptionsKeys {
    currentSeasonLeagueMatches = 'currentSeasonLeagueMatches',
    currentSeasonFriendlyMatches = 'currentSeasonFriendlyMatches',
    fullSeasonLeagueMatches = 'fullSeasonLeagueMatches',
    fullSeasonFriendlyMatches = 'fullSeasonFriendlyMatches',
    futureAge = 'futureAge',
}

export const maxMatchesInSeasons = {
    currentSeasonLeagueMatches: 7,
    currentSeasonFriendlyMatches: 3,
    fullSeasonLeagueMatches: 18,
    fullSeasonFriendlyMatches: 12,
    futureAge: 28,
} as MatchesInSeasons;

const _deafults = {
    currentSeasonLeagueMatches: 8,
    currentSeasonFriendlyMatches: 3,
    fullSeasonLeagueMatches: 12,
    fullSeasonFriendlyMatches: 18,
    futureAge: 25,
};

const _moduleName = 'skillsTableOptions';

export type MatchesInSeasons = {
    currentSeasonLeagueMatches: number;
    currentSeasonFriendlyMatches: number;
    fullSeasonLeagueMatches: number;
    fullSeasonFriendlyMatches: number;
    futureAge: number;
};

@injectable()
export class SkillsTableOptionsRepository {
    async getOptions(): Promise<MatchesInSeasons> {
        const result = await browser.storage.local.get(_moduleName);
        log.debug('getOptions:', result);

        const options = (result[_moduleName] as MatchesInSeasons) ?? {};

        this.applyDefaults(options);

        return options;
    }

    save(value: MatchesInSeasons): Promise<void> {
        log.debug('save:', value);
        return browser.storage.local.set({ [_moduleName]: value });
    }

    private applyDefaults(options: MatchesInSeasons): void {
        for (const item in SkillsTableOptionsKeys) {
            const key = item as keyof MatchesInSeasons;
            if (options[key] === undefined) {
                options[key] = _deafults[key];
            }
        }
    }
}
