import babel from 'rollup-plugin-babel';

export default {
	dest: 'bundle.js',
	entry: 'src/index.js',
	plugins: [babel({
		babelrc: false,
		presets: ["es2015-rollup", "stage-1"],
		plugins: ["transform-flow-strip-types"]
	})],
	format: 'umd',
	moduleName: 'trackActionMiddleware'
};
