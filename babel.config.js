const presets=[
    ["@babel/preset-env", {
        // false: 不用任何的polyfill相关的代码
        // usage: 代码中需要哪些polyfill, 就引用相关的api。但如果依赖的某一个库本身使用了某些polyfill的特性，可能会报错
        // entry: 手动在入口文件中导入 core-js/regenerator-runtime, 根据目标浏览器browserslistrc引入所有对应的polyfill
        useBuiltIns: "entry",
        corejs: 3       //安装core-js和regenerator-runtime
    }],
    ["@babel/preset-react"],   //安装@babel/preset-react预设来支持react的jsx
    ["@babel/preset-typescript"]  //解析ts文件使用babel-loader时使用
]
const plugins = [
    ["@babel/plugin-transform-runtime",{    //polyfill特性是全局的，开发工具库时为了避免polyfill污染用户的代码，使用该插件。
        corejs:3                 //需要安装@babel/runtime-corejs3
    }],
    
]
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
    plugins.push(
        ["react-refresh/babel"] //react热更新
    );
  } else {
  
  }
module.exports = {
    presets, 
    plugins,

}