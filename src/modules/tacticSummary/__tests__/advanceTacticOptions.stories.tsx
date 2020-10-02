import '../styles.scss';

import React from 'react';

import { Meta, Story } from '@storybook/react';

import { AdvanceTacticOptions, AdvanceTacticOptionsProps } from '../components/advanceTacticOptions.component';

// // // //

export default {
    title: 'Tactic/AdvanceTacticOptions',
    component: AdvanceTacticOptions,
} as Meta;

const Template: Story<AdvanceTacticOptionsProps> = (args) => (
    <div className="pmt-root pmt-tactic-summary">
        <div className="pmt-ats">
            <AdvanceTacticOptions {...args} />
        </div>
    </div>
);

export const InOneRow = Template.bind({});
InOneRow.args = {
    viewStyle: 'in-one-row',
    visibleAts: false,
    visibleVsAts: true,
};

export const InTwoRows = Template.bind({});
InTwoRows.args = {
    viewStyle: 'in-two-rows',
    visibleAts: false,
    visibleVsAts: true,
};
