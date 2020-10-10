import log from 'loglevel';
import { container, registry, singleton } from 'tsyringe';

import { Ranking } from './rankingBuilder';
import { _rankingsSettingsKey, RankingRange, RankingsSettings } from './settings/settings';
import { SettingsRepository } from './settings/settings.repository';
import { RankingsRepository } from './storage/ranking.repository';

export interface PlayersRankService {
    getRank(value: number, toAge?: number): number | undefined;
    init(settings?: RankingsSettings): Promise<void>;
}

@singleton()
export class FuturePlayersTeamRankService implements PlayersRankService {
    private rankings?: Ranking;
    constructor(private rankingRepository: RankingsRepository) {}

    async init(_settings: RankingsSettings, onlyIfEmpty = true): Promise<void> {
        if (onlyIfEmpty && this.rankings) {
            return;
        }

        log.trace('FuturePlayersRankService.init: alreadyInit:', !!this.rankings, onlyIfEmpty);
        this.rankings = await this.rankingRepository.get();
    }

    getRank(value: number, toAge?: number): number | undefined {
        if (!this.rankings || !toAge) {
            return;
        }
        return this.rankings.rankingsPerAge[toAge].findIndex((v) => v < value) + 1;
    }
}

@singleton()
export class PlayersRangeRankService implements PlayersRankService {
    private _rankingSize = 10;

    private settings?: RankingsSettings;
    private currentRanking?: number[];
    private futureRanking?: number[];

    constructor(private settingsRepository: SettingsRepository) {}

    async init(settings?: RankingsSettings): Promise<void> {
        this.settings = settings || (await this.settingsRepository.getSettings<RankingsSettings>(_rankingsSettingsKey));
        this.currentRanking = this.createRanking(this.settings.current);
        this.futureRanking = this.createRanking(this.settings.future);
    }

    private createRanking(range?: RankingRange): number[] | undefined {
        if (!range || range.max <= range.min) {
            return;
        }

        const delta = (range.max - range.min) / this._rankingSize;
        const rankning: number[] = [];
        for (let value = range.max, i = 0; i <= this._rankingSize; value -= delta, i++) {
            rankning[i] = value;
        }
        return rankning;
    }

    private getRangeRank(ranking: number[], value: number) {
        return ranking.findIndex((v) => v < value) + 1;
    }

    getRank(value: number, toAge?: number): number | undefined {
        if (toAge) {
            return this.futureRanking && this.getRangeRank(this.futureRanking, value);
        }
        return this.currentRanking && this.getRangeRank(this.currentRanking, value);
    }
}

@registry([{ token: 'PlayersRangeRankService', useToken: PlayersRangeRankService }])
@singleton()
export class PlayersRankServiceFactory {
    async getRanking(rankSettings: RankingsSettings): Promise<PlayersRankService | undefined> {
        const useRanking = rankSettings.useRanking || 'PlayersRangeRankService';
        const ranking = container.resolve<PlayersRankService>(useRanking);
        await ranking.init();
        return ranking;
    }
}
