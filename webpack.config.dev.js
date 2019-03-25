/*jshint esversion: 6 */

const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}, argv = {}) => {

    var config = {
        entry: {
            app: path.join(__dirname, "src/script", "app.ts")
        },

        output: {
            path: path.resolve(__dirname, "www"),
            filename: "[name].js",
            chunkFilename: "[name].js"
        },
        watch: true,
        target: "web",
        devtool: 'inline-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'www'),
            port: 8000,
            hot: true,
            open: true
        },

        plugins: [
            new htmlWebpackPlugin({
                template: './src/index.html',
                inject: true,
                filename: 'index.html',
                title: 'Www',
                chunksSortMode: 'none'
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.WatchIgnorePlugin(['www', 'node_modules'])
        ],

        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    use: [{ loader: 'ts-loader' }],
                    include: [
                        path.join(__dirname, "src")
                    ]
                }
            ]
        },

        resolve: {
            extensions: [".ts", ".js"],
            modules: [ path.resolve(__dirname, 'src'), "node_modules" ]
        }
    };

    return config;
};
