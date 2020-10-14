import React from 'react';

import { RankingRange } from '@src/common/services/settings/settings';

import { RankingFormGroup } from './rankingFormGroup.component';

export interface OnChangeRankingEvent {
    id: string;
    field: keyof RankingRange;
    value: number;
}

export type RankingsSettingsKeys = 'current' | 'future';

export interface RankingOptionsProps {
    onChangeRanking: (event: OnChangeRankingEvent) => void;
    range: RankingRange;
    label: string;
    id: string;
}

export function RankingOptions({ range, label, onChangeRanking, id }: RankingOptionsProps): JSX.Element {
    function handleChangeRanking(event: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = event.target;
        const [, , field] = name.split('_');

        onChangeRanking({ id, field: field as keyof RankingRange, value: Number(value) });
    }
    return (
        <div className="form-group form-group-sm">
            <label className="col-sm-4 control-label">{label}</label>
            <RankingFormGroup
                id={`ranking_${label}_min`}
                onChange={handleChangeRanking}
                value={range.min}
                label="Min"
            ></RankingFormGroup>
            <RankingFormGroup
                id={`ranking_${label}_max`}
                onChange={handleChangeRanking}
                value={range.max}
                label="Max"
            ></RankingFormGroup>
        </div>
    );
}
