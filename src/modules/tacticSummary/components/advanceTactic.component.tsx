import log from 'loglevel';
import React from 'react';

import { AtValueInOneRow, AtValueInTowRows } from './atValue.component';
import { AtValues } from './atValues.components';

export type AdvanceTacticViewStyle = 'in-one-row' | 'in-two-rows';
export interface AdvanceTacticProps {
    name: string;
    groups: string[];
    values?: (number | undefined)[];
    valuesOld?: (number | undefined)[];
    className?: string;
    rowStyle?: AdvanceTacticViewStyle;
    isActive: boolean;
}

export function AdvanceTactic(props: AdvanceTacticProps): JSX.Element {
    const atValue = props.rowStyle === 'in-one-row' ? AtValueInOneRow : AtValueInTowRows;

    return (
        <div className={`row pmt-ats-row ${props.className ?? ''} ${props.rowStyle ?? 'in-one-row'}`}>
            <div className="col-sm-3 pmt-at-name">
                <span>{props.name}</span>
                {props.isActive && (
                    <span className="glyphicon glyphicon-ok float-right" aria-hidden="true" title="At is active"></span>
                )}
            </div>

            <AtValues
                values={props.values}
                valuesOld={props.valuesOld}
                groups={props.groups}
                atValue={atValue}
            ></AtValues>
        </div>
    );
}
