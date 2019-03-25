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
            filename: "[name]-[chunkhash:14].min.js",
            chunkFilename: "[name]-[chunkhash:14].min.js"
        },
        
        target: "web",
        devtool: false,

        plugins: [
            new htmlWebpackPlugin({
                template: './src/index.html',
                inject: true,
                filename: 'index.html',
                title: 'Www',
                chunksSortMode: 'none'
            })
        ],

        performance: {
            hints: "warning", //"warning", // error / false
        },

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
