const babel =  require('rollup-plugin-babel');

export default {
    input: './test/index.js',
    output: {
        file: 'dist/me.js',
        name: 'hyper',
        format: 'iife'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ]
};