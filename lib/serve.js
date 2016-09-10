import serve from 'koa-static';
import compose from 'koa-compose';

export default paths => {
	let serves = [];
	let serveOptions = {};
	for( let i = 0, len = paths.length; i < len; i++ ) {
		console.log( paths[ i ] );
		serves.push( serve( paths[ i ], serveOptions ) );
	}
	return compose( serves );
};
