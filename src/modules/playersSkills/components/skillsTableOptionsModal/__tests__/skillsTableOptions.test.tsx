import 'reflect-metadata';

import React from 'react';
import ReactDOM from 'react-dom';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';
import { container } from 'tsyringe';

import { PlayersSkillsFactoryMock } from '@src/__mocks__/playersSkillsFactory.mock';
import { PlayersSkillsFactory } from '@src/modules/playersSkills/services/playersSkills.factory';

import SkillsTableOptions from '../skillsTableOptions.component';

describe('SkillsTableOptions', () => {
    const oldCreatePortal = ReactDOM.createPortal;
    beforeAll(() => {
        container.register(PlayersSkillsFactory, PlayersSkillsFactoryMock);

        (ReactDOM.createPortal as unknown) = jest.fn((element, _node) => {
            return element;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal = oldCreatePortal;
    });

    it('component renders', () => {
        const handleClose = (_e: React.MouseEvent<Element>): void => {
            // TODO
        };

        const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
            .create(<SkillsTableOptions show={true} onClose={handleClose} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
