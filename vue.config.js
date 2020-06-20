module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    //entry  : './src/vueAutonumericTest.js',
    // output : {
    //     filename: './dist/bundle.js'
    // },
    resolve: {
       symlinks: false,
       alias: {
          AutoNumeric: 'autonumeric/dist/autoNumeric.min',
      },
    },
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[hash:8].js'
    }
  },
  outputDir: process.env.NODE_ENV === 'production'
    ? 'release-stc-admin/'
    : 'dev-stc-admin',
  transpileDependencies: [
    '@coreui/utils'
  ],
  productionSourceMap: process.env.NODE_ENV == 'production' ? false : true
}
