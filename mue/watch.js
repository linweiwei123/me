const rollup = require('rollup');

const watchOptions = require('./rollup.config');
const watcher = rollup.watch(watchOptions);

watcher.on('event', event => {
    // event.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //   FATAL        — encountered an unrecoverable error
    if(event.code === 'END'){
        console.log('build success！');
    }
    else if(event.code === 'ERROR' || event.code === 'FATAL'){
        console.log('构建遇到错误',event);
    }
});