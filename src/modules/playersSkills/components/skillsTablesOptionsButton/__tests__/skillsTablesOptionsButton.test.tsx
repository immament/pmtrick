import 'reflect-metadata';

import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import { SkillsTablesOptionsButton } from '../skillsTablesOptionsButton.component';

describe('SkillsTableOptionsButton', () => {
    it('component renders', () => {
        const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
            .create(<SkillsTablesOptionsButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
