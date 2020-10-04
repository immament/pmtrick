import { inject, injectable } from 'tsyringe';

import {
    Player,
    PlayerPositionType,
    playerPositionValues,
    SkillsSummaries,
    SkillsSummaryWithBest,
} from '@src/common/model/player.model';
import { PlayerSkills } from '@src/common/model/playerSkills.model';
import { getSkillsPartitions, SkillPartition, SkillsGroup } from '@src/common/model/skillPartition.model';
import { SkillsSummary } from '@src/modules/tacticSummary/model/skillsSummary.model';

import { CurrentPlayersRankService } from './playersRank.service';

import type { GsFormula } from '@src/common/model/gsFormula.model';

@injectable()
export class SkillCalculatorService {
    constructor(
        @inject('GsFormula') private readonly _gsFormula: GsFormula,
        private playersRankService?: CurrentPlayersRankService,
    ) {}

    private _skillsPartitions = getSkillsPartitions();

    private getPartition(position: PlayerPositionType): SkillPartition {
        return this._skillsPartitions[position];
    }

    public calculateGs(player: Player): SkillsSummaryWithBest {
        const skillsSummaries = this.calculateSkillsSummaries(player);
        const best = this.chooseBestSummary(skillsSummaries);
        return { best, ...skillsSummaries };
    }

    public chooseBestSummary(skillsSummaries: SkillsSummaries): SkillsSummary {
        return Object.values(skillsSummaries).reduce((max, summary) => {
            if (max) {
                return max.gs > summary.gs ? max : summary;
            }
            return summary;
        });
    }

    private calculateSkillsSummary(
        { skills }: Player,
        partition: SkillPartition,
        position: PlayerPositionType,
    ): SkillsSummary {
        const summary = {
            main: this.sumSkills(skills, partition, SkillsGroup.main),
            secondary: this.sumSkills(skills, partition, SkillsGroup.secondary),
            tertiary: this.sumSkills(skills, partition, SkillsGroup.tertiary),
            physical: skills.speed + skills.strength,
            position,
        } as SkillsSummary;

        summary.gs = this.gs(summary, this._gsFormula);
        summary.rank = this.playersRankService?.getRank(summary.gs);
        return summary;
    }

    private calculateSkillsSummaries(player: Player): SkillsSummaries {
        const summaries = {} as SkillsSummaries;
        for (const position of playerPositionValues) {
            const partition = this.getPartition(position);
            const skillsSummary = this.calculateSkillsSummary(player, partition, position);
            summaries[position] = skillsSummary;
        }
        return summaries;
    }

    public gs(skillsSummary: SkillsSummary, gsFormula?: GsFormula): number {
        if (!gsFormula) {
            gsFormula = this._gsFormula;
        }
        return (
            (skillsSummary.main * gsFormula.main +
                skillsSummary.secondary * gsFormula.secondary +
                skillsSummary.physical * gsFormula.physical +
                (skillsSummary.tertiary * gsFormula.tertiary) / 3) /
            40
        );
    }

    private sumSkills(skills: PlayerSkills, partition: SkillPartition, level: SkillsGroup): number {
        return partition[level].reduce((sum, skill) => {
            sum += skills[skill];
            return sum;
        }, 0);
    }

    // private countSeasonsMinMaxDelta(potential: number, fullSeasons: number): { min: number, max: number } {
    //     const potentialData = this.potentialConfig[potential];
    //     return {
    //         min: potentialData.seasonMin * fullSeasons + potentialData.min * this.fullTranings.curentSeason,
    //         max: potentialData.seasonMax * fullSeasons + potentialData.max * this.fullTranings.curentSeason
    //     }
    // }
}
