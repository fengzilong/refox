/* eslint no-shadow: "off" */
import { each } from './utils';

export default function ( options ) {
	return function* ( next ) {
		const providers = options;
		const request = this.request;
		const url = request.url;

		let done;
		let fail;
		const promise = new Promise( ( resolve, reject ) => {
			done = resolve;
			fail = reject;
		} );

		let matched = false;
		let isSync = false;

		each( providers, provider => {
			const test = provider.test;
			const resolve = provider.resolve.bind( {
				async: () => content => (
					content instanceof Error ? fail( content ) : done( content )
				),
			} );

			if ( test( url, request ) ) {
				matched = true;
				isSync = provider.sync;

				const content = resolve( url, request );
				if ( typeof content !== 'undefined' ) {
					done( content );
				}

				if ( provider.sync === true ) {
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

				return false;
			}

			return true;
		} );

		if ( matched ) {
			yield promise;
		}

		if ( !matched || ( matched && isSync ) ) {
			yield next;
		}
	};
}
