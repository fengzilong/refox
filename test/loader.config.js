const path = require( 'path' );

const cwd = process.cwd();

module.exports = {
	port: 5000,
	cache: true,
	verbose: true,
	mock: {
		sync: {
			test: function( url, req ) {
				if( /sync/.test(  ) ) {
					return true;
				}
			},
			resolve: function( url, req ) {
				// TODO
			}
		},
		async: {
			test: function( url, req ) {
				if( /async/.test( url ) ) {
					return true
				}
			},
			resolve: function( url, req ) {
				// TODO
			}
		},
	},
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
				'pug?root=' + path.resolve( cwd, 'test/fixtures/views' )
			],
			local: function( url, req ) {
				return path.resolve( cwd, 'test/fixtures/views/test.pug' );
			}
		}
	],
	static: [
		'lib'
	],
};
