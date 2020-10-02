import log from 'loglevel';
import { injectable } from 'tsyringe';

import { FullTrainings } from '@src/common/model/fullTranings.model';
import {
    FutureSkillsSummaryWithBest,
    PlayerPositionType,
    playerPositionValues,
    SkillsSummaries,
} from '@src/common/model/player.model';
import { SkillsSummary, skillsSummaryOrder } from '@src/modules/tacticSummary/model/skillsSummary.model';

import { FuturePlayersRankService } from './playersRank.service';
import { SkillCalculatorService } from './skillCalculator.service';
import { MatchesInSeasons } from './storage/skillsTableOptions.repository';

@injectable()
export class FutureSkillsService {
    constructor(
        private skillsCalculator: SkillCalculatorService,
        private playersRankService: FuturePlayersRankService,
    ) {}

    public countSkillsInFuture(
        currentSkillsSummaries: SkillsSummaries,
        playerAge: number,
        toAge: number,
        fullTranings: FullTrainings,
        delta: number,
        options?: MatchesInSeasons,
    ): FutureSkillsSummaryWithBest | undefined {
        if (!currentSkillsSummaries) {
            log.debug('No player.skillsSummaries');
            return;
        }

        const seasons = toAge - playerAge;
        if (seasons <= 0) {
            return;
        }
        const skillsDelta = this.countSkillsDelta(delta, seasons, playerAge, fullTranings);
        const futureSkillsSummaries = this.skillsInFutureForAllPositions(currentSkillsSummaries, skillsDelta, toAge);
        const futureSkillsBest = this.skillsCalculator.chooseBestSummary(futureSkillsSummaries);

        return { ...futureSkillsSummaries, best: futureSkillsBest, options };
    }

    private countSkillsDelta(delta: number, seasons: number, playerAge: number, fullTranings: FullTrainings): number {
        const seasonsTo20 = Math.min(Math.max(20 - playerAge, 0), seasons - 1);
        const seasonsAbove20 = seasons - 1 - seasonsTo20;

        const deltaAllSeason = delta * fullTranings.fullSeason;

        const deltaCurrentSeason = delta * fullTranings.curentSeason;
        const deltaTo20 = deltaAllSeason * seasonsTo20;
        const deltaAbove20 = (deltaAllSeason * 0.75 * (1 - Math.pow(0.75, seasonsAbove20))) / 0.25;

        // log.debug("seasonsTo20: %s, seasonsAbove20: %s", seasonsTo20, seasonsAbove20);
        // log.debug("deltaCurrentSeason: %s, deltaTo20 + deltaCurrentSeason: %s, deltaAbove20: %s"
        // , deltaCurrentSeason, deltaTo20 + deltaCurrentSeason, deltaAbove20);
        return deltaCurrentSeason + deltaTo20 + deltaAbove20;
    }

    private skillsInFuture(
        skillsSummary: SkillsSummary,
        delta: number,
        position: PlayerPositionType,
        toAge: number,
    ): SkillsSummary {
        const future = { position } as SkillsSummary;

        let rest = delta;
        for (const element of skillsSummaryOrder) {
            if (rest > 0) {
                future[element] = Math.min(skillsSummary[element] + rest, 40);
                rest -= future[element] - skillsSummary[element];
            } else {
                future[element] = skillsSummary[element];
            }
        }

        future.gs = this.skillsCalculator.gs(future);
        future.rank = this.playersRankService.getRank(toAge, future.gs);

        return future;
    }

    private skillsInFutureForAllPositions(
        skillsSummaries: SkillsSummaries,
        delta: number,
        toAge: number,
    ): SkillsSummaries {
        return playerPositionValues.reduce((future, position) => {
            const summary = skillsSummaries[position];
            future[position] = this.skillsInFuture(summary, delta, position, toAge);
            return future;
        }, {} as SkillsSummaries);
    }
}
