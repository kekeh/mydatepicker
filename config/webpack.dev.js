const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

// plugins
const DedupePlugin = webpack.optimize.DedupePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    target: 'web',
    cache: true,
    debug: true,
    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: [/\.spec\.ts$/],
                loader: 'ts'
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
            {
                test: /\.css$/,
                loader: "to-string-loader!css-loader"
            }
        ],
        noParse: [
            /angular2\/bundles\/.+/
        ]
    },

    stats: {
        cached: true,
        cachedAssets: true,
        chunks: true,
        chunkModules: true,
        colors: true,
        hash: false,
        reasons: false,
        timings: true,
        version: false
    },

    entry: {
        app: [
            'webpack-dev-server/client?http://localhost:5000',
            'src/main'
        ],
        vendor: [
            'es6-shim',
            'reflect-metadata',
            '@angular/common',
            '@angular/core',
            '@angular/platform-browser',
            '@angular/platform-browser-dynamic',
            'rxjs',
            'zone.js'
        ]
    },

    plugins: [
        new DedupePlugin(),
        new OccurenceOrderPlugin(),
        new HtmlWebpackPlugin({
            chunksSortMode: 'none',
            filename: 'index.html',
            hash: true,
            inject: 'body',
            template: './src/index.html'
        }),
        new LiveReloadPlugin({
            appendScriptTag: true
        })
    ],

    resolve: {
        extensions: ['', '.ts', '.js'],
        modulesDirectories: ['node_modules'],
        root: path.resolve('.')
    },

    output: {
        filename: '[name].js',
        path: path.resolve('./target'),
        publicPath: '/'
    },

    devServer: {
        contentBase: './src',
        historyApiFallback: true,
        port: 5000,
        publicPath: '/',
        stats: {
            cached: true,
            cachedAssets: true,
            chunks: true,
            chunkModules: false,
            colors: true,
            hash: false,
            reasons: true,
            timings: true,
            version: false
        }
    }
};