import './styles.scss';

import log from 'loglevel';
import React from 'react';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { container } from 'tsyringe';

import { CheckboxItem } from '@src/common/components/checkBoxOptions/checkboxItem.model';
import { CheckBoxItems } from '@src/common/components/checkBoxOptions/checkBoxItems.service';
import { CheckboxOptions } from '@src/common/components/checkBoxOptions/checkboxOptions.component';
import { Modal } from '@src/common/components/modal';
import {
    _futurePredicationSettingsKey,
    FuturePredicationSettings,
} from '@src/common/services/settings/futurePredication.settings';
import {
    _rankingsSettingsKey,
    BaseSettings,
    RankingRange,
    RankingsSettings,
    TransferListSettings,
} from '@src/common/services/settings/settings';
import { SettingsRepository } from '@src/common/services/settings/settings.repository';
import { CancelablePromise, makeCancelable, pick } from '@src/common/services/utils/utils';

import { FormGroup } from '../../../../common/components/form/formGroup.component';
import { numberOptions } from '../../../../common/components/form/numberOptions.component';
import { PlayersSkillsFactory } from '../../services/playersSkills.factory';
import { PlayersSkillsViewServiceSettings } from '../../services/playersSkillsViewServiceSettings';
import { PageSettingsService, PlayersSkillsViewSettings } from '../../services/playersSkillsViewSettings';

import { OnChangeRankingEvent, RankingOptions } from './rankingOptions.component';

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

    columnsVisibility?: CheckboxItem[];
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

const _settingsChangeDebounceTime = 500;

