import log from 'loglevel';
import React, { CSSProperties } from 'react';

import { ColorScale } from '@src/common/model/colorScale.model';

import { usePrevValue } from '../hooks/usePrevValue';
import {
    PositionStatRecord,
    StatsKeysArr,
    StatsPosition,
    StatsPositionKeysArr,
    TacticStatsSums,
} from '../model/tacticStats.model';

const statsPositionTexts = {
    all: 'all',
    g: 'Golkeapers',
    d: 'Defenders',
    m: 'Midfielders',
    a: 'Forwards',
};

export function positionToText(pos: StatsPosition): string {
    return statsPositionTexts[pos];
}

export function skillToText(pos: StatsPosition): string {
    return statsPositionTexts[pos];
}

export type TacticSumsProps = {
    sums?: TacticStatsSums;
    sumsOld?: TacticStatsSums;
};

const avgColorScale = new ColorScale(20);
function geValueStyle(value?: number): CSSProperties | undefined {
    if (value === undefined) return;
    return { color: avgColorScale.getHslColor(value) };
}

export function TacticSums({ sums, sumsOld }: TacticSumsProps): JSX.Element {
    return (
        <React.Fragment>
            {!sums ? (
                <div className="text-center">no data</div>
            ) : (
                <table className="pmt-sums table table-condensed table-striped table-hover table-bordered">
                    <SumsTableHeader></SumsTableHeader>
                    <tbody>
                        {StatsKeysArr.map((skill) => (
                            <tr key={skill}>
                                {SumsTableRowHeader(skill)}

                                {StatsPositionKeysArr.map((pos) => {
                                    const stat = sums[pos][skill];
                                    const statOld = sumsOld && sumsOld[pos][skill];
                                    return SumValueCell(pos, stat, statOld);
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </React.Fragment>
    );
}

function SumsTableRowHeader(skill: string) {
    return <th>{skill}</th>;
}

function SumValueCell(pos: StatsPosition, stat: PositionStatRecord, statOld?: PositionStatRecord): JSX.Element {
    const sumDeltaElement = usePrevValue(stat.sum, statOld?.sum, 0);
    const avgDeltaElement = usePrevValue(stat.avg, statOld?.avg);

    if (pos == 'g') {
        return (
            <td key={pos} style={geValueStyle(stat.avg)}>
                {sumDeltaElement} <span>{stat.sum}</span>
            </td>
        );
    }

    return (
        <React.Fragment key={pos}>
            <td key={pos}>
                {sumDeltaElement} <span>{stat.sum}</span>
            </td>
            <td style={geValueStyle(stat.avg)}>
                {avgDeltaElement} <span>{stat.avg}</span>
            </td>
        </React.Fragment>
    );
}

function SumsTableHeader(): JSX.Element {
    return (
        <thead>
            <tr>
                <th>Skill</th>
                {StatsPositionKeysArr.map((pos) => {
                    const thProps = pos == 'g' ? { className: 'pmt-gk' } : { colSpan: 2 };
                    return (
                        <th key={pos} {...thProps}>
                            {positionToText(pos)}
                        </th>
                    );
                })}
            </tr>
            <tr>
                <th></th>

                {StatsPositionKeysArr.map((pos) => {
                    if (pos == 'g') return <th key={pos}>Sum</th>;
                    return (
                        <React.Fragment key={pos}>
                            <th>Sum</th>
                            <th>Avg</th>
                        </React.Fragment>
                    );
                })}
            </tr>
        </thead>
    );
}
