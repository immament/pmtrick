import 'reflect-metadata';

import { mainGsFormula } from '@src/common/model/gsFormula.model';
import { Player, SkillsSummaries } from '@src/common/model/player.model';
import { SkillsSummary } from '@src/modules/tacticSummary/model/skillsSummary.model';

import { SkillCalculatorService } from '../skillCalculator.service';

describe('SkillCalculatorService', () => {
    it('Calculate gs for skills summary', () => {
        const service = new SkillCalculatorService(mainGsFormula);

        const skillsSummary: SkillsSummary = {
            main: 36,
            secondary: 22,
            physical: 22,
            tertiary: 31,
            position: 'G',
            gs: 0,
        };
        const result = service.gs(skillsSummary);
        expect(result).toBeCloseTo(74.7844, 4);
    });

    it('Calculate skills summaries for all positions', () => {
        const service = new SkillCalculatorService(mainGsFormula);
        const player: Partial<Player> = {
            skills: {
                handling: 16,
                outOfArea: 20,
                reflexes: 9,
                agility: 13,
                tackling: 7,
                heading: 5,
                passing: 7,
                positioning: 5,
                finishing: 2,
                technique: 5,
                speed: 14,
                strength: 8,
            },
            positionZone: 'G',
        };

        const skillsSummary = service.calculateGs(player as Player);

        expect(skillsSummary).toMatchSnapshot();
    });

    it('Should chould best skills summary', () => {
        const service = new SkillCalculatorService(mainGsFormula);

        const expectedBestSummary = {
            gs: 74.78441666666667,
            main: 36,
            physical: 22,
            position: 'G',
            rank: undefined,
            secondary: 22,
            tertiary: 31,
        };

        const summaries: SkillsSummaries = {
            D: {
                gs: 33.407583333333335,
                main: 12,
                physical: 22,
                position: 'D',
                rank: undefined,
                secondary: 12,
                tertiary: 65,
            },
            F: {
                gs: 24.829,
                main: 7,
                physical: 22,
                position: 'F',
                rank: undefined,
                secondary: 10,
                tertiary: 72,
            },
            G: {
                gs: 74.78441666666667,
                main: 36,
                physical: 22,
                position: 'G',
                rank: undefined,
                secondary: 22,
                tertiary: 31,
            },
            M: {
                gs: 33.407583333333335,
                main: 12,
                physical: 22,
                position: 'M',
                rank: undefined,
                secondary: 12,
                tertiary: 65,
            },
        };

        const bestSkillsSummary = service.chooseBestSummary(summaries);

        expect(bestSkillsSummary).toStrictEqual(expectedBestSummary);
        expect(bestSkillsSummary).toBe(summaries.G);
    });
});
