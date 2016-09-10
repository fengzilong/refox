/* eslint global-require: "off" */

import fs from 'mz/fs';
import resolveLoader from './resolve-loader';
import { parseQuery } from './utils';

export default function ( options ) {
	const compilers = options.compile;

	return function* ( next ) {
		const request = this.request;
		const syncData = this.state.syncData || {};
		let matched = false;
		let compiler;

		for ( let i = 0, len = compilers.length; i < len; i++ ) {
			compiler = compilers[ i ];
			if ( compiler.test( request.url, request ) ) {
				const content = compiler.content && compiler.content( request.url, request );
				const filepath = compiler.local && compiler.local( request.url, request );
				let body;

				if ( content ) {
					body = content;
				} else if ( filepath ) {
					// TODO: exists
					body = yield fs.readFile( filepath );
				}

				body = String( body );

				// test通过，且body不为空
				if ( body ) {
					matched = true;

					const loaders = compiler.loaders;

					let promise = Promise.resolve( body );
					for ( let j = 0, loaderLen = loaders.length; j < loaderLen; j++ ) {
						const loaderString = loaders[ j ];
						const loaderName = loaderString.split( '?' )[ 0 ];
						const loaderQuery = loaderString.split( '?' )[ 1 ];
						const loaderPackageName = resolveLoader( loaderName );
						const loader = require( loaderPackageName );
						promise = promise.then( v => loader.call( {
							syncData,
							options,
							filepath,
							query: parseQuery( loaderQuery ) || {},
							set: this.set.bind( this ),
							get: this.get.bind( this ),
						}, v ) );
					}

					promise.then( v => {
						// console.log( 'received from loaders', v );
						this.body = v;
					} );

					promise.catch( err => {
						throw err;
					} );

					yield promise;
					// 在当前compiler截断，不再继续往下传递，也不继续查找下一个compiler
					// yield next;
					break;
				}
			}
		}

		if ( !matched ) {
			yield next;
		}
	};
}
