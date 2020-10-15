import React from 'react';

interface RankingFormGroupProps {
    id: string;
    value: number;
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function RankingFormGroup({ id, onChange, value, label }: RankingFormGroupProps): JSX.Element {
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
                    onChange={onChange}
                    className="form-control"
                    min="1"
                    max="100"
                ></input>
            </div>
        </>
    );
}
