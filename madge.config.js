module.exports = {
    fileExtensions: ['js', 'ts', 'vue'],
    excludeRegExp: ['node_modules', '\\.nuxt', '\\.output'],
    webpackConfig: {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      }
    }
  }
  