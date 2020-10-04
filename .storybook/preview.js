import '../src/scss/app.scss';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

import { browser } from '../src/__mocks__/webextension-polyfill';

// Add the decorator to all stories
window.browser = browser;
