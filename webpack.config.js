const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => {
  return {
    mode: env,
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      contentBase: './dist'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ // 打包输出HTML
        title: 'webgl-cargame',
        filename: 'index.html',
        template: './src/index.html'
      })
    ]
  }
}