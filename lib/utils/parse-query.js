/**
 * `a=b&c=123`
 * ->
 * {
 * 	a: 'b',
 * 	c: 123
 * }
 */
export default query => {
	const queryStr = String( query );
	const ret = {};
	const tmp = queryStr.split( '&' );

	for ( let i = 0, len = tmp.length; i < len; i++ ) {
		const pair = tmp[ i ].split( '=' );
		const key = pair[ 0 ];
		let value = pair[ 1 ];

		// convert into number
		if ( /^\d+$/.test( value ) ) {
			value = parseInt( value, 10 );
		} else if ( /^[\d\.]+$/.test( value ) ) {
			value = parseFloat( value );
		}

		ret[ key ] = value || '';
	}
	return ret;
};
