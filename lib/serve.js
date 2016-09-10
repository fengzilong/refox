import serve from 'koa-static';
import compose from 'koa-compose';

export default paths => {
	const serves = [];
	const serveOptions = {};
	for ( let i = 0, len = paths.length; i < len; i++ ) {
		serves.push( serve( paths[ i ], serveOptions ) );
	}
	return compose( serves );
};
