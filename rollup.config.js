import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
	entry: 'index.js',
	external: [
		'koa',
		'mz/fs',
		'koa-static',
		'koa-compose',
		'koa-logger'
	],
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
			dest: 'refox.js',
			format: 'cjs'
		}
	]
};
