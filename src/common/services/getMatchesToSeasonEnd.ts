export interface SeasonMatches {
    other: number;
    league: number;
}

export function getMatchesToSeasonEnd(seasonDay: number): SeasonMatches {
    const result = { other: 12, league: 18 };
    const week = Math.trunc((seasonDay - 1) / 7);
    const weekDay = (seasonDay - 1) % 7;

    if (week == 0) {
        return result;
    }

    if (week == 1) {
        result.other--;
        if (weekDay >= 2) {
            result.other--;
        }
        return result;
    }

    result.other -= 3 + (week - 2);
    result.league -= (week - 2) * 2;
    if (weekDay >= 2) {
        result.other--;
    }
    if (weekDay >= 4) {
        result.league--;
    }

    return result;
}
