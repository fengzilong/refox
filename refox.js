'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var koa = _interopDefault(require('koa'));
var fs = _interopDefault(require('mz/fs'));
var serve = _interopDefault(require('koa-static'));
var compose = _interopDefault(require('koa-compose'));
var logger = _interopDefault(require('koa-logger'));

var resolveLoader = (loaderName => `refox-loader-${ loaderName }`);

/**
 * `a=b&c=123`
 * ->
 * {
 * 	a: 'b',
 * 	c: 123
 * }
 */
var parseQuery = (query => {
	const queryStr = String(query);
	const ret = {};
	const tmp = queryStr.split('&');

	for (let i = 0, len = tmp.length; i < len; i++) {
		const pair = tmp[i].split('=');
		const key = pair[0];
		let value = pair[1];

		// convert into number
		if (/^\d+$/.test(value)) {
			value = parseInt(value, 10);
		} else if (/^[\d\.]+$/.test(value)) {
			value = parseFloat(value);
		}

		ret[key] = value || '';
	}
	return ret;
});

function loader (options) {
	const compilers = options.compile;

	return function* (next) {
		const request = this.request;
		let matched = false;
		let compiler;

		for (let i = 0, len = compilers.length; i < len; i++) {
			compiler = compilers[i];
			if (compiler.test(request.url, request)) {
				const content = compiler.content && compiler.content(request.url, request);
				const filepath = compiler.local && compiler.local(request.url, request);
				let body;

				if (content) {
					body = content;
				} else if (filepath) {
					// TODO: exists
					body = yield fs.readFile(filepath);
				}

				body = String(body);

				// test通过，且body不为空
				if (body) {
					matched = true;

					const loaders = compiler.loaders;

					let promise = Promise.resolve(body);
					for (let j = 0, loaderLen = loaders.length; j < loaderLen; j++) {
						const loaderString = loaders[j];
						const loaderName = loaderString.split('?')[0];
						const loaderQuery = loaderString.split('?')[1];
						const loaderPackageName = resolveLoader(loaderName);
						const loader = require(loaderPackageName);
						promise = promise.then(v => loader.call({
							options,
							filepath,
							query: parseQuery(loaderQuery) || {},
							set: this.set.bind(this),
							get: this.get.bind(this)
						}, v));
					}

					promise.then(v => {
						// console.log( 'received from loaders', v );
						this.body = v;
					});

					promise.catch(err => {
						throw err;
					});

					yield promise;
					// 在当前compiler截断，不再继续往下传递，也不继续查找下一个compiler
					// yield next;
					break;
				}
			}
		}

		if (!matched) {
			yield next;
		}
	};
}

const ensureArray = v => Array.isArray(v) ? v : [v];

var mock = (mockOptions => {
	const syncProviders = ensureArray(mockOptions.sync);
	const asyncProviders = ensureArray(mockOptions.async);

	return function* (next) {
		const request = this.request;
		yield next;
	};
});

var serve$1 = (paths => {
	const serves = [];
	const serveOptions = {};
	for (let i = 0, len = paths.length; i < len; i++) {
		serves.push(serve(paths[i], serveOptions));
	}
	return compose(serves);
});

var logger$1 = (options => logger(options || {}));

var index = (options => {
	const app = koa();

	// middlewares
	app.use(logger$1());
	app.use(loader(options));
	app.use(mock(options.mock));
	app.use(serve$1(options.static));

	app.listen(options.port, () => {
		console.log(`listening on port: ${ options.port }`);
	});
});

module.exports = index;