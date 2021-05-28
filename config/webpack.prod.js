const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');

const resolveApp = require('./path');
const isProduction = true;
module.exports = {
  mode: "production",
  optimization: {
    usedExports: true, // 无用代码做标记unused harmony export mul，结合Terser（minimize设true）使用  package.json配置"sideEffects"
    minimize: true,
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
    
    new PurgeCssPlugin({  //purgecss也可以对less文件进行处理
      paths: glob.sync(`${resolveApp("./src")}/**/*`, {nodir: true}),     //表示要检测哪些目录下的内容需要被分析，这里我们可以使用glob；不是目录
      safelist: function() {
        return {
          standard: ["body", "html"]    //默认情况下，Purgecss会将我们的html标签的样式移除掉，如果我们希望保留，可以添加一个safelist的属性；
        }
      }
    }),
    new CompressionPlugin({
      test: /\.(css|js)$/i,   //匹配哪些文件需要压缩
      threshold: 0,     //设置文件从多大开始压缩
      minRatio: 0.8,    //至少的压缩比例
      algorithm: "gzip",   //采用的压缩算法
      // exclude  
      // include
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime.*\.js/,])
    //可以辅助将一些chunk出来的模块，内联到html中：
    //比如runtime的代码，代码量不大，但是是必须加载的；
    //那么我们可以直接内联到html中
  ]
}