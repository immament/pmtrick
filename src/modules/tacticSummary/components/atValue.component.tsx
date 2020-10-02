import log from 'loglevel';
import React, { CSSProperties, useEffect, useState } from 'react';

import { ColorScale } from '@src/common/model/colorScale.model';

import { usePrevValue } from '../hooks/usePrevValue';

const negativeColorScale = new ColorScale(10, 0, 0, 100, 90, 60);
const positiveColorScale = new ColorScale(20, 10, 255, 100, 80, 25);

const _valuefractionDigits = 2;

const getValueColor = (value?: number): string => {
    if (value == undefined) return '';
    return value >= 10 ? positiveColorScale.getHslColor(value) : negativeColorScale.getHslColor(value);
};

function useAtValueFormat(value?: number) {
    const [formatted, setFormatted] = useState<{ formatedValue?: string | JSX.Element; valueStyle?: CSSProperties }>({
        formatedValue: value?.toFixed(_valuefractionDigits),
        valueStyle: undefined,
    });

    useEffect(() => {
        const valueStyle = { color: getValueColor(value) };
        const formatedValue = value?.toFixed(_valuefractionDigits) ?? <>&nbsp;</>;
        setFormatted({ formatedValue, valueStyle });
    }, [value]);

    return formatted;
}

// COMPONENTS

export type AtValueProps = {
    index: number;
    groupName: string;
    value?: number;
    valueOld?: number;
};

export type AtValue = (props: AtValueProps) => JSX.Element;

export const AtValueInTowRows: AtValue = ({ index, groupName, value, valueOld }: AtValueProps) => {
    const { formatedValue, valueStyle } = useAtValueFormat(value);
    const valueDeltaElement = usePrevValue(value, valueOld);
    return (
        <div key={index} className="col-xs-3 pmt-at-details">
            <div className="pmt-short-div text-center pmt-at-condition">{groupName}</div>
            <div className="pmt-short-div text-center pmt-at-value" style={valueStyle}>
                {formatedValue}
                {valueDeltaElement}
            </div>
        </div>
    );
};

export const AtValueInOneRow: AtValue = ({ index, groupName, value, valueOld }: AtValueProps) => {
    const { formatedValue, valueStyle } = useAtValueFormat(value);
    const valueDeltaElement = usePrevValue(value, valueOld);

    return (
        <React.Fragment key={index}>
            <div className="col-xs-2 pmt-at-condition">{groupName}</div>
            <div className="col-xs-1 text-center pmt-at-value" style={valueStyle}>
                {formatedValue}
                {valueDeltaElement}
            </div>
        </React.Fragment>
    );
};
