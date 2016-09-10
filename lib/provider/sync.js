/* eslint no-unused-vars: "off" */
import { each } from '../utils';

export default function syncProvider( providers ) {
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

	// this.state.syncData提供给后面的loaders使用
	if ( !matched ) {
		this.state.syncData = {};
		return Promise.resolve();
	}

	return promise.then( content => {
		try {
			this.state.syncData = JSON.parse( content );
		} catch ( e ) {
			this.state.syncData = {};
		}
	} );
}
