import koa from 'koa';
import loaders from './lib/loaders';

const app = koa();

app.use( function* () {
	this.body = 'hello world!';
} );

app.use( loaders );

app.listen( 3000 );
