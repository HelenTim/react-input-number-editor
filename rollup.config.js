import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named'
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
            exports: 'named'
        },
        {
            file: insertMinifiedClassifier(pkg.main),
            format: 'cjs',
            sourcemap: true,
            exports: 'named'
        },
        {
            file: insertMinifiedClassifier(pkg.module),
            format: 'es',
            sourcemap: true,
            exports: 'named'
        }
    ],
    plugins: [
        external(),
        postcss({
            modules: true
        }),
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
        commonjs(),
        terser({
            include: [/^.+\.min\.js$/]
        })
    ]
};

function insertMinifiedClassifier(filename) {
    const index = filename.lastIndexOf('.');
    if (index > -1)
        return filename.slice(0, index) + '.min' + filename.slice(index);
    return filename;
}
