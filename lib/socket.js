import socketio from 'socket.io';

const io = socketio();
io.on( 'connection', () => {
	console.log( 'connected' );
	io.emit('an event', { some: 'data' });
} );

export default io;
