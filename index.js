import koa from 'koa';
import loaders from './lib/loaders';

export default options => {
	const app = koa();
	app.use( loaders( options ) );
	console.log( options.port, typeof options.port );
	const server = app.listen( options.port, () => {
		console.log( `listening on port: ${options.port}` );
		console.log( server );
	} );
};
