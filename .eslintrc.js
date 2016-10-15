module.exports = {
	extends: 'airbnb-base',
	rules: {
		'linebreak-style': 'off',
		'indent': [ 'error', 'tab' ],
		'max-len': 'warn',
		'func-names': 'off',
		'vars-on-top': 'off',
		'one-var': 'off',
		'space-in-parens': [ 'error', 'always' ],
		'computed-property-spacing': [ 'error', 'always' ],
		'array-bracket-spacing': [ 'error', 'always' ],
		'no-tabs': 'off',
		'no-plusplus': 'off',
		'arrow-parens': [ 'error', 'as-needed' ],
		'import/no-dynamic-require': 'off',
	},
	env: {
		node: true,
		es6: true
	},
	globals: {

	}
};
