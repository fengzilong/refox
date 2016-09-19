import socketio from 'socket.io';
import watcher from './watch';

const io = socketio();
io.on( 'connection', () => {
	console.log( 'connected' );

	watcher.on( 'change', function( filepath, mtime ) {
		console.log( 'changed', filepath );
		io.emit('filechanged', { filepath: filepath });
	} );
} );

export default io;
