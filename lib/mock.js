/* eslint no-unused-vars: "off" */

import { ensureArray } from './utils';
import provider from './provider';

export default mockOptions => function* ( next ) {
	return provider.call( this, mockOptions )( next );
};
