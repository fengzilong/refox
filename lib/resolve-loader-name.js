export default loaderName => {
	return require.resolve( `refox-loader-${loaderName}` );
};
