import React from 'react';

import { AtValue } from './atValue.component';

export type AtValuesProps = {
    values?: (number | undefined)[];
    valuesOld?: (number | undefined)[];
    groups: string[];
    atValue: AtValue;
};

export function AtValues({ values, valuesOld, groups, atValue }: AtValuesProps): JSX.Element {
    return (
        <React.Fragment>
            {[0, 1, 2].map((index) => {
                const value = values && values[index];
                const valueOld = valuesOld && valuesOld[index];
                const groupName = groups[index] ?? <>&nbsp;</>;
                return atValue({ index, groupName, value, valueOld });
            })}
        </React.Fragment>
    );
}
