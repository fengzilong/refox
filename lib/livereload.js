/* eslint-disable */

import getPort from 'get-port';

export default () => function* livereload( next ) {
	yield next;
	console.log( 'this.response.type', this.response.type );
}
