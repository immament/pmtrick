import log from 'loglevel';
import { injectable } from 'tsyringe';

import { PlayerWithSkillsSummaries, SkillsSummaryCombo } from '@src/common/model/player.model';
import { PlayerSkillsEnum, PlayerSkillsType } from '@src/common/model/playerSkills.model';
import { SkillCalculatorService } from '@src/common/services/skillCalculator.service';
import { TacticEditorData, TacticEditorPosition } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';

import {
    positionGroupToPlayerPosition,
    StatRecord,
    StatsKeys,
    StatsKeysArr,
    StatsPosition,
    StatsPositionKeys,
    TacticStatsSums,
} from '../model/tacticStats.model';

@injectable()
export class TacticSkillsSumsCalculator {
    private statsResult: TacticStatsSums = this.initStatsResult();

    constructor(private readonly skillCaluclatorService: SkillCalculatorService) {}

    calculate(data: TacticEditorData): TacticStatsSums | undefined {
        if (!data.positions?.length) return;
        this.statsResult = this.initStatsResult();
        this.calculateGs(data);

        this.calculateForPositions(data);
        this.calculateSumAll();

        this.calculateAverages();
        log.debug('tacticSkillsSumsCalculator', 'sums:', this.statsResult);
        return this.statsResult;
    }

    private initStatsResult(): TacticStatsSums {
        const result = {} as TacticStatsSums;
        for (const position in StatsPosition) {
            const statRecord = { gs: { sum: 0 }, count: 0 } as StatRecord;
            result[position as StatsPosition] = Object.keys(PlayerSkillsEnum).reduce((acc, skill) => {
                acc[skill as PlayerSkillsEnum] = { sum: 0 };
                return acc;
            }, statRecord);
        }

        return result;
    }

    private calculateGs(data: TacticEditorData<PlayerWithSkillsSummaries>) {
        let index = 0;
        for (const position of data.positions) {
            if (++index > 11) break;
            if (!position.player) continue;
            const skillsSummaries: SkillsSummaryCombo = {
                current: this.skillCaluclatorService.calculateGs(position.player),
            };
            position.player.skillsSummaries = skillsSummaries;
            if (!position) continue;
        }
    }

    private calculateForPositions(data: TacticEditorData): void {
        let index = 0;
        for (const position of data.positions) {
            if (++index > 11) break;
            if (position.positionGroup) {
                this.statsResult[position.positionGroup].count++;
                this.statsResult.all.count++;
            }

            this.caluclateSkillsStats(position);
            this.calculateGsStat(position);
        }
    }

    private calculateSumAll() {
        const stats = this.statsResult;
        for (const skill in PlayerSkillsEnum) {
            const skillEnum = skill as PlayerSkillsEnum;
            stats.all[skillEnum].sum =
                stats.g[skillEnum].sum + stats.d[skillEnum].sum + stats.m[skillEnum].sum + stats.a[skillEnum].sum;
        }
        stats.all.gs.sum = stats.g.gs.sum + stats.d.gs.sum + stats.m.gs.sum + stats.a.gs.sum;
    }

    private round(n: number) {
        return Math.round((n + Number.EPSILON) * 100) / 100;
    }

    private calculateAverages() {
        for (const positionStat of Object.values(this.statsResult)) {
            for (const statKey of StatsKeysArr) {
                const stat = positionStat[statKey];
                stat.avg = this.calculateAvg(stat.sum, positionStat.count);
            }
        }
    }
    private calculateAvg(sum: number, count: number): number | undefined {
        return count > 0 ? this.round(sum / count) : undefined;
    }

    private caluclateSkillsStats(position: TacticEditorPosition): void {
        for (const skill in PlayerSkillsEnum) {
            this.caluclateSkillStat(position, skill as PlayerSkillsType);
        }
    }

    private calculateGsStat({ player, positionGroup }: TacticEditorPosition<PlayerWithSkillsSummaries>) {
        if (positionGroup && player?.skillsSummaries?.current) {
            const playerPosition = positionGroupToPlayerPosition(positionGroup);
            const value = player.skillsSummaries.current[playerPosition].gs;
            if (value) this.addToSumWithRound(positionGroup, 'gs', value);
        }
    }

    private caluclateSkillStat({ player, positionGroup }: TacticEditorPosition, skill: PlayerSkillsType): void {
        if (player && positionGroup) {
            const skillValue = player.skills[skill];
            if (skillValue) this.addToSum(positionGroup, skill, skillValue);
        }
    }

    private addToSum(positionGroup: StatsPositionKeys, statKey: StatsKeys, value: number) {
        this.statsResult[positionGroup][statKey].sum += value;
    }
    private addToSumWithRound(positionGroup: StatsPositionKeys, statKey: StatsKeys, value: number) {
        this.statsResult[positionGroup][statKey].sum = this.round(this.statsResult[positionGroup][statKey].sum + value);
    }
}
