module.exports = {
	extends: 'airbnb',
	rules: {
		'linebreak-style': 'off',
		'indent': ['error', 'tab'],
		'max-len': 'warn',
		'func-names': 'off',
		'vars-on-top': 'off',
		'one-var': 'off',
		'space-in-parens': ["error", "always"],
		// es6
		'require-yield': 'warn',
	},
	env: {
		node: true,
		es6: true
	},
	globals: {
		
	}
};
