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
	query = String(query);
	let ret = {};
	let tmp = query.split('&');
	for (let i = 0, len = tmp.length; i < len; i++) {
		let tmp2 = tmp[i].split('=');
		let key = tmp2[0];
		let value = tmp2[1];

		// convert number
		if (/^\d+$/.test(value)) {
			value = parseInt(value);
		} else if (/^[\d\.]+$/.test(value)) {
			value = parseFloat(value);
		}

		ret[key] = value || '';
	}
	return ret;
});

const loader = function (options) {
	const compilers = options.compile;

	return function* (next) {
		const request = this.request;
		let matched = false;

		for (let i = 0, len = compilers.length; i < len; i++) {
			let compiler = compilers[i];
			if (compiler.test(request.url, request)) {
				let content = compiler.content && compiler.content(request.url, request);
				let filepath = compiler.local && compiler.local(request.url, request);
				let body;

				if (content) {
					body = content;
				} else if (filepath) {
					// TODO: exists
					body = yield fs.readFile(filepath);
				}

				body = String(body);

				if (!body) {
					continue;
				}

				matched = true;

				const loaders = compiler.loaders;

				let promise = Promise.resolve(body);
				for (let i = 0, len = loaders.length; i < len; i++) {
					let loaderString = loaders[i];
					let loaderName = loaderString.split('?')[0];
					let loaderQuery = loaderString.split('?')[1];
					let loaderPackageName = resolveLoader(loaderName);
					let loader = require(loaderPackageName);
					promise = promise.then(body => {
						return loader.call({
							options: options,
							query: parseQuery(loaderQuery) || {},
							filepath: filepath,
							set: this.set.bind(this),
							get: this.get.bind(this)
						}, body);
					});
				}

				promise.then(body => {
					// console.log( 'received from loaders', body );
					this.body = body;
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

		if (!matched) {
			yield next;
		}
	};
};

const ensureArray = v => {
	if (Array.isArray(v)) {
		return v;
	}

	return [v];
};

var mock = (mockOptions => {
	const syncProviders = ensureArray(mockOptions.sync);
	const asyncProviders = ensureArray(mockOptions.async);

	return function* (next) {
		const request = this.request;
		yield next;
	};
});

var serve$1 = (paths => {
	let serves = [];
	let serveOptions = {};
	for (let i = 0, len = paths.length; i < len; i++) {
		console.log(paths[i]);
		serves.push(serve(paths[i], serveOptions));
	}
	return compose(serves);
});

var logger$1 = (options => {
	return logger(options || {});
});

var index = (options => {
	const app = koa();

	// middlewares
	app.use(logger$1());
	app.use(loader(options));
	app.use(mock(options.mock));
	app.use(serve$1(options.static));

	const server = app.listen(options.port, () => {
		console.log(`listening on port: ${ options.port }`);
	});
});

module.exports = index;