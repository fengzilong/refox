export default v => {
	if ( Array.isArray( v ) ) {
		return v;
	}

	return [ v ];
};
