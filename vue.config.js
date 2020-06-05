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
  },
  transpileDependencies: [
    '@coreui/utils'
  ],
  
}
