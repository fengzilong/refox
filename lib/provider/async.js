import { each } from '../utils';

export default function asyncProvider( providers ) {
	const request = this.request;
	const url = request.url;

	let done;
	let fail;
	const promise = new Promise( ( resolve, reject ) => {
		done = resolve;
		fail = reject;
	} );

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
			return false;
		}

		return true;
	} );

	if ( !matched ) {
		return Promise.resolve();
	}

	return promise.then( content => {
		this.body = content;
	} );
}
