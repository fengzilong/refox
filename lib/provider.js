import { each } from './utils';

export default function( options ) {
	const providers = options;
	const request = this.request;
	const url = request.url;

	let done;
	let fail;
	const promise = new Promise( ( resolve, reject ) => {
		done = resolve;
		fail = reject;
	} );

	return function* ( next ) {
		console.log( '---' );
		let matched = false;

		each( providers, provider => {
			const test = provider.test;
			const resolve = provider.resolve.bind( {
				async: () => content => (
					content instanceof Error ? fail( content ) : done( content )
				),
			} );

			if ( test( url, request ) ) {
				matched = true;
				const content = resolve( url, request );
				if ( typeof content !== 'undefined' ) {
					done( content );
				}

				if( provider.sync === true ) {
					promise
						.then( content => {
							console.log( 'sync data', content );
							this.state.syncData = JSON.parse( content );
						} )
						.catch( e => {
							this.state.syncData = {};
						} );
				} else {
					promise
						.then( content => {
							console.log( 'async data', content );
							this.body = content;
						} )
						.catch( e => {
							this.body = '';
						} );
				}

				return false;
			}

			return true;
		} );

		if( !matched ) {
			return yield next;
		}
	}
}
