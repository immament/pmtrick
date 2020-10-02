/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// src/__mocks__/webextension-polyfill-ts
// Update this file to include any mocks for the `webextension-polyfill-ts` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser
// eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SendMessageOptionsType {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const browser: any = {
    tabs: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        executeScript(_currentTabId: number, _details: any): Promise<{ done: true }> {
            return Promise.resolve({ done: true });
        },
    },
    runtime: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sendMessage(_message: any, _options?: SendMessageOptionsType): Promise<any> {
            return Promise.resolve({});
        },
    },
    storage: {
        local: {
            get(
                _keys?:
                    | null
                    | string
                    | string[]
                    | {
                          [s: string]: any;
                      },
            ): Promise<{
                [s: string]: any;
            }> {
                return Promise.resolve({});
            },

            set(_items: any): Promise<void> {
                return Promise.resolve();
            },
        },
    },
};
