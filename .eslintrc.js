module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "windows"],
		"quotes": ["error", "double"],
		"semi": ["error", "never"],
		"brace-style": ["error", "stroustrup"],
		"space-before-function-paren": ["error", "never"],
		"object-curly-spacing": ["error", "never"]
	},
}
