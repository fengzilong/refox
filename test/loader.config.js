const path = require( 'path' );

const cwd = process.cwd();

module.exports = {
	port: 5000,
	mock: {
		sync: {
			test: /template-url/,
			resolve: function( url, req ) {
				// TODO
			}
		},
		async: {
			test: /ajax-url/,
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

	],
};
