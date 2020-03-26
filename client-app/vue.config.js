const path = require('path');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  outputDir: path.resolve(__dirname, '../server/public'),
  configureWebpack: {
    plugins: [
      new MinifyPlugin()
    ]
  }
};
