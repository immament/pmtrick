import React from 'react';

import { RankingRange } from '@src/common/services/settings/settings';

import { RankingFormGroup } from './rankingFormGroup.control';

interface RankingOptionsProps {
    handleChangeRanking: (event: React.ChangeEvent<HTMLInputElement>) => void;
    range: RankingRange;
    rankingType: 'current' | 'future';
}

export function RankingOptions({ range, rankingType, handleChangeRanking }: RankingOptionsProps): JSX.Element {
    return (
        <div className="form-group form-group-sm">
            <label className="col-sm-4 control-label">
                {rankingType == 'current' ? 'Current ranknig' : 'Future ranking'}
            </label>
            <RankingFormGroup
                id={`ranking_${rankingType}_min`}
                handleChange={handleChangeRanking}
                value={range.min}
                label="Min"
            ></RankingFormGroup>
            <RankingFormGroup
                id={`ranking_${rankingType}_max`}
                handleChange={handleChangeRanking}
                value={range.max}
                label="Max"
            ></RankingFormGroup>
        </div>
    );
}
