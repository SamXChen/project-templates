# [project template] react-vite

<br/>

## 配置信息
- project-name: template-vite
- port: 默认 3002
- cdn: 默认为空
- 配置文件路径：packages/common-config/index.js

<br/>
<br/>

## 已经整合的技术栈
- koa
- art-template
- react
- vite
- typescript

<br/>
<br/>

## 对比使用了 webpack 的项目，有以下优势
- 开发环境下，能够一秒启动，无须等待 bundle
- 开发环境下，无须额外的构建，即可使用 ssr
- 无须 dev-server，开发环境 和 生产环境，可以使用同一个端口号

<br/>
<br/>

## 和 vite 提供的 template 有什么不一样？
- node 服务可以动态渲染输出不同的 html 内容
- 让 vite 支持 art-template 输出，同时支持子模板折叠的功能
- art-template 的子模板也能使用相对路径引入资源
- 整合好 ssr 渲染方案，直接在配置文件声明入口即可开启 ssr
- 开发环境下的 react ssr 渲染，实现了样式收集，可以在打开页面时 preload style，保证开发环境 和 生产环境下的 ssr 有相同的体验

<br/>
<br/>

# 如何开始

### development

```bash
yarn dev
```
浏览器访问：http://localhost:3002/serve/page-a

### build production

```bash
yarn build:client
```

### serve production
```bash
yarn start:server
```