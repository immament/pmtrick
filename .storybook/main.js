const webpack = require('webpack');
const path = require('path');
const util = require('util');

module.exports = {
    typescript: {
        check: true,
        checkOptions: {},
        reactDocgen: 'react-docgen-typescript',
        reactDocgenTypescriptOptions: {
            shouldExtractLiteralValuesFromEnum: true,
            propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
        },
    },
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
    babel: async (options) => {
        // Remove @babel/plugin-transform-classes - problem with constructor properties
        const filteredPlugins = options.plugins.filter(
            (plugin) => typeof plugin !== 'string' || !plugin.endsWith('@babel/plugin-transform-classes/lib/index.js'),
        );
        console.log('** Bable Plugins Length **: ', options.plugins.length, filteredPlugins.length);
        options.plugins = [...filteredPlugins, 'babel-plugin-transform-typescript-metadata'];

        return options;
    },
    webpackFinal: async (config) => {
        // config.module.rules[0].use[0].options.plugins.splice(8, 1);
        // console.log(
        //     'config.module.rules',
        //     util.inspect(config.module.rules[0], { showHidden: false, depth: 7, colors: true }),
        // );

        // config.module.rules = [
        //     ...config.module.rules,
        //     {
        //         exclude: /node_modules/,
        //         test: /\.tsx?$/,
        //         use: 'ts-loader',
        //     },
        // ];

        config.module.rules.push({
            exclude: /node_modules/,
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader', // Creates style nodes from JS strings
                },
                {
                    loader: 'css-loader', // Translates CSS into CommonJS
                },
                {
                    loader: 'sass-loader', // Compiles Sass to CSS
                },
            ],
        });

        config.resolve = {
            ...config.resolve,
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                '@src': path.resolve(__dirname, '../src/'),
            },
        };

        config.plugins = [
            ...config.plugins,
            new webpack.NormalModuleReplacementPlugin(/webextension-polyfill-ts/, (resource) => {
                // Gets absolute path to mock `webextension-polyfill-ts` package
                // NOTE: this is required beacuse the `webextension-polyfill-ts`
                // package can't be used outside the environment provided by web extensions
                const absRootMockPath = path.resolve(__dirname, '../src/__mocks__/webextension-polyfill-ts.ts');

                // Gets relative path from requesting module to our mocked module
                const relativePath = path.relative(resource.context, absRootMockPath);

                // Updates the `resource.request` to reference our mocked module instead of the real one
                resource.request = relativePath;
            }),
        ];

        return config;
    },
};
