# wecircle

高仿慕课网的[从0到1 实战朋友圈移动Web App开发](https://www.imooc.com/read/42)，可以发朋友圈、私信、点赞、评论、查看图片等。。。

<figure>
    <a href="https://img.shields.io/circleci/project/github/xuzpeng/fiona-ui/master.svg"><img src="https://img.shields.io/circleci/project/github/xuzpeng/fiona-ui/master.svg"></a>
    <a href="https://circleci.com/gh/xuzpeng/fiona-ui/tree/master"><img src="https://circleci.com/gh/xuzpeng/fiona-ui/tree/master.svg?style=svg"></a>
    <a href="https://img.shields.io/github/languages/count/xuzpeng/fiona-ui.svg"><img src="https://img.shields.io/github/languages/count/xuzpeng/fiona-ui.svg"></a>
    <a href="https://img.shields.io/npm/l/fiona-ui.svg"><img src="https://img.shields.io/npm/l/fiona-ui.svg"></a>
</figure>

> `wecircle` 前台基于 `react hooks` 、`typescript` 和 [redell-ui](https://github.com/GongJS/React-UI)(自己写的第三方`react`组件库)开发; 后台基于 `egg` 和 `typescript`开发。

[在线地址](http://101.132.117.183:8850)

> 想获得最好的体验效果，请在chrome浏览器里切换到手机模式登录

## 配置

### 前台
前台需配置代理地址，在`app/config/webpackDevServer.config.js`里修改proxy内容

### 后台
后台需配置的地方在`server/config/config.default.ts`文件里，包括`阿里云短信服务`、`mongodb`、`redis`; 所有`xxxxxx`的地方都需要根据自己都开发环境进行配置。

## 启动

### 客户端
```shell
cd app
yarn
yarn start
```
### 服务端

```shell
cd server
yarn
yarn dev
```

## PR [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

欢迎所有的贡献, 也欢迎提出建议, 有bug或者未来开发功能，请在 issues 里面提.


