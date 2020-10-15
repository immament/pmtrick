import './styles.scss';

import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

const modalRoot: HTMLElement = document.body;

export type ModalProps = {
    onClose?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    show: boolean;
    title: string;
    size?: 'lg' | 'sm';
    className?: string;
};
export class Modal extends React.Component<ModalProps> {
    private element: Element;

    constructor(props: ModalProps) {
        super(props);
        this.element = document.createElement('div');
    }

    componentDidMount(): void {
        modalRoot.appendChild(this.element);
    }

    componentWillUnmount(): void {
        modalRoot.removeChild(this.element);
    }

    private onClose = (e: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClose && this.props.onClose(e);
    };

    private modalClassName(): string {
        return `modal-dialog ${this.props.size ? 'modal-' + this.props.size : ''} ${this.props.className || ''}`;
    }

    render(): ReactNode {
        if (!this.props.show) {
            return null;
        }
        return ReactDOM.createPortal(
            <div className="pmt-modal modal" id="modal">
                <div className={this.modalClassName()} role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={this.onClose}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">{this.props.children}</div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-default"
                                data-dismiss="modal"
                                onClick={this.onClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>,
            this.element,
        );
    }
}
