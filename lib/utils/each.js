export default ( v, fn ) => {
	if ( typeof v !== 'object' ) {
		throw new Error( '[utils/each] v must be Object or Array' );
	}

	if ( typeof fn !== 'function' ) {
		throw new Error( '[utils/each] fn must be function' );
	}

	const keys = Object.keys( v );

	for ( let i = 0, len = keys.length; i < len; i++ ) {
		const key = keys[ i ];
		if ( fn( v[ key ], key, v ) === false ) {
			break;
		}
	}
};
