const path = require('path');
const faviconsPlugin = require('favicons-webpack-plugin');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  outputDir: path.resolve(__dirname, '../server/public'),
  configureWebpack: {
    plugins: [
      new faviconsPlugin('./src/assets/favicon.png')
    ]
  }
};
