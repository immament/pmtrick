import 'reflect-metadata';

import { TacticStatsCalculator } from '../services/tacticStatsCalculator';

describe('TacticStatsCalculator', () => {
    it('should create', () => {
        const calculator = new TacticStatsCalculator();

        expect(calculator).toBeTruthy();
    });

    it('should calculate sum for one stat for all positions', () => {
        // TODO
    });

    it('should calculate sum for one stat for one position', () => {
        // TODO
    });

    it('should result empty object if no players', () => {
        // TODO
    });

    it('should calculate sums', () => {
        // TODO
    });
});
