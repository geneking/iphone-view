const webpack = require('webpack')
const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

module.exports = {
  entry: './app/index.js',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.html$/, loader: 'html-loader?minimize=false' },
      { test: /\.(?:jpg|gif|png)$/, loader: 'url-loader' }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    filename: 'bundle.js'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new HtmlwebpackPlugin({
      js: ['app/pages/home/index.js'],
      template: 'index.html',
      filename: 'index.html',
      chunksSortMode: 'dependency'
    }),
    new OpenBrowserPlugin({
      url: 'http://127.0.0.1:8808/'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    inline: true,
    host: process.env.HOST,
    port: '8808',
    proxy: {
    }
  }
};
