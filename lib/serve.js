import serve from 'koa-static';
import compose from 'koa-compose';

export default paths => {
	const serves = [];
	paths.forEach( v => {
		serves.push( serve( v, {
			gzip: false,
		} ) );
	} );
	return compose( serves );
};
