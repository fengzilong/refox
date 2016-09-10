/* eslint no-unused-vars: "off" */

import { ensureArray } from './utils';
import syncProvider from './provider/sync';
import asyncProvider from './provider/async';

export default mockOptions => function* ( next ) {
	yield syncProvider.call( this, ensureArray( mockOptions.sync ) );
	yield asyncProvider.call( this, ensureArray( mockOptions.async ) );
	yield next;
};
