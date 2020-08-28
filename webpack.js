module.exports = {
  mode: 'development',
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  devServer: {
    historyApiFallback: true, /* support for react-router  */
    contentBase: '/',
      proxy:{
          '/api':{
             logLevel:'debug',
             secure: false,
             changeOrigin:true,
             target:'http://example:8000',
             pathRewrite:{'^/api/reply':'/api/web'}
          }
      }
  },
}
