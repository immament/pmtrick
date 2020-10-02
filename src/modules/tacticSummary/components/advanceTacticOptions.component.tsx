import log from 'loglevel';
import React from 'react';

import { AdvanceTacticViewStyle } from './advanceTactic.component';

export type AdvanceTacticOptionsProps = {
    visibleAts: boolean;
    visibleVsAts: boolean;
    viewStyle: AdvanceTacticViewStyle;
    onVisibleAtsChange: (isVisible: boolean) => void;
    onVisibleVsAtsChange: (isVisible: boolean) => void;
    onViewStyleChange: (style: AdvanceTacticViewStyle) => void;
};

export const AdvanceTacticOptions = React.memo(function AdvanceTacticOptions({
    visibleAts,
    visibleVsAts,
    viewStyle,
    ...props
}: AdvanceTacticOptionsProps): JSX.Element {
    log.debug('AdvanceTacticOptions.component', 'RENDER +');
    return (
        <div className="row panel panel-default pmt-ats-options">
            <div className="panel-body">
                <div className="pmt-ats-option">
                    <label className="checkbox-inline">
                        <input
                            type="checkbox"
                            name="ats"
                            checked={visibleAts}
                            onChange={() => props.onVisibleAtsChange(!visibleAts)}
                        />
                        Ats
                    </label>
                    <label className="checkbox-inline">
                        <input
                            type="checkbox"
                            name="vsAts"
                            checked={visibleVsAts}
                            onChange={() => props.onVisibleVsAtsChange(!visibleVsAts)}
                        />
                        Opponent Ats
                    </label>
                </div>
                <div className="pmt-ats-row-view-option">
                    <label className="radio-inline">
                        <input
                            type="radio"
                            checked={viewStyle === 'in-two-rows'}
                            onChange={() => props.onViewStyleChange('in-two-rows')}
                        />
                        In two rows
                    </label>
                    <label className="radio-inline">
                        <input
                            type="radio"
                            checked={viewStyle === 'in-one-row'}
                            onChange={() => props.onViewStyleChange('in-one-row')}
                        />
                        In one row
                    </label>
                </div>
            </div>
        </div>
    );
});
