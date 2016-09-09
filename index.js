import koa from 'koa';
import loaders from './lib/loaders';

export default options => {
	const app = koa();
	app.use( loaders( options ) );

	const server = app.listen( options.port, () => {
		console.log( `listening on port: ${options.port}` );
	} );
};
