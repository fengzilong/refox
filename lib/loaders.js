import fs from 'mz/fs';
import resolveLoaderName from './resolve-loader-name';
import parseQuery from './parse-query';

const loaders = function ( allOptions ) {
	const options = allOptions.loaders;
	
	return function* ( next ) {
		for( let i = 0, len = options.length; i < len; i++ ) {
			let option = options[ i ];
			let request = this.request;
			if( option.test( request ) ) {
				let content = option.content && option.content( request );
				let filepath = option.local && option.local( request );
				let body;

				if( content ) {
					body = content;
				} else if( filepath ) {
					// TODO: exists
					body = yield fs.readFile( filepath );
				}

				body = String( body );

				if( !body ) {
					return yield next;
				}

				const loaders = option.loaders;

				let promise = Promise.resolve( body );

				for( let i = 0, len = loaders.length; i < len; i++ ) {
					let loaderString = loaders[ i ];
					let loaderName = loaderString.split( '?' )[ 0 ];
					let loaderQuery = loaderString.split( '?' )[ 1 ];
					let loaderPath = resolveLoaderName( loaderName );
					let loader = require( loaderPath );
					promise = promise.then(body => {
						return loader.call( {
							options: allOptions,
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
				yield next;
			}
		}
	}
};

export default loaders;
