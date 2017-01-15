const path = require( 'path' );

module.exports = {
	port: 5000,
	quiet: true,
	debug: true,
	mock: [
		{
			sync: true,
			test: function( req ) {
				if( /sync/.test( req.url ) ) {
					return true;
				}
			},
			resolve: function( req ) {
				return '{ "youAreUsingPug": true, "foo": "bar" }';
			}
		},
		{
			test: function( req ) {
				if( /abc/.test( req.url ) ) {
					return true
				}
			},
			resolve: function( req ) {
				var cb = this.async();
				setTimeout(function() {
					cb( '321 delayed' );
				}, 1000);
			}
		}
	],
	compile: [
		{
			test: function( req ) {
				if( /sync/.test( req.url ) ) {
					return true;
				}
			},
			loaders: [
				'pug?root=' + path.resolve( __dirname, 'fixtures/views' )
			],
			local: function( req ) {
				return path.resolve( __dirname, 'fixtures/views/test.pug' );
			}
		},
	],
	static: [
		'lib'
	],
	redirect: {
		'res/*': path.resolve( __dirname, 'fixtures/assets' )
	}
};
