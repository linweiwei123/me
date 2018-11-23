const path =  require('path');
const babel =  require('rollup-plugin-babel');

export default {
    input: path.join(__dirname, './data-binding.js'),
    output: {
        file: 'dist/db.js',
        name: 'me',
        format: 'iife'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
};