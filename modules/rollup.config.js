const path =  require('path');
const babel =  require('rollup-plugin-babel');

export default {
    input: path.join(__dirname, './test/parser-html.js'),
    output: {
        file: 'dist/parse-demo.js',
        name: 'me',
        format: 'iife'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
};