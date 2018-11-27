const babel =  require('rollup-plugin-babel');
const path =  require('path');

module.exports = {
    input: path.join(__dirname, './test/index.js'),
    output: {
        file: 'dist/mue.js',
        name: 'hyper',
        format: 'iife'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
};