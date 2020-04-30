const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: path.resolve(__dirname, '../dist/public'),
  configureWebpack: {
    plugins: [
      new TerserPlugin()
    ]
  }
}
