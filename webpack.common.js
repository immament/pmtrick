// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        contentscript: path.join(__dirname, 'src/contentScript/contentScriptRoot.ts'),
        tacticEditor: path.join(__dirname, 'src/contentScript/modules/tacticEditor.injected.ts'),
    },
    output: {
        path: path.join(__dirname, 'dist/js'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.app.json',
                        },
                    },
                ],
            },
            {
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
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/',
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            '@src': path.resolve(__dirname, 'src/'),
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js',
                    to: 'browser-polyfill.js',
                    toType: 'file',
                },
            ],
        }),
    ],
};
