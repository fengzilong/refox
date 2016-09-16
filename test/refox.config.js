const path = require( 'path' );

module.exports = {
	port: 5000,
	verbose: true,
	debug: true,
	mock: [
		{
			sync: true,
			test: function( url, req ) {
				if( /xxx/.test( url ) ) {
					return true;
				}
			},
			resolve: function( url, req ) {
				var cb = this.async();
				setTimeout(function() {
					cb( '{ "youAreUsingPug": true, "foo": "bar" }' );
				}, 1000);
			}
		},
		{
			test: function( url, req ) {
				if( /async/.test( url ) ) {
					return true
				}
			},
			resolve: function( url, req ) {
				var cb = this.async();
				setTimeout(function() {
					cb( '321 delayed' );
				}, 1000);
			}
		}
	],
	compile: [
		{
			test: function( url, req ) {
				if( /xxx/.test( url ) ) {
					return true;
				}

				if( /yyy/.test( url ) ) {
					return true;
				}
			},
			loaders: [
				'pug?root=' + path.resolve( __dirname, 'fixtures/views' )
			],
			local: function( url, req ) {
				return path.resolve( __dirname, 'fixtures/views/test.pug' );
			}
		}
	],
	static: [
		'lib'
	],
};
