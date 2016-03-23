var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'eval',
  entry: [
    './src/main.js'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/',
    // export itself to a global var
    libraryTarget: "var",
    // name of the global var
    library: "LegoPlot"
  },
  externals: {
    // require("jquery") is external and available
    //  on the global var jQuery
    "jquery": "jQuery"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      // Extract css files
      {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      // Optionally extract less files
      // or any other compile-to-css language
      {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      { test: /\.(woff|woff2)$/,  loader: "url-loader?limit=10000&mimetype=application/font-woff" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/ringo\/httpclient$/)
  ],
  // resolve: {
  //   root: path.resolve(__dirname),
  //   alias: {
  //     ringo: 'ringojs-0.11.0/modules/ringo'
  //   },
  //   extentions: ['', '.js']
  // },
  devServer: {
    contentBase: './',
    historyApiFallback: true,
    host: '0.0.0.0',
    hot: true,
    port: process.env.DEV_PORT,
    publicPath: '/static',
    proxy: {
      '/api/*': {
        target: 'http://amigo-dev-golr.berkeleybop.org',
        rewrite: function(req) {
          req.url = req.url.replace(/^\/api/, '');
        },
        // toProxy: true,
        // autoRewrite: true,
        changeOrigin: true, // changes the origin of the host header to the target URL,
                            // otherwise an Nginx landing page is the response somehow...
        secure: false,
      },
    },
  }
}
