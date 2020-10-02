import log from 'loglevel';
import React from 'react';
import { container } from 'tsyringe';

import {
    MatchesInSeasons,
    SkillsTableOptionsRepository,
} from '@src/common/services/storage/skillsTableOptions.repository';
import { pick } from '@src/common/services/utils/utils';
import { PlayersSkillsViewService } from '@src/contentScript/modules/playersSkillsView.service';

import { Modal } from '../../../../common/components/modal';

import { FormGroup } from './formGroup.component';
import { numberOptions } from './selectOptions.component';

export type SkillsTableOptionsProps = {
    show: boolean;
    onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

type SkillsTableOptionsState = {
    futureAge?: number;
    currentSeasonLeagueMatches?: number;
    currentSeasonFriendlyMatches?: number;
    fullSeasonLeagueMatches?: number;
    fullSeasonFriendlyMatches?: number;
    isLoaded?: boolean;
};

const _savedOptions = [
    'futureAge',
    'currentSeasonLeagueMatches',
    'currentSeasonFriendlyMatches',
    'fullSeasonLeagueMatches',
    'fullSeasonFriendlyMatches',
] as (keyof MatchesInSeasons)[];

export default class SkillsTableOptions extends React.Component<SkillsTableOptionsProps, SkillsTableOptionsState> {
    private selectAgePossibleNumbers = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    private selectAgeOptions = numberOptions(this.selectAgePossibleNumbers);

    private readonly storageService: SkillsTableOptionsRepository;

    constructor(props: SkillsTableOptionsProps) {
        super(props);

        log.info('SkillsTableOptions.ctor+');
        this.storageService = container.resolve(SkillsTableOptionsRepository);

        this.state = {};
        this.storageService.getOptions().then((value) => {
            const stateDelta = pick(value, ..._savedOptions);

            this.setState({ isLoaded: true, ...stateDelta });
        });

        this.handleChangeAge = this.handleChangeAge.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
    }

    private async save(): Promise<void> {
        const savedOptions = pick(this.state, ..._savedOptions) as MatchesInSeasons;
        await this.storageService.save(savedOptions);
        const playersSkillsViewService = container.resolve(PlayersSkillsViewService);
        playersSkillsViewService.run();
    }

    private handleChangeAge(e: React.ChangeEvent<HTMLSelectElement>): void {
        const stateDelta = { futureAge: Number(e.target.value) };
        this.setState(stateDelta, () => {
            this.save();
        });
    }

    private handleChangeNumber(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        const stateDelta = {
            [name]: Number(value),
        } as SkillsTableOptionsState;
        this.setState(stateDelta, () => {
            this.save();
        });
    }

    private onClose = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClose && this.props.onClose(e);
        log.debug('SkillsTableOptions.onClose');
    };

    render(): React.ReactNode {
        log.debug('render SkillsTableOptions');
        return (
            <Modal show={this.props.show} title="Options" onClose={this.onClose}>
                {this.state.isLoaded && (
                    <form className="form-horizontal">
                        <h4>Predict skills</h4>

                        <FormGroup label="Age" name="toAge">
                            <select
                                id="toAge"
                                name="toAge"
                                value={this.state.futureAge}
                                className="form-control"
                                onChange={this.handleChangeAge}
                            >
                                {this.selectAgeOptions}
                            </select>
                        </FormGroup>

                        <h4>Matches current season</h4>

                        <FormGroup label="League" name="currentSeasonLeagueMatches">
                            <input
                                type="number"
                                id="currentSeasonLeagueMatches"
                                name="currentSeasonLeagueMatches"
                                value={this.state.currentSeasonLeagueMatches}
                                onChange={this.handleChangeNumber}
                                className="form-control"
                                min="0"
                                max="18"
                            ></input>
                        </FormGroup>
                        <FormGroup label="Friendly / cup" name="currentSeasonFriendlyMatches">
                            <input
                                type="number"
                                id="currentSeasonFriendlyMatches"
                                name="currentSeasonFriendlyMatches"
                                value={this.state.currentSeasonFriendlyMatches}
                                onChange={this.handleChangeNumber}
                                className="form-control"
                                min="0"
                                max="12"
                            ></input>
                        </FormGroup>
                        <h4>Full season matches</h4>
                        <FormGroup label="League" name="fullSeasonLeagueMatches">
                            <input
                                type="number"
                                id="fullSeasonLeagueMatches"
                                name="fullSeasonLeagueMatches"
                                value={this.state.fullSeasonLeagueMatches}
                                onChange={this.handleChangeNumber}
                                className="form-control"
                                min="0"
                                max="18"
                            />
                        </FormGroup>
                        <FormGroup label="Friendly / cup" name="fullSeasonFriendlyMatches">
                            <input
                                type="number"
                                id="fullSeasonFriendlyMatches"
                                name="fullSeasonFriendlyMatches"
                                value={this.state.fullSeasonFriendlyMatches}
                                onChange={this.handleChangeNumber}
                                className="form-control"
                                min="0"
                                max="12"
                            ></input>
                        </FormGroup>
                    </form>
                )}
            </Modal>
        );
    }
}
