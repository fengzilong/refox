export default ( v, fn ) => {
	if ( typeof v !== 'object' ) {
		throw new TypeError( '[utils/each] Expected an Object or Array in the first argument' );
	}

	if ( typeof fn !== 'function' ) {
		throw new TypeError( '[utils/each] Expected a Function in the second argument' );
	}

	const keys = Object.keys( v );

	for ( let i = 0, len = keys.length; i < len; i++ ) {
		const key = keys[ i ];
		if ( fn( v[ key ], key, v ) === false ) {
			break;
		}
	}
};
