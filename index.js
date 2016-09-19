import 'regenerator-runtime/runtime';
import app from './lib/app';
import io from './lib/socket';
import watcher from './lib/watch';
import path from 'path';

const cwd = process.cwd();

export default ( options, cb ) => {
	// maybe also watch path from options
	watcher.watch( [], [ cwd ], Date.now() );
	const server = app( options );
	io.attach( server );
	server.listen( options.port, typeof cb === 'function' ? cb : () => {} );
};
