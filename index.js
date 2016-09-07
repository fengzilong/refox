import koa from 'koa';
import loaders from './lib/loaders';

export default options => {
	const app = koa();
	app.use( loaders( options ) );
	console.log( options.port );
	app.listen( options.port );
}
