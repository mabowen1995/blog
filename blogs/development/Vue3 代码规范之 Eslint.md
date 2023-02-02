---
title: Vue3 代码规范之 Eslint
date: 2023-02-02
categories:
  - 项目开发
tags:
  - 代码规范
  - Vue
sidebar: auto
---

以实际项目为例来配置一下 Eslint 并记录遇到的问题。

## 一、安装与配置

### 安装

先从现有的项目开发分支 develop 上切出一个分支 230202-eslint 来进行本次的 eslint 安装及配置工作。

```sh
# 安装
yarn add eslint -D
# 初始化
yarn eslint --init
```

### 配置

```
按需选择自己项目的配置，自己的项目选择了以下配置

√ How would you like to use ESLint? · problems

√ What type of modules does your project use? · esm

√ Which framework does your project use? · vue

√ Does your project use TypeScript? · Yes

√ Where does your code run? · browser

√ What format do you want your config file to be in? · JavaScript
```

之后会在根目录下生成一个`.eslintrc.js`文件存放 eslint 的配置和规则。这时会有一个`'module' is not defined.`的报错，需要新增如下配置：

```js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // 新增该行
  },
  // 其他配置项省略
};
```

由于我的项目打包编译输出了指定的文件夹，因此还配置一下需要进行忽略的文件夹，防止对打包后的文件夹执行校验。

```js
module.exports = {
  ignorePatterns: ["stereominer/*"], // 忽略 stereominer 文件夹
  // 其他配置项省略
};
```

然后去`package.json`中添加命令：

```json
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix"
  }
}
```

## 二、运行及问题修复

```sh
yarn lint
```

运行后所有的 vue 文件会出现一个`Parsing error: '>' expected`的解析错误，需要再次修改`.eslintec.js`中的 parser 和 parserOptions 这两个配置，修改后：

```js
module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  // 其他配置项省略
};
```

```
# 再次运行 yarn lint 后就可以看到项目的问题
✖ 51 problems (24 errors, 27 warnings)
```

对于某些难以规避的问题可以自定义 eslint 的规则来进行处理，包含：

1、Forbidden non-null assertion

我的项目中引起该问题的原因是因为使用了`project.value!`非空断言导致的。

2、Unexpected any. Specify a different type

有些时候不得不使用`any`类型。

3、Component name "xxx" should always be multi-word

vue的组件命名必须要两个单词驼峰或者连线，但很多时候只会有一个单词命名。

4、'xxx' is assigned a value but never used

有些在 template 中使用的变量也会报这个错。

5、'defineProps' is not defined.

使用了 vue3 setup 会有这个问题。 

针对以上5个问题权衡了一下选择了修改 eslint 规则来适配，而剩下的问题则需要进行代码修改。

最后的`.eslintec.js`文件完整配置如下：

``` js
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    'vue/setup-compiler-macros': true // 问题5
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/multi-word-component-names': 'off', // 问题3
    '@typescript-eslint/no-non-null-assertion': 'off', // 问题1
    '@typescript-eslint/no-unused-vars': 'off', // 问题4
    '@typescript-eslint/no-explicit-any': 'off' // 问题2
  },
  ignorePatterns: ['stereominer/*']
}

```

## 三、插件安装

vscode 通过安装 eslint 插件就可以在编辑代码的过程中实时的显示校验问题，不需要最后打包编译的时候再修改。