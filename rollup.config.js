import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

const pkg = require( './package.json' );
const external = Object.keys( pkg.dependencies );

export default {
	entry: 'index.js',
	external,
	plugins: [
		nodeResolve( {
			main: true
		} ),
		commonjs( {
			include: 'node_modules/**'
		} ),
		json(),
		babel( {
			exclude: 'node_modules/**',
			babelrc: false,
			presets: [
				[
					'es2015',
					{
						modules: false
					}
				]
			],
			plugins: [ 'transform-regenerator' ]
		} )
	],
	targets: [
		{
			dest: pkg.main,
			format: 'cjs'
		}
	]
};
