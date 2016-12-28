import socketio from 'socket.io';
import watcher from './watch';

const io = socketio();
io.on( 'connection', () => {
	watcher.on( 'change', filepath => {
		console.log( 'filechanged', filepath );
		io.emit( 'filechanged', { filepath } );
	} );
} );

export default io;
