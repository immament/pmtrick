import log from 'loglevel';
import React from 'react';

export interface CheckboxItem {
    name: string;
    isChecked: boolean;
    label: string;
}

export type CheckboxOptionsProps = {
    onCheckedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    columns: CheckboxItem[];
};

export function CheckboxOptions({ columns, onCheckedChange }: CheckboxOptionsProps): JSX.Element {
    log.debug('CheckboxOptions.component', 'render', columns);
    return (
        <div className="pmt-checkbox-option">
            {columns.map((col) => (
                <label key={col.name} className="checkbox-inline">
                    <input type="checkbox" name={col.name} checked={col.isChecked} onChange={onCheckedChange} />
                    {col.label}
                </label>
            ))}
        </div>
    );
}
