import path from 'path';

const cwd = process.cwd();

export default {
	port: 6000,
	static: [

	],
	loaders: [
		{
			test: function( req ) {
				if( /xxx/.test( req.url ) ) {
					return true;
				}

				if( /yyy/.test( req.url ) ) {
					return true;
				}
			},
			loaders: [ 'pug?root=' + path.resolve( cwd, 'test/fixtures/views&data=' + path.resolve( cwd, 'test/fixtures/data' ) ) ],
			local: function( req ) {
				return path.resolve( cwd, 'test/fixtures/views/test.pug' );
			},
			content: function( req ) {
				return false;
			}
		}
	]
};
