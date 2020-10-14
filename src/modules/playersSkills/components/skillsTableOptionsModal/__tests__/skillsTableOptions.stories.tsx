import 'reflect-metadata';
import '@src/contentScript/services/contentScript.bootstrap';

import React from 'react';

import { Meta, Story } from '@storybook/react';

import SkillsTableOptions, { SkillsTableOptionsProps } from '../skillsTableOptions.component';

// // // //

export default {
    title: 'SkillsTable/SkillsTableOptions',
    component: SkillsTableOptions,
} as Meta;

const Template: Story<SkillsTableOptionsProps> = (args) => <SkillsTableOptions {...args} />;

export const Primary = Template.bind({});
Primary.args = {
    show: true,
} as SkillsTableOptionsProps;
