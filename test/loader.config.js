const path = require( 'path' );

const cwd = process.cwd();

// 进行更深层次的抽象，不直接支持proxy，自行通过mock中的resolve处理(例如：假如NODE_ENV是REMOTE，则取remote数据，proxy配置不放在refox配置上)

module.exports = {
	port: 6000,
	// 这里是mock数据
	// 需要代理的也只有这两处，而且同步数据源和异步数据源本质上是一样的
	// 所以单独抽离出来，loader只负责编译or修改内容，无需去管数据的来源
	// sync和async在middleware中优先级高于loaders
	mock: {
		// 同步渲染数据源提供者
		// provider中的逻辑是如何根据template url取到对应的data
		sync: {
			test: /template-url/, // or function
			resolve: function( url, req ) {
				// 可在这里做同步数据的代理，或者查找本地routeMap
			}
		},
		async: {
			test: /ajax/, // or function
			resolve: function() {
				// 可在这里做同步数据的代理，或者查找本地routeMap
			}
		},
	},
	// 类似拦截器，但这里不负责mock数据的输出，只是响应请求，动态编译源码或者进行一些修改(比如注入一个脚本)
	// 需要注意的是，如果匹配到compile中的某一项，那么后面的compile就不会再处理了
	compile: [
		{
			test: function( url, req ) {
				if( /xxx/.test( url ) ) {
					return true;
				}

				if( /yyy/.test( url ) ) {
					return true;
				}
			},
			loaders: [
				'pug?root=' + path.resolve( cwd, 'test/fixtures/views' )
			],
			// 查找本地路径的规则，返回的路径会进行读取，然后pipe进loaders中进行处理
			local: function( url, req ) {
				return path.resolve( cwd, 'test/fixtures/views/test.pug' );
			},
			// 有些内容可能没有独立文件，和其他东西是写在一个文件里面的，可以通过content进行读取，然后返回内容，当时是因为sync和async数据可能写在一个文件，现在sync和async抽离出去，这里基本不会用到了
			// content: function( url, req ) {
			// 	return false;
			// }
		}
	],
	// static的优先级是最低的
	static: [

	],
};
