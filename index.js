import 'regenerator-runtime/runtime';
import app from './lib/app';
import io from './lib/socket';

export default ( options, cb ) => {
	const server = app( options );
	io.attach( server );
	server.listen( options.port, typeof cb === 'function' ? cb : () => {} );
};
