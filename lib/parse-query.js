/**
 * `a=b&c=123`
 * ->
 * {
 * 	a: 'b',
 * 	c: 123
 * }
 */
export default query => {
	query = String( query );
	let ret = {};
	let tmp = query.split( '&' );
	for( let i = 0, len = tmp.length; i < len; i++ ) {
		let tmp2 = tmp[ i ].split( '=' );
		let key = tmp2[ 0 ];
		let value = tmp2[ 1 ];

		// convert number
		if( /^\d+$/.test( value ) ) {
			value = parseInt( value );
		} else if( /^[\d\.]+$/.test( value ) ) {
			value = parseFloat( value );
		}

		ret[ key ] = value || '';
	}
	return ret;
};
