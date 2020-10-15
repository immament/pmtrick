import ReactDOM from 'react-dom';

ReactDOM.createPortal = jest.fn((element, _node) => {
    return element;
});
