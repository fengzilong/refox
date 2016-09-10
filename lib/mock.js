import ensureArray from './utils/ensure-array';

export default mockOptions => {
	const syncProviders = ensureArray( mockOptions.sync );
	const asyncProviders = ensureArray( mockOptions.async );

	return function* ( next ) {
		const request = this.request;
		yield next;
	};
};
