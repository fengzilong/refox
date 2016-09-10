import logger from 'koa-logger';

export default ( options ) => {
	return logger( options || {} );
};
