const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const bundleAnalyzer = new BundleAnalyzerPlugin();

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
       symlinks: false,
       alias: {
          AutoNumeric: 'autonumeric/dist/autoNumeric.min',
      },
    },
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[hash:8].js'
    },
    plugins: [
      //bundleAnalyzer  // for analyzing build
    ]
  },
  outputDir: process.env.NODE_ENV === 'production'
    ? 'release-stc-admin/'
    : 'dev-stc-admin/',
  transpileDependencies: [
    '@coreui/utils'
  ],
  productionSourceMap: process.env.NODE_ENV == 'production' ? false : true,
  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');
    svgRule.uses.clear();
    svgRule
      .use('babel-loader')
      .loader('babel-loader')
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
}
