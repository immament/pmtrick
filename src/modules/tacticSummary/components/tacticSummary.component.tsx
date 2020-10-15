import '../styles.scss';

import log from 'loglevel';
import React, { ReactNode } from 'react';
import { Subscription } from 'rxjs';
import { container } from 'tsyringe';

import { TacticEditorData } from '@src/modules/tacticSummary/model/tacticEditorPlayer.model';
import { TacticDataService } from '@src/modules/tacticSummary/services/tacticData.service';

import { AdvanceTacticTypes, TacticStats, TacticStatsSums } from '../model/tacticStats.model';
import { TacticSkillsSumsCalculator } from '../services/tacticSkillsSumsCalculator';

import { AdvanceTactics } from './advanceTactics.component';
import { TacticSums } from './tacticSums.component';

type TabsNames = 'ATs' | 'Sums';
interface TacticSummaryState {
    stats?: TacticStats;
    statsOld?: TacticStats;
    sums?: TacticStatsSums;
    sumsOld?: TacticStatsSums;
    currentTab: TabsNames;
    tabsStyle: Record<TabsNames, string>;
    activeAts: AdvanceTacticTypes[];
}

export class TacticSummary extends React.Component<Readonly<Record<string, unknown>>, TacticSummaryState> {
    private static readonly defaultTab: TabsNames = 'ATs';
    private positionsSubscription?: Subscription;
    private atsSubscription?: Subscription;

    constructor(props: Readonly<Record<string, unknown>>) {
        super(props);

        const tabsStyle = this.createTabsStyle(TacticSummary.defaultTab);
        this.state = { currentTab: TacticSummary.defaultTab, tabsStyle, activeAts: [] };
        this.handleTabClick = this.handleTabClick.bind(this);
    }

    private positionsSubscriber(data: TacticEditorData) {
        const sumCalculator = container.resolve(TacticSkillsSumsCalculator);
        log.trace('TacticSummary positionsSubscriber:', data);

        const sums = sumCalculator.calculate(data);
        const stats = sums && new TacticStats(sums);
        log.trace('TacticSummary.positionsSubscriber stats:', stats, sums);
        this.setState({ sums, stats, statsOld: this.state.stats, sumsOld: this.state.sums });
    }

    private atsSubscriber(ats: AdvanceTacticTypes[]) {
        log.trace('TacticSummary atsSubscriber:', ats);
        this.setState({ activeAts: ats });
    }

    componentDidMount(): void {
        const tacticDataService = container.resolve(TacticDataService);
        this.positionsSubscription = tacticDataService.positions.observable.subscribe(
            this.positionsSubscriber.bind(this),
        );
        this.atsSubscription = tacticDataService.ats.observable.subscribe(this.atsSubscriber.bind(this));
    }

    componentWillUnmount(): void {
        this.positionsSubscription?.unsubscribe();
        this.atsSubscription?.unsubscribe();
    }

    private handleTabClick(e: React.MouseEvent<HTMLAnchorElement>): void {
        const currentTab = e.currentTarget.id as TabsNames;
        const tabsStyle = this.createTabsStyle(currentTab);
        this.setState({ currentTab, tabsStyle });
    }

    private createTabsStyle(currentTab: TabsNames): Record<TabsNames, string> {
        return {
            ATs: currentTab === 'ATs' ? 'active' : '',
            Sums: currentTab === 'Sums' ? 'active' : '',
        };
    }

    render(): ReactNode {
        log.trace('TacticSummary.render');

        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li role="presentation" className={this.state.tabsStyle.ATs}>
                        <a href="#ats" aria-controls="profile" role="tab" id="ATs" onClick={this.handleTabClick}>
                            Ats
                        </a>
                    </li>
                    <li role="presentation" className={this.state.tabsStyle.Sums}>
                        <a href="#sums" aria-controls="home" role="tab" id="Sums" onClick={this.handleTabClick}>
                            Sums
                        </a>
                    </li>
                </ul>

                <div className="tab-content">
                    <div role="tabpanel" className={`tab-pane ${this.state.tabsStyle.ATs}`} id="ATs">
                        <AdvanceTactics
                            stats={this.state.stats}
                            statsOld={this.state.statsOld}
                            activeAts={this.state.activeAts}
                        ></AdvanceTactics>
                    </div>
                    <div role="tabpanel" className={`tab-pane ${this.state.tabsStyle.Sums}`} id="Sums">
                        <TacticSums sums={this.state.sums} sumsOld={this.state.sumsOld}></TacticSums>
                    </div>
                </div>
            </div>
        );
    }
}
