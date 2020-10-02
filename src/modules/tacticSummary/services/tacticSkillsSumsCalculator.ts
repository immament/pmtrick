import { injectable } from 'tsyringe';

import { PlayerWithSkillsSummaries, SkillsSummaryCombo } from '@src/common/model/player.model';
import { PlayerSkillsEnum, PlayerSkillsType } from '@src/common/model/playerSkills.model';
import { SkillCalculatorService } from '@src/common/services/skillCalculator.service';
import { TacticEditorData, TacticEditorPosition } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';

import { StatRecord, StatsKeysArr, StatsPosition, TacticStatsSums } from '../model/tacticStats.model';

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

        this.calculateAvg();
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

    private roundAvg(n: number) {
        return Math.round((n + Number.EPSILON) * 100) / 100;
    }

    private calculateAvg() {
        for (const positionStat of Object.values(this.statsResult)) {
            for (const position of StatsKeysArr) {
                const skillStat = positionStat[position];
                skillStat.avg = positionStat.count > 0 ? this.roundAvg(skillStat.sum / positionStat.count) : undefined;
            }
        }
    }

    private caluclateSkillsStats(position: TacticEditorPosition): void {
        for (const skill in PlayerSkillsEnum) {
            this.caluclateStat(position, skill as PlayerSkillsType);
        }
    }

    private calculateGsStat({ player, positionGroup }: TacticEditorPosition<PlayerWithSkillsSummaries>) {
        if (player && positionGroup) {
            const skillValue = player?.skillsSummaries?.current?.best?.gs || 0;
            const currentStat = this.statsResult[positionGroup].gs;
            currentStat.sum = skillValue + currentStat.sum;
        }
    }

    private caluclateStat(position: TacticEditorPosition, skill: PlayerSkillsType): void {
        if (position.player && position.positionGroup) {
            const skillValue = position.player.skills[skill] || 0;
            const currentStat = this.statsResult[position.positionGroup][skill];
            currentStat.sum = skillValue + currentStat.sum;
        }
    }
}
