/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'assets/manifest.dev.json',
                    to: 'manifest.json',
                    toType: 'file',
                },
            ],
        }),
    ],
});
