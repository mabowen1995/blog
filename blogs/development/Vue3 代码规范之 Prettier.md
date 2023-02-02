---
title: Vue3 代码规范之 Prettier
date: 2023-02-02
categories:
  - 项目开发
tags:
  - 代码规范
  - Vue
sidebar: auto
---

以实际项目为例来配置一下 Prettier 并记录遇到的问题。

## 一、安装与配置

### 安装

```sh
# 安装
yarn add prettier -D
```

根目录下新建配置文件`.prettierrc.js`，并添加相关配置：

```js
module.exports = {
  // 一行的字符数，如果超过会进行换行，默认为80
  printWidth: 80,
  // 一个tab代表几个空格数，默认为80
  tabWidth: 2,
  // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  useTabs: false,
  // 字符串是否使用单引号，默认为false，使用双引号
  singleQuote: true,
  // 行位是否使用分号，默认为true
  semi: false,
  // 是否使用尾逗号，有三个可选值"<none|es5|all>"
  trailingComma: "none",
  // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  bracketSpacing: true,
};
```

同时考虑需要忽略的文件夹，根目录下新建文件`.prettierignore`，添加需要忽略的文件即可：
```
/xxx
```

`package.json`添加命令：

```json
{
  "scripts": {
    "format": "prettier --write \"./**/*.{html,vue,ts,js,json,md}\""
  }
}
```

运行代码格式化命令：

```sh
yarn format
```

## 二、插件安装

vscode 中搜索并安装 Prettier - Code formatter 插件，然后在 vscode 的`settings.json`添加以下配置就可以实现对应文件保存时自动格式化代码了。

```json
// settings.json
{
  "[vue]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
