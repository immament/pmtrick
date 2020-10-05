# DEV

## Directories

### dist

`dist` directory is the final content of the extension. Some resources are static. The js folder is generated using webpack.

### .storybook

[Storybook](https://storybook.js.org/) configuration directory

## src/contentSCript

Content script directory

-   [contentScriptRoot.ts](../src/contentScript/contentScriptRoot.ts)

Content scripts entry point

-   [contentScript.registry.ts](../src/contentScript/services/contentScript.registry.ts)

Content scripts registry - every new content script should be registered here.

-   [contentScript.bootstrap.ts](../src/contentScript/services/contentScript.bootstrap.ts)

Perform actions required to be performed initially

-   Directory `src/contentScript/contentServices`

It includes content script services for specific pages. Registered in contentScript.registry.ts

### src/modules

Source code of specific functionalities

## Commands

-   `yarn build` - compile production version to dist/js directory
-   `yarn build:dev` - compile dev version
-   `yarn dev` - compile dev version in watch mode
-   `yarn test` - run test using jest
-   `yarn storybook` - start storybook server
-   `yarn build-storybook` - build storybook
-   `yarn create-ext` - create extension package using zip

## Problems?

Please post and view issues on [GitHub](https://github.com/immament/pmtrick/issues)
