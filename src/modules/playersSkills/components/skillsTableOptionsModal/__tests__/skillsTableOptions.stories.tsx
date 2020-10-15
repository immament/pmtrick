import 'reflect-metadata';
import '@src/contentScript/services/contentScript.bootstrap';

import React from 'react';
import { container } from 'tsyringe';

import { PlayersSkillsFactoryMock } from '@src/__mocks__/playersSkillsFactory.mock';
import { PlayersSkillsFactory } from '@src/modules/playersSkills/services/playersSkills.factory';
import { Meta, Story } from '@storybook/react';

import SkillsTableOptions, { SkillsTableOptionsProps } from '../skillsTableOptions.component';

// // // //

container.register(PlayersSkillsFactory, PlayersSkillsFactoryMock);

export default {
    title: 'SkillsTable/SkillsTableOptions',
    component: SkillsTableOptions,
} as Meta;

const Template: Story<SkillsTableOptionsProps> = (args) => <SkillsTableOptions {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    show: true,
} as SkillsTableOptionsProps;
