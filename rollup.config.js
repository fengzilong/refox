import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'index.js',
	plugins: [
		nodeResolve({
			main: true
		}),
		commonjs({
			include: 'node_modules/**'
		}),
		json(),
		babel()
	],
	targets: [
		{
			dest: 'dist/refox.js',
			format: 'cjs'
		}
	]
};
