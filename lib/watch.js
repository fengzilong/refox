import Watchpack from 'watchpack';

export default new Watchpack( {
	aggregateTimeout: 1000,
	poll: true,
	ignored: /node_modules/,
} );
