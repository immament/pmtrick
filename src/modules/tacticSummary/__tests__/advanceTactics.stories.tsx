import '../styles.scss';

import log from 'loglevel';
import React from 'react';

import { Meta, Story } from '@storybook/react';

import { AdvanceTactics, AdvanceTacticsProps } from '../components/advanceTactics.component';

import { tacticStats2Data, tacticStatsData } from './data/tacticStats.data';

// // // //

export default {
    title: 'Tactic/Advance Tactics',
    component: AdvanceTactics,
} as Meta;

const Template: Story<AdvanceTacticsProps> = (args) => (
    <div className="pmt-root pmt-tactic-summary">
        <AdvanceTactics {...args} />
    </div>
);

export const WithoutPreviousData = Template.bind({});
WithoutPreviousData.args = {
    stats: tacticStatsData,
};

export const WithPreviousData = Template.bind({});
WithPreviousData.args = {
    stats: tacticStats2Data,
    statsOld: tacticStatsData,
};
