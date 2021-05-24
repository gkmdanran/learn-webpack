const path = require('path')
const resolveApp = require("./path");
const { merge } = require("webpack-merge");
const prodConfig = require("./webpack.prod");
const devConfig = require("./webpack.dev");

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const commonConfig = {
    devtool: "source-map",      //使用source-map将打包后的文件映射生成原文件，方便调式和查看
    context:path.resolve(__dirname,"../"),    //默认是webpack启动目录，现在这样设置是跟目录下
    entry:  './src/main.js',  //入口 相对于context
    output: {
        filename: "bundle.js",
        path: resolveApp("./dist"),   //出口:需要绝对路径
        publicPath: "./"    //设置为"/"那么浏览器会根据所在的域名+路径去请求对应的资源,开发时设置为"./"以根据相对路径去查找资源(比如script引入js资源)
    },
    
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.ts', '.vue'],   //不写文件的扩展名，会在这个数组中匹配扩展名
        mainFiles: ['index'],    //不写文件夹名，会在这个数组中匹配文件夹名
        alias: {                                              //配置别名
            "@": resolveApp("./src"),
            "pages": resolveApp("./src/pages")
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",     //style-loader负责样式的插入
                    {
                        loader: "css-loader",   //css-loader负责css文件的解析
                        options: {
                            importLoaders: 1  //当在css文件中遇到@import导入时,再使用css-loader之前的1个loader:postcss-loader
                        }
                    },
                    "postcss-loader"  //需要安装postcss-preset-env或autoprefixer添加前缀插件,需要配置.browserslistrc和postcss.congif.js
                ]
            },
            {
                test: /\.less$/,
                use: [
                    "style-loader",     //style-loader负责样式的插入
                    {
                        loader: "css-loader",    //css-loader负责css文件的解析
                        options: {
                            importLoaders: 2 //当在css文件中遇到@import导入时,再使用css-loader之前的2个loader:先less-loader再postcss-loader
                        }
                    },
                    "postcss-loader",
                    "less-loader"     //less-loader负责less文件的解析，转为css文件 需要安装less和less-loader
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {

                        loader: 'url-loader',   //也可以使用file-loader，url-loader会将小于limit的文件转base64
                        options: {
                            name: "img/[name].[hash:6].[ext]",   //打包后图片路径以及文件名
                            limit: 50 * 1024                 //50kb
                        },
                    }
                ]
            },
            {
                test: /\.jsx?$/,   //匹配js或者jsx
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",    //需要安装@babel/core和@babel/preset-env预设插件
                    loader: 'eslint-loader'   //需要安装eslint并使用npx eslint --init生成配置文件
                }
            },
            {
                test: /\.ts$/,      //安装ts-loader 并使用tsc --init生成tsconfig
                exclude: /node_modules/,
                //use: "ts-loader"           //也可以使用babel-loader结合@babel/preset-typescript，ts-loader方式只能将ts转为js，但不能在添加现polyfill
                use: "babel-loader"   //babel-loader不会对类型错误进行检测；
            },
            {
                test: /\.vue$/,
                use: "vue-loader"  //加载vue文件默认会热更新
            }
        ],
    },
    plugins: [
        
        new HtmlWebpackPlugin({
            title: '测试',      //html文件的title
            template: "./index.html"   //html模板的路径
        }),
        new DefinePlugin({          //定义一些全局变量供HTML模板使用，例如 MY_BASE_URL,必须是字符串
            MY_BASE_URL: "'/22222'"
        }),
        new CopyWebpackPlugin({    //将文件复制到打包后的文件夹下
            patterns: [
                {
                    from: "./src/public",   //复制的目标文件
                    to: "public",            //复制到打包文件加下的public2文件夹
                    globOptions: {
                        ignore: [
                            "**/abc.txt"      //不复制abc.txt
                        ]
                    }
                }
            ]
        }),
        new VueLoaderPlugin(),  //加载vue文件
        
    ]
}
module.exports = function(env) {
    console.log(env)
    const isProduction = env.production;
    process.env.NODE_ENV = isProduction ? "production": "development";
  
    const config = isProduction ? prodConfig : devConfig;
    const mergeConfig = merge(commonConfig, config);
  
    return mergeConfig;
  };
  