import babel from '@rollup/plugin-babel';

export default {
	output: {
		dir: 'dist',
		format: 'umd'
	},
	input: 'src/index.js',
	plugins: [babel({ babelHelpers: 'bundled' })],
	moduleName: 'trackActionMiddleware'
};
