import React, { ReactNode, ReactPortal } from 'react';
import ReactDOM from 'react-dom';
import renderer, { ReactTestRendererJSON } from 'react-test-renderer';

import { Modal } from '../modal.component';

describe('Modal', () => {
    const oldCreatePortal = ReactDOM.createPortal;
    beforeAll(() => {
        (ReactDOM.createPortal as unknown) = jest.fn((element, _node) => {
            return element;
        });
    });

    afterAll(() => {
        // (ReactDOM.createPortal as jest.Mock).mockClear();
        ReactDOM.createPortal = oldCreatePortal;
    });
    it('component renders', () => {
        ReactDOM.createPortal = (children: ReactNode): ReactPortal => children as ReactPortal; // for components that use Portal

        const handleClose = (_e: React.MouseEvent<Element>): void => {
            // TODO
        };

        const tree: ReactTestRendererJSON | ReactTestRendererJSON[] | null = renderer
            .create(<Modal show={true} title="Sample title" onClose={handleClose} />)
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
