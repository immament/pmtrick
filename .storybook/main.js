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
        console.log('** Babel Plugins Length **: ', options.plugins.length, filteredPlugins.length);
        options.plugins = [...filteredPlugins, 'babel-plugin-transform-typescript-metadata'];

        return options;
    },
    webpackFinal: async (config) => {
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

        return config;
    },
};
