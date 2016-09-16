/* eslint no-unused-vars: "off" */

import { ensureArray } from './utils';
import provider from './provider';

export default mockOptions => function* ( next ) {
	yield provider.call( this, mockOptions ).call( this, next );
};
