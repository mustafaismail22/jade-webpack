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

const plugins = glob.sync(path.join(rootPath , '*.pug')).map(p => new HtmlWebpackPlugin({
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
  entry: {
    main: path.join(rootPath, 'assets', 'js', 'main.js')
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: PATHS.js + `[name]${!debug ? '-[hash:6]' : ''}.js`,
    chunkFilename: PATHS.js + '[name]-[id]-[hash:6].chunk.js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(jade|pug)$/,
        loader: 'pug-loader?pretty=true'
      },
      {
        test: /\.(css|scss|sass)$/,
        use: [
          `file-loader?name=${PATHS.css}[name]${!debug ? '-[hash:6]' : ''}.css`,
          'extract-loader',
          'css-loader',
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
      }
    ],
    noParse: /\.min\.js/
  },
  plugins: plugins
  // debug: debug
});


module.exports = config();
// module.exports.config = config;


console.log("++++++++++++++++++++++++++++++++++++++");
console.log("+++++++++++ WEBPACK CONFIG +++++++++++");
console.log("++++++++++++++++++++++++++++++++++++++");
console.dir( module.exports , {depth: 3, colors: true} );
console.log("++++++++++++++++++++++++++++++++++++++");
console.log("++++++++++++++++++++++++++++++++++++++\n");
