import React, { useState } from 'react';

import { atConfig } from '../advanceTacticsConfig';
import { AdvanceTacticTypes, TacticStats } from '../model/tacticStats.model';

import { AdvanceTactic, AdvanceTacticViewStyle } from './advanceTactic.component';
import { AdvanceTacticOptions } from './advanceTacticOptions.component';

export interface AdvanceTacticsProps {
    stats?: TacticStats;
    statsOld?: TacticStats;
    activeAts: AdvanceTacticTypes[];
}

export function AdvanceTactics(props: AdvanceTacticsProps): JSX.Element {
    const [visibleAts, setVisibleAts] = useState(true);
    const [visibleVsAts, setVisibleVsAts] = useState(false);
    const [viewStyle, setViewStyle] = useState<AdvanceTacticViewStyle>('in-two-rows');
    const { stats, statsOld } = props;

    if (!stats) return <div className="text-center"> no stats</div>;

    return (
        <React.Fragment>
            <div className="pmt-ats container-fluid">
                <AdvanceTacticOptions
                    viewStyle={viewStyle}
                    visibleAts={visibleAts}
                    visibleVsAts={visibleVsAts}
                    onViewStyleChange={setViewStyle}
                    onVisibleAtsChange={setVisibleAts}
                    onVisibleVsAtsChange={setVisibleVsAts}
                ></AdvanceTacticOptions>

                {atConfig.map((at) => (
                    <React.Fragment key={at.key}>
                        {visibleAts && (
                            <AdvanceTactic
                                key={at.key}
                                name={at.name}
                                groups={at.groups}
                                values={stats.ats[at.key]}
                                valuesOld={statsOld?.ats[at.key]}
                                rowStyle={viewStyle}
                                isActive={props.activeAts.includes(at.key)}
                            ></AdvanceTactic>
                        )}
                        {visibleVsAts && (
                            <AdvanceTactic
                                className="opponent"
                                key={'vs-' + at.key}
                                name={'Opponent - ' + at.name}
                                groups={at.vsGroups}
                                values={stats.vsAts[at.key]}
                                valuesOld={statsOld?.vsAts[at.key]}
                                rowStyle={viewStyle}
                                isActive={props.activeAts.includes(at.key)}
                            ></AdvanceTactic>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </React.Fragment>
    );
}
