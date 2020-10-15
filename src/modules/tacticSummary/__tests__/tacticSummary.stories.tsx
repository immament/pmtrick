import 'reflect-metadata';

import React from 'react';
import { container } from 'tsyringe';

import { GsFormula, tempGsFormula } from '@src/common/model/gsFormula.model';
import { TacticDataService } from '@src/modules/tacticSummary/services/tacticData.service';
import { Meta, Story } from '@storybook/react';

import { TacticSummary } from '../components/tacticSummary.component';

import { tacticSummaryDataMock, tacticSummaryDataOnlyGkMock } from './data/tacticSummary.data';

// // // //

container.registerInstance<GsFormula>('GsFormula', tempGsFormula);

export default {
    title: 'Tactic/TacticSummary',
    component: TacticSummary,
} as Meta;

const tacticDataService = container.resolve(TacticDataService);
tacticDataService.positions.newData(tacticSummaryDataMock);

function sendData() {
    tacticDataService.positions.newData(tacticSummaryDataMock);
}

function sendDataOnlyGk() {
    tacticDataService.positions.newData(tacticSummaryDataOnlyGkMock);
}

const Template: Story = (args) => (
    <div>
        <button onClick={sendData}>Full squad</button> <button onClick={sendDataOnlyGk}>Only GK in squad</button>
        <div className="pmt-root pmt-tactic-summary">
            <TacticSummary {...args} />
        </div>
    </div>
);

export const Primary = Template.bind({});

Primary.args = {};

export const Second = Template.bind({});
Second.args = {};
