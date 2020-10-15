import React, { ReactNode } from 'react';

import SkillsTableOptions from '../skillsTableOptionsModal/skillsTableOptions.component';

export class SkillsTablesOptionsButton extends React.Component<unknown, { show: boolean }> {
    state = {
        show: false,
    };

    private showModal = (_e: React.MouseEvent<HTMLButtonElement>): void => {
        this.setState({
            show: true,
        });
    };

    private handleClose = (_e: React.MouseEvent<HTMLButtonElement>): void => {
        this.setState({
            show: false,
        });
    };

    render(): ReactNode {
        return (
            <React.Fragment>
                <button className="btn btn-default btn-success btn-xs" onClick={this.showModal}>
                    Options
                </button>
                <SkillsTableOptions show={this.state.show} onClose={this.handleClose} />
            </React.Fragment>
        );
    }
}
