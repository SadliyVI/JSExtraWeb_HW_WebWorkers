const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = (_, argv) => {
    const isProd = argv.mode === 'production';

    return {
        entry: path.resolve(__dirname, 'src', 'index.js'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProd ? 'assets/[name].[contenthash].js' : 'assets/[name].js',
            assetModuleFilename: 'assets/[hash][ext][query]',
            clean: true,
            publicPath: '' // важно для GitHub Pages (relative paths)
        },
        devtool: isProd ? false : 'source-map',
        devServer: {
            port: 8080,
            historyApiFallback: true,
            static: {
                directory: path.resolve(__dirname, 'dist')
            }
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: [isProd ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader']
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.worker\.js$/i,
                    use: [
                        {
                            loader: 'worker-loader',
                            options: { filename: isProd ? 'assets/[name].[contenthash].worker.js' : 'assets/[name].worker.js' }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html'),
                inject: 'body'
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, 'public', 'manifest.webmanifest'), to: 'manifest.webmanifest' },
                    { from: path.resolve(__dirname, 'public', 'icons'), to: 'icons' }
                ]
            }),
            ...(isProd
                ? [
                    new MiniCssExtractPlugin({
                        filename: 'assets/[name].[contenthash].css'
                    }),
                    new InjectManifest({
                        swSrc: path.resolve(__dirname, 'src', 'sw', 'sw.js'),
                        swDest: 'sw.js',
                        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
                    })
                ]
                : [])
        ],
        resolve: {
            extensions: ['.js']
        }
    };
};