export default ( v, fn ) => {
	if ( typeof v !== 'object' ) {
		throw new Error( '[utils/each] v must be Object or Array' );
	}

	if ( typeof fn !== 'function' ) {
		throw new Error( '[utils/each] fn must be function' );
	}

	if( Array.isArray( v ) ) {
		for( let i = 0, len = v.length; i < len; i++ ) {
			if( fn( v[ i ], i, v ) === false ) {
				break;
			}
		}
	} else {
		for( let i in v ) {
			if( fn( v[ i ], i, v ) === false ) {
				break;
			}
		}
	}
}
