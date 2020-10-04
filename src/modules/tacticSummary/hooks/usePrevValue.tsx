import React, { useEffect, useState } from 'react';

function valueDeltaToText(delta?: number, fractionDigits = 1): JSX.Element | undefined {
    return delta && Math.abs(delta) > 0.1 ? (
        <span className={delta > 0 ? 'pmt-positive-delta' : 'pmt-negative-delta'}>{` ${delta.toFixed(
            fractionDigits,
        )}`}</span>
    ) : (
        <span></span>
    );
}

export function usePrevValue(value?: number, valueOld?: number, fractionDigits = 1): JSX.Element | undefined {
    const [valueDeltaElement, setValueDeltaElement] = useState<JSX.Element | undefined>(undefined);
    useEffect(() => {
        const valueDelta = value != undefined && valueOld != undefined ? value - valueOld : undefined;
        const newValueDeltaElement = valueDeltaToText(valueDelta, fractionDigits);
        setValueDeltaElement(newValueDeltaElement);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, valueOld]);
    return valueDeltaElement;
}
