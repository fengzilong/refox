import Watchpack from 'watchpack';

const w = new Watchpack( {
	aggregateTimeout: 1000,
	poll: true,
	ignored: /node_modules/,
} );

export default w;
