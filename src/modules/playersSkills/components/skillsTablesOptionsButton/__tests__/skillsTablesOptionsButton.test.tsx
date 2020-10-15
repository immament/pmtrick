import 'reflect-metadata';

import React from 'react';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { container } from 'tsyringe';

import { PlayersSkillsFactoryMock } from '@src/__mocks__/playersSkillsFactory.mock';
import { PlayersSkillsFactory } from '@src/modules/playersSkills/services/playersSkills.factory';

import { SkillsTablesOptionsButton } from '../skillsTablesOptionsButton.component';

describe('SkillsTableOptionsButton', () => {
    beforeAll(() => {
        container.register(PlayersSkillsFactory, PlayersSkillsFactoryMock);
    });
    it('component renders', () => {
        const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
            .create(<SkillsTablesOptionsButton />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
