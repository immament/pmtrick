import React from 'react';

interface RankingFormGroupProps {
    id: string;
    value: number;
    label: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RankingFormGroup({ id, handleChange, value, label }: RankingFormGroupProps): JSX.Element {
    return (
        <>
            <label htmlFor={id} className="col-sm-1 control-label">
                {label}
            </label>
            <div className="col-sm-2">
                <input
                    type="number"
                    id={id}
                    name={id}
                    value={value}
                    onChange={handleChange}
                    className="form-control"
                    min="0"
                    max="100"
                ></input>
            </div>
        </>
    );
}
