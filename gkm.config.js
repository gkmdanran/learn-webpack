const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
module.exports = {
    mode: "development",
    devtool: "source-map",      //使用source-map将打包后的文件映射生成原文件，方便调式和查看
    entry: path.resolve(__dirname, './src/main.js'),  //入口
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, './dist'),   //出口:需要绝对路径
        publicPath: "./"    //设置为"/"那么浏览器会根据所在的域名+路径去请求对应的资源,开发时设置为"./"以根据相对路径去查找资源(比如script引入js资源)
    },
    devServer: {     //安装webpack-dev-server热更新
        hot: true,
        publicPath: "/",   //默认是/ 如果设为/abc,浏览器必须输入http://localhost:7777/abc才能看到页面，
        //而加载的打包后路径也变成http://localhost:7777/abc/bundle.js，因此output.publicPath也应该/abc
        hotOnly: true,     //代码编译失败，不会刷新整个页面
        host: "localhost",  //主机地址
        port: 7777,   //端口
        open: true,  //自动打开浏览器
        compress: true, //静态文件开启gzip compression
        proxy: {
            // "/why": "http://localhost:8888"
            "/why": {
                target: "http://localhost:8888",
                pathRewrite: {
                    "^/why": ""
                },
                secure: false,  //不转发到https服务器上
                changeOrigin: true //修改host 将localhost:7777改为localhost:8888
            }
        },
        // historyApiFallback: true  // //解决SPA页面在路由跳转之后，进行页面刷新时，返回404的错误，会自动返回 index.html
        historyApiFallback: {
            rewrites: [
                { from: /abc/, to: "/index.html" }   //可以配置from来匹配路径，决定要跳转到哪一个页面
            ]
        }
    },
    resolve: {
        extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx', '.ts', '.vue'],   //不写文件的扩展名，会在这个数组中匹配扩展名
        mainFiles:['index'],    //不写文件夹名，会在这个数组中匹配文件夹名
        alias: {                                              //配置别名
          "@": path.resolve(__dirname, "./src"),       
          "pages": path.resolve(__dirname, "./src/pages")
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
        new CleanWebpackPlugin(),   //打包时自动清除之前打包的内容
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
        // new ReactRefreshWebpackPlugin() //react热更新
    ]
}