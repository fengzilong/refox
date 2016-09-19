import koa from 'koa';
import http from 'http';
import loader from './loader';
import mock from './mock';
import serve from './serve';
import logger from './logger';

export default options => {
	const app = koa();

	// middlewares
	app.use( logger() );
	app.use( mock( options.mock ) );
	app.use( loader( options ) );
	app.use( serve( options.static ) );

	return http.createServer( app.callback() );
};
