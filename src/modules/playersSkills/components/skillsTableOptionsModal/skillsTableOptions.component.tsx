import './styles.scss';

import log from 'loglevel';
import React from 'react';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { container } from 'tsyringe';

import {
    _futurePredicationSettingsKey,
    FuturePredicationSettings,
} from '@src/common/services/settings/futurePredication.settings';
import { _rankingsSettingsKey, RankingRange, RankingsSettings } from '@src/common/services/settings/settings';
import { SettingsRepository } from '@src/common/services/settings/settings.repository';
import { pick } from '@src/common/services/utils/utils';

import { Modal } from '../../../../common/components/modal';

import { FormGroup } from './formGroup.component';
import { RankingOptions } from './rankingOptions.control';
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
    rankingsSettings?: RankingsSettings;

    isLoaded?: boolean;
};

const _futurePredicationSettings = [
    'futureAge',
    'currentSeasonLeagueMatches',
    'currentSeasonFriendlyMatches',
    'fullSeasonLeagueMatches',
    'fullSeasonFriendlyMatches',
] as (keyof FuturePredicationSettings)[];

type RankingsSettingsKeys = 'current' | 'future';

export default class SkillsTableOptions extends React.Component<SkillsTableOptionsProps, SkillsTableOptionsState> {
    private selectAgePossibleNumbers = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
    private selectAgeOptions = numberOptions(this.selectAgePossibleNumbers);

    private readonly settingsRepository: SettingsRepository;
    private saveFuturePredicationSettings$ = new Subject<Partial<SkillsTableOptionsState>>();
    private saveFuturePredicationSettingsSubs?: Subscription;
    private saveRankingSettings$ = new Subject<Partial<SkillsTableOptionsState>>();
    private saveRankingSettingsSubs?: Subscription;

    constructor(props: SkillsTableOptionsProps) {
        super(props);

        log.trace('SkillsTableOptions.ctor +');
        this.settingsRepository = container.resolve(SettingsRepository);

        this.state = {};
        this.loadSettings();

        this.handleChangeAge = this.handleChangeAge.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeRanking = this.handleChangeRanking.bind(this);
    }

    componentDidMount(): void {
        this.saveFuturePredicationSettingsSubs = this.saveFuturePredicationSettings$
            .pipe(debounceTime(500))
            .subscribe((state) => this.saveFuturePredicationSettings(state));
        this.saveRankingSettingsSubs = this.saveRankingSettings$
            .pipe(debounceTime(500))
            .subscribe((state) => this.saveRankingSettings(state));
    }

    componentWillUnmount(): void {
        this.saveFuturePredicationSettingsSubs?.unsubscribe();
        this.saveRankingSettingsSubs?.unsubscribe();
    }

    private async loadSettings() {
        await Promise.all([
            this.settingsRepository
                .getSettings<FuturePredicationSettings>(_futurePredicationSettingsKey)
                .then((value) => {
                    const stateDelta = pick(value, ..._futurePredicationSettings);
                    log.trace('skillsTableOptions.component', 'get FuturePredicationSettings:', stateDelta);
                    this.setState(stateDelta);
                }),

            this.settingsRepository.getSettings<RankingsSettings>(_rankingsSettingsKey).then((value) => {
                log.debug('skillsTableOptions.component', 'get RankingsSettings:', value);
                this.setState({ rankingsSettings: value });
            }),
        ]);
        this.setState({ isLoaded: true });
    }

    private async saveFuturePredicationSettings(state: SkillsTableOptionsState): Promise<void> {
        log.debug('skillsTableOptions.component', 'saveFuturePredicationSettings');
        const savedOptions = pick(state, ..._futurePredicationSettings) as FuturePredicationSettings;
        await this.settingsRepository.save(_futurePredicationSettingsKey, savedOptions);
    }

    private async saveRankingSettings(state: SkillsTableOptionsState): Promise<void> {
        if (!state.rankingsSettings) return;
        await this.settingsRepository.save(_rankingsSettingsKey, state.rankingsSettings);
    }

    // #region EVENTS

    private handleChangeAge(e: React.ChangeEvent<HTMLSelectElement>): void {
        const stateDelta = { futureAge: Number(e.target.value) };
        this.setState(stateDelta, () => {
            this.saveFuturePredicationSettings$.next(this.state);
        });
    }

    private handleChangeNumber(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        const stateDelta = {
            [name]: Number(value),
        } as SkillsTableOptionsState;
        this.setState(stateDelta, () => {
            this.saveFuturePredicationSettings$.next(this.state);
        });
    }

    private handleChangeRanking: (event: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
        const { name, value } = e.target;

        const [, type, field] = name.split('_');

        this.setState(
            (state) => {
                const rankingType = state.rankingsSettings && state.rankingsSettings[type as RankingsSettingsKeys];
                if (rankingType) {
                    rankingType[field as keyof RankingRange] = Number(value);
                }
                return state;
            },
            () => {
                this.saveRankingSettings$.next(this.state);
            },
        );
    };

    private onClose = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClose && this.props.onClose(e);
        log.trace('SkillsTableOptions.onClose');
    };

    // #endregion

    render(): React.ReactNode {
        log.trace('render SkillsTableOptions');
        return (
            <Modal show={this.props.show} title="Options" className="pmt-skills-table-options" onClose={this.onClose}>
                {this.state.isLoaded && (
                    <form className="form-horizontal">
                        <div className="panel panel-default">
                            <div className="panel-heading">Predict skills</div>

                            <div className="panel-body">
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
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">Matches current season</div>

                            <div className="panel-body">
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
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">Full season matches</div>
                            <div className="panel-body">
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
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading">Rankins</div>

                            <div className="panel-body">
                                {this.state.rankingsSettings?.current && (
                                    <RankingOptions
                                        handleChangeRanking={this.handleChangeRanking}
                                        range={this.state.rankingsSettings?.current}
                                        rankingType="current"
                                    ></RankingOptions>
                                )}
                                {this.state.rankingsSettings?.future && (
                                    <RankingOptions
                                        handleChangeRanking={this.handleChangeRanking}
                                        range={this.state.rankingsSettings?.future}
                                        rankingType="future"
                                    ></RankingOptions>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </Modal>
        );
    }
}
