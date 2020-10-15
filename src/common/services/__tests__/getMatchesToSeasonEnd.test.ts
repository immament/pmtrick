import 'reflect-metadata';

import { getMatchesToSeasonEnd, SeasonMatches } from '../getMatchesToSeasonEnd';

describe('getMatchesToSeasonEnd', () => {
    it('First week, day 7', () => {
        const expected: SeasonMatches = { league: 18, other: 12 };
        const result = getMatchesToSeasonEnd(7);
        expect(result).toEqual(expected);
    });

    it('Second week, day 1', () => {
        const expected: SeasonMatches = { league: 18, other: 9 };
        const result = getMatchesToSeasonEnd(15);
        expect(result).toEqual(expected);
    });

    it('Second week, day 3', () => {
        const expected: SeasonMatches = { league: 18, other: 8 };
        const result = getMatchesToSeasonEnd(17);
        expect(result).toEqual(expected);
    });
    it('week 3, day 3', () => {
        const expected: SeasonMatches = { league: 14, other: 6 };
        const result = getMatchesToSeasonEnd(31);
        expect(result).toEqual(expected);
    });
    it('week 3, day 6', () => {
        const expected: SeasonMatches = { league: 13, other: 6 };
        const result = getMatchesToSeasonEnd(34);
        expect(result).toEqual(expected);
    });

    it('week 4, day 3', () => {
        const expected: SeasonMatches = { league: 12, other: 5 };
        const result = getMatchesToSeasonEnd(38);
        expect(result).toEqual(expected);
    });
    it('week 11, day 7', () => {
        const expected: SeasonMatches = { league: 1, other: 0 };
        const result = getMatchesToSeasonEnd(77);
        expect(result).toEqual(expected);
    });
});
