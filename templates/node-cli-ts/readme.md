# Node cli TS

## 目的

帮助开发人员快速展开 基于 typescript 的 NodeJs cli，省去前期配置


## 功能

集成了以下配置：

1、vscode 运行配置文件；

2、typescript 配置文件；

3、jest 配置文件；


可以直接使用 typescript 立刻开始写 逻辑模块 和 单元测试（基于 jest）

在 vscode 上，提供了两个启动配置，分别是 运行应用（launch）和 运行单元测试（Jest Current File），可以让开发人员在 vscode 上实现快速调试


## 关于调试

可以使用 vscode 进行调试

每次执行 cli 命令，会自动保存命令的参数，打开 vscode 进行调试时，会自动使用上一次的 命令参数，无需手动配置参数

## How To Usei

```bash
yarn
yarn run dev    ## 开发
yarn run build  ## 输出生产包
yarn run test   ## 启动 jest 测试
yarn run grant  ## 授权当前 dist 运行权限
```

