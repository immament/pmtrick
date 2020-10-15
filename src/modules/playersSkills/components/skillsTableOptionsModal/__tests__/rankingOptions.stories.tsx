import 'reflect-metadata';
import '@src/contentScript/services/contentScript.bootstrap';

import React from 'react';

import { Meta, Story } from '@storybook/react';

import { RankingOptions, RankingOptionsProps } from '../rankingOptions.component';

// // // //

export default {
    title: 'SkillsTable/Ranking Options',
    component: RankingOptions,
} as Meta;

const Template: Story<RankingOptionsProps> = (args) => <RankingOptions {...args} />;

// {
// const store = new Store<{ range: RankingRange }>({
//     range: args.range,
// });

// function handleChangeRanking({ field, value }: OnChangeRankingEvent): void {
//     const range = store.get('range');
//     range[field] = value;
//     store.set({ range });
// }
// return (
//     <State store={store}>
//         <RankingOptions {...args} onChangeRanking={handleChangeRanking} />
//     </State>
// );
// };

export const Primary = Template.bind({});

Primary.args = {
    id: 'current',
    label: 'Current ranking',
    range: { min: 50, max: 90 },
} as RankingOptionsProps;
