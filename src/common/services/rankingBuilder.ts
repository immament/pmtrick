import log from 'loglevel';
import { singleton } from 'tsyringe';

import { FullTrainings } from '@src/common/model/fullTranings.model';
import { PlayerWithSkillsSummaries } from '@src/common/model/player.model';

import { FutureSkillsService } from './futureSkills.service';
import { FuturePredicationSettings } from './settings/futurePredication.settings';

type RankingOptions = FuturePredicationSettings;

type RankingsPerAge = {
    [age: number]: number[];
};

export type Ranking = {
    options: RankingOptions;
    rankingsPerAge: RankingsPerAge;
};

@singleton()
export class RankingBuilder {
    private minRankingAge = 18;
    private maxRankingAge = 28;

    constructor(private futureSkillsService: FutureSkillsService) {}

    private prepareRankingsPerAge(): RankingsPerAge {
        const ranking = {} as RankingsPerAge;
        for (let age = this.minRankingAge; age <= this.maxRankingAge; age++) {
            ranking[age] = [];
        }
        return ranking;
    }

    create(players: PlayerWithSkillsSummaries[], options: RankingOptions): Ranking {
        log.trace('RankingBuilder.create +', options);
        const rankings = this.prepareRankingsPerAge();

        const fullTrainings = new FullTrainings(options);
        for (const player of players) {
            this.calculateForEachAge(player, fullTrainings, rankings);
        }
        return { options, rankingsPerAge: this.sortRanknings(rankings) };
    }

    private sortRanknings(rankings: RankingsPerAge): RankingsPerAge {
        const sortedRankings = this.prepareRankingsPerAge();

        for (const [age, ranking] of Object.entries(rankings)) {
            sortedRankings[Number(age)] = ranking.sort((a, b) => b - a);
        }
        return sortedRankings;
    }

    private calculateForEachAge(
        player: PlayerWithSkillsSummaries,
        fullTrainings: FullTrainings,
        ranking: RankingsPerAge,
    ): void {
        if (!player.skillsSummaries?.current) {
            return;
        }
        for (let toAge = player.age + 1; toAge <= this.maxRankingAge; toAge++) {
            const summary = this.futureSkillsService.countSkillsInFuture(
                player.skillsSummaries.current,
                player.age,
                toAge,
                fullTrainings,
                player.maxTraining ?? 0,
            );
            if (summary?.best?.gs) {
                ranking[toAge].push(summary?.best?.gs);
            }
        }
    }
}
