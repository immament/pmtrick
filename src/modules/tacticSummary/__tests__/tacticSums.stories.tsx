import React from 'react';

import { Meta, Story } from '@storybook/react';

import { TacticSums, TacticSumsProps } from '../components/tacticSums.component';

import { tacticSumsPropsMock } from './data/tacticSumsProps.data';

// // // //

export default {
    title: 'Tactic/TacticSums',
    component: TacticSums,
} as Meta;

const Template: Story<TacticSumsProps> = (args) => (
    <div className="pmt-root pmt-tactic-summary">
        <TacticSums {...args} />;
    </div>
);

export const First = Template.bind({});
First.args = { sums: tacticSumsPropsMock.sums };
