import koa from 'koa';
import loaders from './lib/loaders';

// TODO: delete
import options from './test/loader.config';

const app = koa();

app.use( loaders( options ) );

console.log( options.port );

app.listen( 3000 );
