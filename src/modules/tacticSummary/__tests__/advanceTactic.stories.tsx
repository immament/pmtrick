import '../styles.scss';

import log from 'loglevel';
import React from 'react';

import { Meta, Story } from '@storybook/react';

import { atConfig } from '../advanceTacticsConfig';
import { AdvanceTactic, AdvanceTacticProps } from '../components/advanceTactic.component';

// // // //

export default {
    title: 'Tactic/Advance Tactic',
    component: AdvanceTactic,
} as Meta;

const Template: Story<AdvanceTacticProps> = (args) => (
    <div className="pmt-root pmt-tactic-summary">
        <div className="pmt-ats container-fluid">
            <AdvanceTactic {...args} />
        </div>
    </div>
);

let advanceTactic = atConfig[0];

export const InOneRow = Template.bind({});
InOneRow.args = {
    name: advanceTactic.name,
    groups: advanceTactic.groups,
    values: [15.21, 8.0],
    rowStyle: 'in-one-row',
};

advanceTactic = atConfig[1];

export const InTwoRows = Template.bind({});
InTwoRows.args = {
    name: advanceTactic.name,
    groups: advanceTactic.groups,
    values: [5.11, 8.0],
    rowStyle: 'in-two-rows',
};

advanceTactic = atConfig[2];
log.debug('advanceTactic.stories', 'advanceTactic:', advanceTactic);

export const OpponentInOneRow = Template.bind({});
OpponentInOneRow.args = {
    name: advanceTactic.name,
    groups: advanceTactic.groups,
    values: [9.1, 9.99],
    rowStyle: 'in-one-row',
    className: 'opponent',
};

advanceTactic = atConfig[5];
log.debug('advanceTactic.stories', 'advanceTactic:', advanceTactic);

export const OpponentInTwoRows = Template.bind({});
OpponentInTwoRows.args = {
    name: advanceTactic.name,
    groups: advanceTactic.groups,
    values: [15.1, 8.2, 12.4],
    rowStyle: 'in-two-rows',
    className: 'opponent',
};
