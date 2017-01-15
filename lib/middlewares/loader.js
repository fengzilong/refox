/* eslint global-require: "off" */
/* eslint no-shadow: "off" */

// import fs from 'mz/fs';
import fs from 'fs';
import resolveLoader from '../resolve-loader';
import { parseQuery } from '../utils';

export default options => function * ( next ) {
	const compilers = options.compile;
	const request = this.request;
	const syncData = this.state.syncData || {};
	let matched = false;
	let compiler;

	for ( let i = 0, len = compilers.length; i < len; i++ ) {
		compiler = compilers[ i ];
		if ( compiler.test( request ) ) {
			const filepath = compiler.local && compiler.local( request );
			let body;

			if ( filepath ) {
				// TODO: exists
				// TODO: cache visited local filepath, and add to watchlist, should consider deps
				body = fs.readFileSync( filepath );
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

					promise = promise.then( v => {
						let done;
						let fail;
						const p = new Promise( ( resolve, reject ) => {
							done = resolve;
							fail = reject;
						} );

						const content = loader.call( {
							options,
							filepath,
							data: syncData,
							query: parseQuery( loaderQuery ) || {},
							async: () => content => (
								content instanceof Error ? fail( content ) : done( content )
							),
							set: this.set.bind( this ),
							get: this.get.bind( this ),
						}, v );
						// 如果有return内容，直接done
						if ( typeof content !== 'undefined' ) {
							done( content );
						}
						return p;
					} );
				}

				promise.then( v => {
					// console.log( 'received from loaders', v );
					this.body = v;
				} );

				promise.catch( err => {
					throw err;
				} );

				yield promise;
				// 如果匹配，则忽略后面的compilers
				break;
			}
		}
	}

	if ( !matched ) {
		yield next;
	}
};
