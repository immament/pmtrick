import React from 'react';

import { Meta, Story } from '@storybook/react';

import { Modal, ModalProps } from '../modal.component';

// // // //

export default {
    title: 'Common/Modal',
    component: Modal,
} as Meta;

const Template: Story<ModalProps> = (args) => <Modal {...args} />;

export const First = Template.bind({});
First.args = {
    show: true,
    title: 'Sample title',
    children: 'Sample content',
} as ModalProps;
