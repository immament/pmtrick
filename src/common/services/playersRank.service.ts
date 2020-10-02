import log from 'loglevel';
import { injectable, singleton } from 'tsyringe';

import { Ranking } from './rankingBuilder';
import { RankingsRepository } from './storage/ranking.repository';

// TODO
@injectable()
export class CurrentPlayersRankService {
    private rankning = [
        75.79,
        75.37,
        75.1,
        75.06,
        73.69,
        71.5,
        68.72,
        65.4,
        63.23,
        60.44,
        59.85,
        58.0,
        54.6,
        52.58,
        51.69,
        45.46,
        35.23,
    ];

    getRank(gs: number): number {
        return this.rankning.findIndex((v) => v < gs) + 1;
    }
}

@singleton()
export class FuturePlayersRankService {
    private rankings?: Ranking;
    constructor(private rankingRepository: RankingsRepository) {}

    async init(onlyIfEmpty = true): Promise<void> {
        if (onlyIfEmpty && this.rankings) {
            return;
        }

        log.debug('FuturePlayersRankService.init: alreadyInit:', !!this.rankings, onlyIfEmpty);
        this.rankings = await this.rankingRepository.get();
    }

    getRank(toAge: number, gs: number): number | undefined {
        if (!this.rankings) {
            return undefined;
        }
        return this.rankings.rankingsPerAge[toAge].findIndex((v) => v < gs) + 1;
    }
}
