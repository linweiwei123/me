'use strict';

const webpack = require('webpack');
const path = require('path');
const bs = require('browser-sync').create();
const express = require('express');
const app = express();
const port = 3000;


const webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'source-map';
const compiler = webpack(webpackConfig);

// to watch /asssets
compiler.watch({
    aggregateTimeout: 300
}, (err, stats) => {
    console.log(err ? err : '[webpack]: build done!');
    console.log(stats.toString());
});

// start browser-sync
bs.init({
    port: '4000',
    proxy: 'http://localhost:3000',
    files: [
        'dist/**/*.js',
        'dist/**/*.html',
        'dist/**/*.css'
    ]
});

app.use(express.static(path.resolve(__dirname, './dist')));

// Serve the files on port 3000.
app.listen(port, function () {
    console.log('Example app listening on port port!\n');
});
