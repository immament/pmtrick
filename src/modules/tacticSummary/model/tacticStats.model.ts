import { PlayerPositionType } from '@src/common/model/player.model';
import { PlayerSkillsEnum, PlayerSkillsType } from '@src/common/model/playerSkills.model';

export enum StatsPosition {
    'all' = 'all',
    'g' = 'g',
    'd' = 'd',
    'm' = 'm',
    'a' = 'a',
}

const statsPositionKeyToPlayerPositionMap: Record<StatsPositionKeys, PlayerPositionType> = {
    g: 'G',
    d: 'D',
    m: 'M',
    a: 'F',
};

export function positionGroupToPlayerPosition(positionGroup: StatsPositionKeys): PlayerPositionType {
    return statsPositionKeyToPlayerPositionMap[positionGroup];
}

export type StatsPositionKeys = 'g' | 'd' | 'm' | 'a';
export const StatsPositionKeysArr = [...Object.keys(StatsPosition)] as StatsPosition[];

export type StatsKeys = PlayerSkillsType | 'gs';
export const StatsKeysArr = [...Object.keys(PlayerSkillsEnum), 'gs'] as StatsKeys[];

export type PositionStatRecord = { sum: number; avg?: number };

export type StatRecord = Record<StatsKeys, PositionStatRecord> & { count: number };

export type TacticStatsSums = Record<StatsPosition, StatRecord>;

export type AdvanceTacticTypes =
    | 'offside'
    | 'pressingLow'
    | 'pressingHigh'
    | 'counterAttack'
    | 'markingZonal'
    | 'markingMan'
    | 'highBalls'
    | 'oneOnOnes'
    | 'gkStand'
    | 'gkRush'
    | 'longShots'
    | 'firstTimeShots';
export type AdvanceTacticsValues = Record<AdvanceTacticTypes, (number | undefined)[]>;

export class TacticStats {
    ats!: AdvanceTacticsValues;
    vsAts!: AdvanceTacticsValues;

    constructor(statsSums: TacticStatsSums) {
        this.calculateAts(statsSums);
    }

    private calculateAts({ all, g, d, m, a }: TacticStatsSums): void {
        const dmCount = d.count + m.count;
        const dmTacklingAv = (d.tackling.sum + m.tackling.sum) / dmCount;
        const dmStrenghtAv = (d.strength.sum + m.strength.sum) / dmCount;
        const maCount = m.count + a.count;
        const maStrengthAv = (m.strength.sum + a.strength.sum) / maCount;

        const ats = {
            offside: [d.positioning.avg, d.speed.avg],
            pressingLow: [all.tackling.avg, all.speed.avg],
            pressingHigh: [all.passing.avg, all.speed.avg],
            counterAttack: [all.passing.avg, all.speed.avg],
            highBalls: [all.heading.avg, all.strength.avg],
            // Ats with one condition
            markingZonal: [dmTacklingAv, (d.speed.sum + m.speed.sum) / dmCount],
            markingMan: [dmTacklingAv, dmStrenghtAv],
            oneOnOnes: [(m.technique.sum + a.technique.sum) / maCount, maStrengthAv],
            gkStand: [g.reflexes.sum, g.handling.sum],
            gkRush: [g.agility.sum, g.outOfArea.sum],
            longShots: [(m.finishing.sum + a.finishing.sum) / maCount, (m.technique.sum + a.technique.sum) / maCount],
            firstTimeShots: [a.finishing.avg, a.heading.avg],
        };

        this.countAtWithOneConditionAverages(ats);
        this.ats = ats;

        const maPositioningAv = (m.positioning.sum + a.positioning.sum) / maCount;

        const vsAts = {
            offside: [a.positioning.avg, a.speed.avg],
            pressingLow: [all.tackling.avg, all.speed.avg],
            pressingHigh: [all.passing.avg, all.speed.avg],
            counterAttack: [all.passing.avg, all.speed.avg],
            highBalls: [all.heading.avg, all.strength.avg],
            // Ats with one condition
            markingZonal: [maPositioningAv, (m.speed.sum + a.speed.sum) / maCount],
            markingMan: [maPositioningAv, maStrengthAv],
            oneOnOnes: [dmTacklingAv, dmStrenghtAv],
            gkStand: [a.finishing.avg, a.heading.avg],
            gkRush: [a.technique.avg, a.heading.avg],
            longShots: [g.agility.avg, d.positioning.avg],
            firstTimeShots: [g.reflexes.avg, d.heading.avg],
        };

        this.countAtWithOneConditionAverages(vsAts);
        this.vsAts = vsAts;
    }

    private countAtWithOneConditionAverages(ats: AdvanceTacticsValues) {
        this.countAtAverage(ats.markingZonal);
        this.countAtAverage(ats.markingMan);
        this.countAtAverage(ats.oneOnOnes);
        this.countAtAverage(ats.gkStand);
        this.countAtAverage(ats.gkRush);
        this.countAtAverage(ats.longShots);
        this.countAtAverage(ats.firstTimeShots);
    }

    private countAtAverage(at: (number | undefined)[]): void {
        if (at[0] != undefined && at[1] != undefined) {
            at[2] = (at[0] + at[1]) / 2;
        } else {
            at[2] = 0;
        }
    }
}
