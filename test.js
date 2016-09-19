const refox = require( './refox' );
const options = require( './test/refox.config' );

refox( options, function() {
	console.log( 'listening on port: ', options.port );
} );
