import React, { ReactNode } from 'react';
import { container } from 'tsyringe';

import { PlayersSkillsViewService } from '@src/modules/playersSkills/services/playersSkillsView.service';

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

    private handleSave = (): void => {
        const playersSkillsViewService = container.resolve(PlayersSkillsViewService);
        playersSkillsViewService.run();
    };

    render(): ReactNode {
        return (
            <React.Fragment>
                <button className="btn btn-default btn-success btn-xs" onClick={this.showModal}>
                    Options
                </button>
                <SkillsTableOptions show={this.state.show} onClose={this.handleClose} onSave={this.handleSave} />
            </React.Fragment>
        );
    }
}
