import 'reflect-metadata';
import '../../../../../contentScript/services/contentScript.bootstrap';

import React from 'react';

import { Meta, Story } from '@storybook/react';

import SkillsTableOptions, { SkillsTableOptionsProps } from '../skillsTableOptions.component';

// // // //

export default {
    title: 'Content/SkillsTableOptions',
    component: SkillsTableOptions,
} as Meta;

const Template: Story<SkillsTableOptionsProps> = (args) => <SkillsTableOptions {...args} />;

export const First = Template.bind({});
First.args = {
    show: true,
} as SkillsTableOptionsProps;
