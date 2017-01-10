export default ( v, fn ) => {
	if ( typeof v !== 'object' ) {
		throw new TypeError( 'Expected an Object or Array in the first argument, got ' + ( typeof v ) );
	}

	if ( typeof fn !== 'function' ) {
		throw new TypeError( 'Expected a Function in the second argument, got ' + ( typeof fn ) );
	}

	const keys = Object.keys( v );

	for ( let i = 0, len = keys.length; i < len; i++ ) {
		const key = keys[ i ];
		if ( fn( v[ key ], key, v ) === false ) {
			break;
		}
	}
};
