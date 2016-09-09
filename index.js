import koa from 'koa';
import loader from './lib/loader';
import mock from './lib/mock';
import serve from './lib/serve';

export default options => {
	const app = koa();

	// middlewares
	app.use( loader( options ) );
	app.use( mock( options.mock ) );
	app.use( serve( options.static ) );

	const server = app.listen( options.port, () => {
		console.log( `listening on port: ${options.port}` );
	} );
};