export default class SkillsTableOptions extends React.Component<SkillsTableOptionsProps, SkillsTableOptionsState> {
    private static selectAgePossibleNumbers = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];

    private selectAgeOptions = numberOptions(SkillsTableOptions.selectAgePossibleNumbers);

    private readonly settingsRepository: SettingsRepository;

    private readonly saveFuturePredicationSettings$ = new Subject<Partial<SkillsTableOptionsState>>();
    private saveFuturePredicationSettingsSubs?: Subscription;
    private readonly saveRankingSettings$ = new Subject<Partial<SkillsTableOptionsState>>();
    private saveRankingSettingsSubs?: Subscription;

    private pageSettingsService: PageSettingsService;

    private loadSettingsPromise?: CancelablePromise<PlayersSkillsViewServiceSettings>;

    private checkBoxItems: CheckBoxItems;

    constructor(props: SkillsTableOptionsProps) {
        super(props);

        log.trace('SkillsTableOptions.ctor +', props);
        this.settingsRepository = container.resolve(SettingsRepository);
        const playersSkillsFactory = container.resolve(PlayersSkillsFactory);
        this.pageSettingsService = playersSkillsFactory.getPlayersSettingsService();

        this.checkBoxItems = container.resolve(CheckBoxItems);

        this.state = {};

        this.handleChangeAge = this.handleChangeAge.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleChangeRanking = this.handleChangeRanking.bind(this);
        this.handleColumnsVisibilityChange = this.handleColumnsVisibilityChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    componentDidMount(): void {
        this.loadSettings();

        this.saveFuturePredicationSettingsSubs = this.saveFuturePredicationSettings$
            .pipe(debounceTime(_settingsChangeDebounceTime))
            .subscribe((state) => this.saveFuturePredicationSettings(state));
        this.saveRankingSettingsSubs = this.saveRankingSettings$
            .pipe(debounceTime(500))
            .subscribe((state) => this.saveRankingSettings(state));
    }

    componentWillUnmount(): void {
        this.saveFuturePredicationSettingsSubs?.unsubscribe();
        this.saveRankingSettingsSubs?.unsubscribe();
        this.loadSettingsPromise?.cancel();
    }

    // #region  SETTINGS

    private async loadSettings() {
        this.loadSettingsPromise = makeCancelable(
            this.settingsRepository.getMultipleSettings<
                PlayersSkillsViewServiceSettings & Record<string, BaseSettings>
            >([_rankingsSettingsKey, _futurePredicationSettingsKey, this.pageSettingsService.key]),
        );

        this.loadSettingsPromise.promise
            .then((settings) => this.setSettings(settings))
            .catch((reason) => {
                if (!reason.isCanceled) {
                    log.warn('skillsTableOptions.component', 'error', reason);
                }
            });
    }

    private setSettings(settings: PlayersSkillsViewServiceSettings): void {
        let stateDelta: Partial<SkillsTableOptionsState> = {};

        if (settings.futurePredicationSettings) {
            stateDelta = {
                ...stateDelta,
                ...pick(settings.futurePredicationSettings, ..._futurePredicationSettings),
            };
        }
        if (settings.rankingsSettings) {
            stateDelta.rankingsSettings = settings.rankingsSettings;
        }

        const pageSettings = (settings as Record<string, BaseSettings>)[
            this.pageSettingsService.key
        ] as PlayersSkillsViewSettings;
        if (pageSettings) {
            const hiddenColumns = pageSettings.hiddenColumns;
            stateDelta.columnsVisibility = this.pageSettingsService.columnsConfig.map((cc) => ({
                ...cc,
                isChecked: !hiddenColumns.includes(cc.name),
            }));
        }
        this.setState({ ...stateDelta, isLoaded: true });
    }

    private async saveFuturePredicationSettings(state: SkillsTableOptionsState): Promise<void> {
        log.debug('skillsTableOptions.component', 'saveFuturePredicationSettings');
        const savedOptions = pick(state, ..._futurePredicationSettings) as FuturePredicationSettings;
        await this.settingsRepository.save(_futurePredicationSettingsKey, savedOptions);
    }

    private async saveRankingSettings(state: SkillsTableOptionsState): Promise<void> {
        if (!state.rankingsSettings) return;
        log.debug('skillsTableOptions.component', 'saveRankingSettings', state.rankingsSettings);
        await this.settingsRepository.save(_rankingsSettingsKey, state.rankingsSettings);
    }

    private async saveColumnsSettings(state: SkillsTableOptionsState): Promise<void> {
        if (!state.rankingsSettings) return;

        const hiddenColumns = state.columnsVisibility?.filter((col) => !col.isChecked).map((col) => col.name) || [];
        await this.settingsRepository.save<TransferListSettings>(this.pageSettingsService.key, {
            hiddenColumns,
        });
    }

    // #endregion

    // #region EVENTS

    private handleChangeAge(e: React.ChangeEvent<HTMLSelectElement>): void {
        const stateDelta = { futureAge: Number(e.target.value) };
        this.setState(stateDelta, () => {
            this.saveFuturePredicationSettings$.next(this.state);
        });
    }

    private handleChangeNumber(e: React.ChangeEvent<HTMLInputElement>): void {
        const { name, value } = e.target;
        const stateDelta: Partial<SkillsTableOptionsState> = {
            [name]: Number(value),
        };
        this.setState(stateDelta as SkillsTableOptionsState, () => {
            this.saveFuturePredicationSettings$.next(this.state);
        });
    }

    private handleChangeRanking({ id, field, value }: OnChangeRankingEvent): void {
        const rankingsSettings = this.updateRankingSettings(id as RankingsSettingsKeys, field, value);

        this.setState({ rankingsSettings }, () => {
            this.saveRankingSettings$.next(this.state);
        });
    }

    private handleColumnsVisibilityChange(event: React.ChangeEvent<HTMLInputElement>): void {
        if (!this.state.columnsVisibility) return;
        const columns = this.checkBoxItems.checked(this.state.columnsVisibility, event.target);

        this.setState({ columnsVisibility: columns }, () => {
            this.saveColumnsSettings(this.state);
        });
    }

    private handleModalClose(e: React.MouseEvent<HTMLButtonElement>): void {
        this.props.onClose && this.props.onClose(e);
    }

    private updateRankingSettings(type: RankingsSettingsKeys, field: keyof RankingRange, value: number) {
        const rankingRange = (this.state.rankingsSettings && this.state.rankingsSettings[type]) || ({} as RankingRange);

        rankingRange[field] = value;
        const rankingsSettings = { ...this.state.rankingsSettings, [type]: rankingRange };
        return rankingsSettings;
    }

    // #endregion

    render(): React.ReactNode {
        log.trace('render SkillsTableOptions');
        return (
            <Modal
                show={this.props.show}
                title="Options"
                className="pmt-skills-table-options"
                onClose={this.handleModalClose}
            >
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
                            <div className="panel-heading">Rankings</div>

                            <div className="panel-body">
                                {this.state.rankingsSettings?.current && (
                                    <RankingOptions
                                        onChangeRanking={this.handleChangeRanking}
                                        range={this.state.rankingsSettings?.current}
                                        label="Current ranking"
                                        id="current"
                                    ></RankingOptions>
                                )}
                                {this.state.rankingsSettings?.future && (
                                    <RankingOptions
                                        onChangeRanking={this.handleChangeRanking}
                                        range={this.state.rankingsSettings?.future}
                                        label="Future ranking"
                                        id="future"
                                    ></RankingOptions>
                                )}
                            </div>
                        </div>
                        {this.state.columnsVisibility && (
                            <div className="panel panel-default pmt-checkbox-options">
                                <div className="panel-heading">Visible columns</div>
                                <div className="panel-body">
                                    <CheckboxOptions
                                        columns={this.state.columnsVisibility}
                                        onCheckedChange={this.handleColumnsVisibilityChange}
                                    ></CheckboxOptions>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </Modal>
        );
    }
}
