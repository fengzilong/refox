<p align="center">
	<img src="https://ooo.0o0.ooo/2016/09/09/57d2d4c79112f.png" alt="refox" width="190px">

	<br /><br />Lightweight mock server on top of <a href="https://github.com/koajs/koa">koa</a>
</p>

<p align="center">
	<a href="https://www.npmjs.org/package/refox"><img src="https://img.shields.io/npm/v/refox.svg?style=flat-square" alt="npm"></a>
	<a href="https://circleci.com/gh/fengzilong/refox"><img src="https://img.shields.io/circleci/project/fengzilong/refox/master.svg?style=flat-square" alt="build"></a>
	<a href="https://david-dm.org/fengzilong/refox"><img src="https://img.shields.io/david/fengzilong/refox.svg?style=flat-square" alt="David"></a>
	<a href="https://github.com/fengzilong/refox/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-000000.svg?style=flat-square" alt="license"></a>
</p>

## Installation

[![Join the chat at https://gitter.im/fengzilong/refox](https://badges.gitter.im/fengzilong/refox.svg)](https://gitter.im/fengzilong/refox?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

```bash
$ npm i refox -g
```

## Usage

**Step 1:** create config file in your project root

`refox.config.js`

```js
const path = require( 'path' );
const cwd = process.cwd();

module.exports = {
	port: 5000,
	verbose: true,
	debug: true,
	mock: {
		sync: {
			test: function( url, req ) {
				if( /sync/.test( url ) ) {
					return true;
				}
			},
			resolve: function( url, req ) {
				// sync return
				return '{ "foo": "bar" }';
			}
		},
		async: {
			test: function( url, req ) {
				if( /async/.test( url ) ) {
					return true
				}
			},
			resolve: function( url, req ) {
				// or async callback
				var cb = this.async();
				setTimeout(function() {
					cb( '123' );
				}, 1000);
			}
		},
	},
	compile: [
		{
			test: function( url, req ) {
				if( /sync/.test( url ) ) {
					return true;
				}
			},
			loaders: [
				'pug?root=' + path.resolve( cwd, 'test/fixtures/views' )
			],
			// find your local file
			local: function( url, req ) {
				return path.resolve( cwd, 'test/fixtures/views/test.pug' );
			}
		}
	],
	static: [
		'lib'
	]
}
```

**Step 2:** run `refox`

```bash
$ refox
```

you can also specify config file by using

```bash
$ refox -c file.config.js
```

## License

MIT &copy; [fengzilong](https://github.com/fengzilong)

[build-image]: https://img.shields.io/circleci/project/fengzilong/refox/master.svg?style=flat-square
[build-url]: https://circleci.com/gh/fengzilong/refox

[dependency-image]: https://img.shields.io/david/fengzilong/refox.svg?style=flat-square
[dependency-url]: https://david-dm.org/fengzilong/refox

[version-image]: https://img.shields.io/npm/v/refox.svg?style=flat-square
[version-url]: https://www.npmjs.org/package/refox

[download-image]: https://img.shields.io/npm/dt/refox.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/refox

[license-image]: https://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]: https://github.com/fengzilong/refox/blob/master/LICENSE
