import 'reflect-metadata';

import { PlayersRangeRankService } from '../playersRank.service';
import { RankingsSettings } from '../settings/settings';
import { SettingsRepository } from '../settings/settings.repository';

jest.mock('../settings/settings.repository');

describe('PlayersRangeRankService', () => {
    let playersRangeRankService: PlayersRangeRankService;
    const current = { min: 40, max: 60 };
    const future = { min: 50, max: 90 };

    const settings: RankingsSettings = {
        current,
        future,
    };

    beforeAll(async () => {
        const settingsRepository = new SettingsRepository();
        playersRangeRankService = new PlayersRangeRankService(settingsRepository);

        await playersRangeRankService.init(settings);
    });

    describe('Current rankning', () => {
        it('Value equals min should be 10.', () => {
            const expected = 10;
            const result = playersRangeRankService.getRank(current.min);
            expect(result).toEqual(expected);
        });

        it('Value equals max should be 1.', () => {
            const expected = 1;
            const result = playersRangeRankService.getRank(current.max);
            expect(result).toEqual(expected);
        });
        it('Value greater then max should be 1.', () => {
            const expected = 1;
            const result = playersRangeRankService.getRank(current.max + 10);
            expect(result).toEqual(expected);
        });
        it('Value little lower then max should be 2.', () => {
            const expected = 2;
            const result = playersRangeRankService.getRank(current.max - 0.00001);
            expect(result).toEqual(expected);
        });

        it('Value in the middle should be 6.', () => {
            const expected = 6;
            const result = playersRangeRankService.getRank((current.max + current.min) / 2);
            expect(result).toEqual(expected);
        });
    });

    describe('Future rankning', () => {
        it('Value equals min should be 10.', () => {
            const expected = 10;
            const result = playersRangeRankService.getRank(future.min, 25);
            expect(result).toEqual(expected);
        });

        it('Value equals max should be 1.', () => {
            const expected = 1;
            const result = playersRangeRankService.getRank(future.max, 25);
            expect(result).toEqual(expected);
        });
        it('Value greater then max should be 1.', () => {
            const expected = 1;
            const result = playersRangeRankService.getRank(future.max + 10, 25);
            expect(result).toEqual(expected);
        });
        it('Value little lower then max should be 2.', () => {
            const expected = 2;
            const result = playersRangeRankService.getRank(future.max - 0.00001, 25);
            expect(result).toEqual(expected);
        });

        it('Value in the middle should be 6.', () => {
            const expected = 6;
            const result = playersRangeRankService.getRank((future.max + future.min) / 2, 25);
            expect(result).toEqual(expected);
        });
    });
});
