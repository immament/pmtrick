import { TacticStats } from '../model/tacticStats.model';

import { tacticSumsPropsMock } from './data/tacticSumsProps.data';

describe('Tactic Stats', () => {
    it('should calculate stats...', () => {
        const result = new TacticStats(tacticSumsPropsMock.getSums());
        expect(result).toMatchSnapshot();
    });
});
