import React from 'react';
import { container } from 'tsyringe';

import { PlayersSkillsFactoryMock } from '@src/__mocks__/playersSkillsFactory.mock';
import { PlayersSkillsFactory } from '@src/modules/playersSkills/services/playersSkills.factory';
import { Meta, Story } from '@storybook/react';

import { SkillsTablesOptionsButton } from '../skillsTablesOptionsButton.component';

// // // //

container.register(PlayersSkillsFactory, PlayersSkillsFactoryMock);

export default {
    title: 'SkillsTable/SkillsTablesOptionsButton',
    component: SkillsTablesOptionsButton,
} as Meta;

const Template: Story = (args) => <SkillsTablesOptionsButton {...args} />;

export const Primary = Template.bind({});
