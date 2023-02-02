---
title: Vue3 代码规范之 Husky
date: 2023-02-02
categories:
  - 项目开发
tags:
  - 代码规范
  - Vue
sidebar: auto
---

建议先阅读 Eslint、Prettier 的配置文章。

以实际项目为例来配置一下 Husky 并记录遇到的问题，主要用来在提交代码至git仓库时自动校验代码所包含的规范，不需要每次提交前手动的执行一遍 eslint、prettier 这些。

## 一、安装与配置

### 安装

```sh
# 安装
yarn add husky -D
```

`package.json`中添加命令：

```json
{
    "scripts": {
        "prepare": "husky install"
    },
}
```

### 使用

执行以下命令生成相关配置文件，至于用 yarn 还是 npm 则根据自己的需求进行修改即可。

```sh
yarn prepare
yarn husky add .husky/pre-commit "yarn lint && yarn format"
```

执行完后根目录就会多出一个`.husky`文件夹，此时再进行`git commit`操作时就会自动执行校验，校验不通过的话就会抛出错误。