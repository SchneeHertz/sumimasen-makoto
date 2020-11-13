const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '对不起，真琴'
        return args
      })
  },
  devServer: {
    proxy: 'http://localhost:8097'
  },
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionPlugin()
    ]
  }
}