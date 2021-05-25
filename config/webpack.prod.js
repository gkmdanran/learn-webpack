const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const isProduction = true;

module.exports = {
  mode: "production",
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,//使用多进程并发运行提高构建的速度，默认值是true，并发运行的默认数量： os.cpus().length - 1
        extractComments: true,   //默认值true，会将注释抽取到一个单独的文件中
        terserOptions: {
          compress: {           //设置压缩相关的选项
            arguments: false,
            dead_code: true
          },
          mangle: true,       //丑化相关的选项，可以直接设置为true
          toplevel: true,    //底层变量是否进行转换
          keep_classnames: true,  //keep_classnames：保留类的名称
          keep_fnames: true //keep_fnames：保留函数的名称
        }
      })
    ]
  },
  plugins: [
    // 生成环境
    new CleanWebpackPlugin(),   //打包时自动清除之前打包的内容
    new MiniCssExtractPlugin({    //将css提取到一个独立的css文件中
      filename: "css/[name].[hash:8].css"
    }),
    new CssMinimizerPlugin(),  //css压缩 去除无用的空格等
  ]
}