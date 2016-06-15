const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const debug = process.env.NODE_ENV !== 'production';
const rootPath = path.join(__dirname , 'src');
const PATHS = {
	html: '',
	css: 'assets/css/',
	js: 'assets/js/',
	files: 'assets/files/',
	fonts: 'assets/fonts/'
}

const plugins = glob.sync(path.join(rootPath , '*.jade')).map(p => new HtmlWebpackPlugin({
	filename: PATHS.html + path.basename(p , path.extname(p)) + '.html',
	template: p,
	inject: false,
	paths: PATHS
}));

plugins.unshift(  new BrowserSyncPlugin({
	host: 'localhost',
	port: 8080,
	files: 'build/assets/**/*',
	server: {
		baseDir: 'build',
		directory: true
	}
}, { reload: false }) )


const config = () => ({
	// context: rootPath,
	entry: {},
	output: {
		path: path.join(__dirname, 'build'),
		filename: PATHS.js + '[name].js',
		chunkFilename: PATHS.js + '[name]-[id].chunk.js',
		publicPath: '/',
	},
	resolve: {
		extensions: ['', '.js', '.scss', '.css', '.jade'],
		modulesDirectories: ['node_modules']
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loaders: [
					`file-loader?name=${PATHS.js}[name]${!debug ? '-[hash:6]' : ''}.js`,
					'babel-loader'
				],
				exclude: /(node_modules)/
			},
			{
				test: /\.jade$/,
				loader: 'jade-loader?pretty=true'
			},
			{
				test: /\.(css|scss|sass)$/,
				loaders: [
					`file-loader?name=${PATHS.css}[name]${!debug ? '-[hash:6]' : ''}.css`,
					'extract-loader',
					'css-loader',
					'postcss-loader',
					'sass-loader'
				]
			},
			{
				test: /\.(svg|eot|otf|woff2?|ttf)$/,
				loader: `file-loader?name=${PATHS.fonts}[name]-[hash:6].[ext]`
			},
			{
				test: /\.(ico|pdf|jpe?g|gif|png|mp4|webm)$/,
				loader: `file-loader?name=${PATHS.files}[name]-[hash:6].[ext]`
			},
		],
		noParse: /\.min\.js/
	},
	plugins: plugins,
	debug: debug,
});


module.exports = config();
module.exports.config = config;


console.log("++++++++++++++++++++++++++++++++++++++");
console.log("+++++++++++ WEBPACK CONFIG +++++++++++");
console.log("++++++++++++++++++++++++++++++++++++++");
console.dir( module.exports , {depth: 4, colors: true} );
console.log("++++++++++++++++++++++++++++++++++++++");
console.log("++++++++++++++++++++++++++++++++++++++\n");
