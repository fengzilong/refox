const loaders = function* ( next ) {
	yield next;
	this.body = 'hello world again!';
};

export default loaders;
