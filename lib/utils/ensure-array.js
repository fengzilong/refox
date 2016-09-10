const ensureArray = v => {
	if( Array.isArray( v ) ) {
		return v;
	}

	return [ v ];
};

export default ensureArray;
