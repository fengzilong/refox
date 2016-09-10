import fs from 'mz/fs';
import resolveLoader from './resolve-loader';
import parseQuery from './utils/parse-query';

const loader = function ( options ) {
	const compilers = options.compile;

	return function* ( next ) {
		const request = this.request;
		let matched = false;

		for( let i = 0, len = compilers.length; i < len; i++ ) {
			let compiler = compilers[ i ];
			if( compiler.test( request.url, request ) ) {
				let content = compiler.content && compiler.content( request.url, request );
				let filepath = compiler.local && compiler.local( request.url, request );
				let body;

				if( content ) {
					body = content;
				} else if( filepath ) {
					// TODO: exists
					body = yield fs.readFile( filepath );
				}

				body = String( body );

				if( !body ) {
					continue;
				}

				matched = true;

				const loaders = compiler.loaders;

				let promise = Promise.resolve( body );
				for( let i = 0, len = loaders.length; i < len; i++ ) {
					let loaderString = loaders[ i ];
					let loaderName = loaderString.split( '?' )[ 0 ];
					let loaderQuery = loaderString.split( '?' )[ 1 ];
					let loaderPackageName = resolveLoader( loaderName );
					let loader = require( loaderPackageName );
					promise = promise.then(body => {
						return loader.call( {
							options: options,
							query: parseQuery( loaderQuery ) || {},
							filepath: filepath,
							set: this.set.bind( this ),
							get: this.get.bind( this ),
						}, body );
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

		if( !matched ) {
			yield next;
		}
	}
};

export default loader;
