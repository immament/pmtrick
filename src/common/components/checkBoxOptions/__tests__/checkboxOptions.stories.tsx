import 'reflect-metadata';
import '@src/contentScript/services/contentScript.bootstrap';

import log from 'loglevel';
import React from 'react';
import { container } from 'tsyringe';

import { CheckBoxItems } from '@src/common/components/checkBoxOptions/checkBoxItems.service';
import {
    CheckboxOptions,
    CheckboxOptionsProps,
} from '@src/common/components/checkBoxOptions/checkboxOptions.component';
import { Meta, Story } from '@storybook/react';

import { CheckboxItem } from '../checkboxItem.model';

// // // //

const checkBoxItems = container.resolve(CheckBoxItems);

export default {
    title: 'Common/CheckboxOptions',
    decorators: [(Story) => <Story />],
    component: CheckboxOptions,
} as Meta;

function onChecked(cols: CheckboxItem[]): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event) => {
        const target = event.target;
        columns = checkBoxItems.checked(cols, target);
    };
}

const Template: Story<CheckboxOptionsProps> = ({ columns, ..._args }: CheckboxOptionsProps) => {
    return <CheckboxOptions columns={columns} onCheckedChange={onChecked(columns)} />;
};

export const Primary = Template.bind({});

let columns = [
    {
        name: 'wage',
        isChecked: false,
        label: 'Wage',
    },
    {
        name: 'gs',
        isChecked: true,
        label: 'GS',
    },
];

Primary.args = {
    columns: columns,
    // onCheckedChange: onCheckedChange(state),
} as CheckboxOptionsProps;
