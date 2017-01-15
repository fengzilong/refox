/* eslint no-unused-vars: "off" */

import { ensureArray, each } from '../utils';

export default function ( providers ) {
	return function * ( next ) {
		const request = this.request;

		let matched = false;
		let isSync = false;

		let done;
		let fail;
		const promise = new Promise( ( resolve, reject ) => {
			done = resolve;
			fail = reject;
		} );
		const context = {
			async: () => content => (
				content instanceof Error ? fail( content ) : done( content )
			),
		};

		each( providers, provider => {
			if ( provider.test( request ) ) {
				matched = true;
				isSync = provider.sync;

				const content = provider.resolve.call( context, request );
				if ( typeof content !== 'undefined' ) {
					done( content );
				}

				if ( provider.sync ) {
					promise
						.then( content => {
							this.state.syncData = JSON.parse( content );
						} )
						.catch( () => {
							this.state.syncData = {};
						} );
				} else {
					promise
						.then( content => {
							this.body = content;
						} )
						.catch( () => {
							this.body = '';
						} );
				}

				// break loop
				return false;
			}

			return true;
		} );

		if ( matched ) {
			yield promise;
		}

		// 如果未匹配，或者匹配到同步数据
		if ( !matched || ( matched && isSync ) ) {
			yield next;
		}
	};
}
