const resolveApp = require('./path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack=require('webpack')
const isProduction = false;

console.log("加载devConfig配置文件");

module.exports = {
    mode: "development",
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
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),   //功能是对作用域进行提升，并且让webpack打包后的代码更小、运行更快；
        // 开发环境
        // new ReactRefreshWebpackPlugin() //react热更新
    ]
}