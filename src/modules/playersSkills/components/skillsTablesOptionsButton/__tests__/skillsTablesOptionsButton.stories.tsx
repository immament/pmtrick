import React from 'react';

import { Meta, Story } from '@storybook/react';

import { SkillsTablesOptionsButton } from '../skillsTablesOptionsButton.component';

// // // //

export default {
    title: 'SkillsTable/SkillsTablesOptionsButton',
    component: SkillsTablesOptionsButton,
} as Meta;

const Template: Story = (args) => <SkillsTablesOptionsButton {...args} />;

export const Primary = Template.bind({});
