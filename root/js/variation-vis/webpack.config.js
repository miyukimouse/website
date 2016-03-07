var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/main.jsx'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/static/',
    // export itself to a global var
    libraryTarget: "var",
    // name of the global var
    library: "VariationVis"
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'src')
      }
    ]
  },
  plugins: [
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
    port: 9004,
    publicPath: '/static',
    // proxy: {
    //   '/api/*': {
    //     target: 'http://amigo-dev-golr.berkeleybop.org',
    //     rewrite: function(req) {
    //       req.url = req.url.replace(/^\/api/, '');
    //     },
    //     secure: false,
    //   },
    // },
  }
}
