import babel from 'rollup-plugin-babel';

export default {
	dest: 'bundle.js',
	entry: 'src/index.js',
	plugins: [babel()],
	format: 'umd',
	moduleName: 'track-action-middleware'
};
