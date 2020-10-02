import React from 'react';

import { Meta, Story } from '@storybook/react';

import { SkillsTablesOptionsButton } from '../skillsTablesOptionsButton.component';

// // // //

export default {
    title: 'Content/Content',
    component: SkillsTablesOptionsButton,
} as Meta;

const Template: Story = (args) => <SkillsTablesOptionsButton {...args} />;

export const First = Template.bind({});
