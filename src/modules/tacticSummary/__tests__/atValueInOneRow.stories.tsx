import '../styles.scss';

import React from 'react';

import { Meta, Story } from '@storybook/react';

import { AtValueInOneRow, AtValueProps } from '../components/atValue.component';

// // // //

export default {
    title: 'Tactic/AtValueInOneRow',
    component: AtValueInOneRow,
} as Meta;

const Template: Story<AtValueProps> = (args) => (
    <div className="pmt-root pmt-tactic-summary">
        <div className="pmt-ats">
            <div className="pmt-ats-row">
                <AtValueInOneRow {...args} />
            </div>
        </div>
    </div>
);

export const NegativeDelta = Template.bind({});
NegativeDelta.args = {
    index: 0,
    groupName: 'Passing (All)',
    value: 15.11,
    valueOld: 17.22,
};

export const PositiveDelta = Template.bind({});
PositiveDelta.args = {
    index: 0,
    groupName: 'Speed (All)',
    value: 8.01,
    valueOld: 5.11,
};
