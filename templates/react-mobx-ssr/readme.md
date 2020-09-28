# 项目说明



## 项目名称：test-app



本文档中统一使用 yarn 作为包管理器


## 集成的技术栈

- lerna
- eggjs
- reactjs
- mobx
- css-modules
- typescript
- ssr

## 特点
1. 可以基于当前项目持续集成模块与功能；
2. 允许 ssr 出错自动降级，使用客户端渲染；
3. 允许项目中存在部分页面使用同构，部分不使用同构；
4. 案例中的 mobx 同构，不需要使用 Provider 提供整体的数据树；


## 1.如何安装


### 1.1 项目初始化

在项目目录下运行如下命令

```
yarn
```

### 1.2 安装项目模块依赖

在项目目录下运行如下命令

```
yarn run boot
```

## 2.如何运行

### 2.1 开发环境

在项目目录下运行如下命令

```
yarn run dev
```

##### 开发服务默认访问端口：8080

##### 首次访问地址：[http://127.0.0.1:8080/test-app/test-app](http://127.0.0.1:8080/test-app/test-app)

### 2.2 生产发布

在项目目录下运行如下命令

```
yarn run build
yarn run start-server
```

##### 生产服务默认访问端口：7001

##### 首次访问地址：[http://127.0.0.1:7001/test-app/test-app](http://127.0.0.1:7001/test-app/test-app)



## 3.项目结构

项目结构如下：

```
├── appveyor.yml
├── lerna.json
├── modules
│   ├── client
│   ├── core
│   ├── public
|   ├── server-renderer
│   └── server
├── package.json
├── readme.md
└── yarn.lock
```

##### 解析

1、modules/client：前端代码，技术栈为 react + webpack + css-modules + flexible

2、modules/server：前端服务代码，采用 eggjs 作为框架；

3、modules/core：公共模块，提供公共模块给其他模块进行调用；

4、modules/public：打包输出目录，静态资源的输出目录；

5、lerna.json：对项目进行管理的 lerna 描述文件；

6、modules/server-renderer：用于服务端渲染；


## 4.备注

1、本项目采用 lerna 工具对整体项目进行管理，对项目的进一步扩展与开发，可先了解 lerna 工具；
