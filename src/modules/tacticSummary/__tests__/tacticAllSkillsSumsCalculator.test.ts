import 'reflect-metadata';

import { container } from 'tsyringe';

import { GsFormula, tempGsFormula } from '@src/common/model/gsFormula.model';
import { TacticEditorData, TacticEditorPlayer } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';

import { TacticSkillsSumsCalculator } from '../services/tacticSkillsSumsCalculator';

describe('TacticAllSkillsSumCalculator', () => {
    beforeAll(() => {
        container.registerInstance<GsFormula>('GsFormula', tempGsFormula);
    });
    it('should create', () => {
        const calculator = container.resolve(TacticSkillsSumsCalculator);

        expect(calculator).toBeTruthy();
    });

    it('should calculate sum for one stat for all positions', () => {
        const calculator = container.resolve(TacticSkillsSumsCalculator);

        const result = calculator.calculate(mockData);
        expect(result).toMatchSnapshot();

        // expect(result).toStrictEqual(expectedResult);
    });
});

const mockData: TacticEditorData = {
    positions: [
        {
            id: '1000',
            position: 'gk',
            positionGroup: 'g',
            player: { skills: { speed: 11, strength: 6 } } as TacticEditorPlayer,
        },
        {
            id: '1001',
            position: 'dc1',
            positionGroup: 'd',
            player: { skills: { speed: 5, strength: 20 } } as TacticEditorPlayer,
        },
        {
            id: '1002',
            position: 'md',
            positionGroup: 'm',
            player: { skills: { speed: 11, strength: 0 } } as TacticEditorPlayer,
        },
        {
            id: '1002',
            position: 'mc1',
            positionGroup: 'm',
            player: { skills: { speed: 12, strength: 9 } } as TacticEditorPlayer,
        },
        {
            id: '1002',
            position: 'mc3',
            positionGroup: 'm',
            player: { skills: { speed: 20, strength: 1 } } as TacticEditorPlayer,
        },
        {
            id: '1003',
            position: 'a',
            positionGroup: 'a',
            player: { skills: { speed: 0, strength: 2 } } as TacticEditorPlayer,
        },
    ],
};
