const path = require('path')
const HtmlwebpackPlugin = require('html-webpack-plugin')
const UglifyJsParallelPlugin = require('webpack-uglify-parallel')

module.exports = {
  entry: './app/pages/home/index.js',
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
      js: ['index.js'],
      template: 'index.html',
      filename: 'index.html',
      chunksSortMode: 'dependency'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
      output: {
        ascii_only: true,
      },
      compress: {
        warnings: false,
      },
      sourceMap: false
    })
  ],
};
