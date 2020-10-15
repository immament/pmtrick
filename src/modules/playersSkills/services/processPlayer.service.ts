import log from 'loglevel';
import { injectable } from 'tsyringe';

import { FullTrainings } from '@src/common/model/fullTranings.model';
import {
    FutureSkillsSummaryWithBest,
    Player,
    playerPositionValues,
    PlayerWithSkillsSummaries,
    SkillsSummaryCombo,
} from '@src/common/model/player.model';
import { PlayersRankService, PlayersRankServiceFactory } from '@src/common/services/playersRank.service';
import { FuturePredicationSettings } from '@src/common/services/settings/futurePredication.settings';
import { RankingsSettings } from '@src/common/services/settings/settings';

import { FutureSkillsService } from '../../../common/services/futureSkills.service';
import { SkillCalculatorService } from '../../../common/services/skillCalculator.service';

import { _potentialConfig } from './playersSkillsView.service';

@injectable()
export class ProcessPlayerService {
    private fullTrainings?: FullTrainings;
    private futureAge?: number;
    private futurePredicationSettings?: FuturePredicationSettings;

    private rankService?: PlayersRankService;

    constructor(
        private readonly skillCaluclatorService: SkillCalculatorService,
        private readonly futureSkillsService: FutureSkillsService,
        private readonly playersRankServiceFactory: PlayersRankServiceFactory,
    ) {}

    refreshFuturePredicationSettings(futurePredicationSettings?: FuturePredicationSettings): void {
        log.trace('refreshSettings:', futurePredicationSettings);
        if (futurePredicationSettings) {
            this.futureAge = futurePredicationSettings.futureAge;
            this.fullTrainings = new FullTrainings(futurePredicationSettings);
            this.futurePredicationSettings = futurePredicationSettings;
        }
    }

    async prepareRankings(rankingsSettings?: RankingsSettings): Promise<void> {
        if (!rankingsSettings) return;
        if (!this.rankService) {
            this.rankService = await this.playersRankServiceFactory.getRanking(rankingsSettings);
        } else {
            this.rankService.init(rankingsSettings);
        }
    }

    updatePlayerRanking(skillsSummaryCombo?: SkillsSummaryCombo): void {
        if (!skillsSummaryCombo || !this.rankService) return;
        if (skillsSummaryCombo.current) {
            this.updateRankingPerPositon(skillsSummaryCombo.current, this.rankService);
        }
        if (skillsSummaryCombo.future) {
            this.updateRankingPerPositon(
                skillsSummaryCombo.future,
                this.rankService,
                this.futurePredicationSettings?.futureAge,
            );
        }
        if (skillsSummaryCombo.futureMax) {
            this.updateRankingPerPositon(
                skillsSummaryCombo.futureMax,
                this.rankService,
                this.futurePredicationSettings?.futureAge,
            );
        }
    }

    private updateRankingPerPositon(
        skillsSummary: FutureSkillsSummaryWithBest,
        rankService: PlayersRankService,
        futureAge?: number,
    ) {
        playerPositionValues.forEach((positionType) => {
            const summary = skillsSummary[positionType];
            summary.rank = rankService.getRank(summary.gs, futureAge);
        });
    }

    // Oblicza dodatkowe dane graczy
    processPlayer(player: Player): PlayerWithSkillsSummaries {
        const skillsSummaries: SkillsSummaryCombo = {
            current: this.skillCaluclatorService.calculateGs(player),
        };
        if (skillsSummaries.current && this.futureAge && this.fullTrainings) {
            if (player.maxTraining) {
                skillsSummaries.future = this.futureSkillsService.countSkillsInFuture(
                    skillsSummaries.current,
                    player.age,
                    this.futureAge,
                    this.fullTrainings,
                    player.maxTraining,
                    this.futurePredicationSettings,
                );
            } else {
                const potentialDelta = _potentialConfig[player.potential];

                if (potentialDelta) {
                    skillsSummaries.future = this.futureSkillsService.countSkillsInFuture(
                        skillsSummaries.current,
                        player.age,
                        this.futureAge,
                        this.fullTrainings,
                        potentialDelta.min,
                        this.futurePredicationSettings,
                    );

                    skillsSummaries.futureMax = this.futureSkillsService.countSkillsInFuture(
                        skillsSummaries.current,
                        player.age,
                        this.futureAge,
                        this.fullTrainings,
                        potentialDelta.max,
                        this.futurePredicationSettings,
                    );
                }
            }
        }
        return { ...player, skillsSummaries };
    }
}
