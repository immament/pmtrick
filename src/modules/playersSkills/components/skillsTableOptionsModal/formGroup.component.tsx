import React from 'react';

export type FormGroupProps = {
    name: string;
    label: string;
};

export class FormGroup extends React.Component<FormGroupProps> {
    render(): React.ReactNode {
        return (
            <div className="form-group">
                <label htmlFor={this.props.name} className="col-sm-4 control-label">
                    {this.props.label}
                </label>
                <div className="col-sm-8">{this.props.children}</div>
            </div>
        );
    }
}
