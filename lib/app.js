import koa from 'koa';
import http from 'http';
import loader from './middlewares/loader';
import mock from './middlewares/mock';
import serve from './middlewares/serve';
import logger from './middlewares/logger';

export default options => {
	const app = koa();

	// middlewares
	app.use( logger() );
	app.use( serve( options.static ) );
	app.use( mock( options.mock ) );
	app.use( loader( options ) );

	return http.createServer( app.callback() );
};
