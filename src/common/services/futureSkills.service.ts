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

import { FuturePredicationSettings } from './settings/futurePredication.settings';
import { SkillCalculatorService } from './skillCalculator.service';

@injectable()
export class FutureSkillsService {
    constructor(private skillsCalculator: SkillCalculatorService) {}

    public countSkillsInFuture(
        currentSkillsSummaries: SkillsSummaries,
        playerAge: number,
        toAge: number,
        fullTranings: FullTrainings,
        delta: number,
        options?: FuturePredicationSettings,
    ): FutureSkillsSummaryWithBest | undefined {
        if (!currentSkillsSummaries) {
            log.trace('No player.skillsSummaries');
            return;
        }

        const seasons = toAge - playerAge;
        if (seasons <= 0) {
            return;
        }
        const skillsDelta = this.countSkillsDelta(delta, seasons, playerAge, fullTranings);
        const futureSkillsSummaries = this.skillsInFutureForAllPositions(currentSkillsSummaries, skillsDelta);
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

        // log.trace("seasonsTo20: %s, seasonsAbove20: %s", seasonsTo20, seasonsAbove20);
        // log.trace("deltaCurrentSeason: %s, deltaTo20 + deltaCurrentSeason: %s, deltaAbove20: %s"
        // , deltaCurrentSeason, deltaTo20 + deltaCurrentSeason, deltaAbove20);
        return deltaCurrentSeason + deltaTo20 + deltaAbove20;
    }

    private skillsInFuture(skillsSummary: SkillsSummary, delta: number, position: PlayerPositionType): SkillsSummary {
        const future = { position } as SkillsSummary;

        let rest = delta;
        for (const skillsGroup of skillsSummaryOrder) {
            if (rest > 0) {
                future[skillsGroup] = Math.min(skillsSummary[skillsGroup] + rest, 40);
                rest -= future[skillsGroup] - skillsSummary[skillsGroup];
            } else {
                future[skillsGroup] = skillsSummary[skillsGroup];
            }
        }

        future.gs = this.skillsCalculator.gs(future);
        // future.rank = this.playersRankService.getRank(future.gs, toAge);

        return future;
    }

    private skillsInFutureForAllPositions(skillsSummaries: SkillsSummaries, delta: number): SkillsSummaries {
        return playerPositionValues.reduce((future, position) => {
            const summary = skillsSummaries[position];
            future[position] = this.skillsInFuture(summary, delta, position);
            return future;
        }, {} as SkillsSummaries);
    }
}
