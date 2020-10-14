import React from 'react';

export const numberOptions = (numbers: number[]): JSX.Element[] =>
    numbers.map((number) => (
        <option key={number} value={number}>
            {number}
        </option>
    ));
