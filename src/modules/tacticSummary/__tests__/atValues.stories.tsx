import '../styles.scss';

import React from 'react';

import { Meta, Story } from '@storybook/react';

import { AtValueInOneRow } from '../components/atValue.component';
import { AtValues, AtValuesProps } from '../components/atValues.components';

// // // //

export default {
    title: 'Tactic/AtValues',
    component: AtValues,
} as Meta;

const Template: Story<AtValuesProps> = (args) => (
    <div className="pmt-root pmt-tactic-summary">
        <div className="pmt-ats">
            <div className="pmt-ats-row">
                <AtValues {...args} />
            </div>
        </div>
    </div>
);

export const NegativeDelta = Template.bind({});
NegativeDelta.args = {
    values: [11.03, 20.3, 9.12],
    groups: ['Tackling (D + M)', 'Speed (D + M)', 'AT value'],
    atValue: AtValueInOneRow,
};
