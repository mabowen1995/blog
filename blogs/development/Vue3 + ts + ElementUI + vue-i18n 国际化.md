---
title: Vue3 + ts + ElementUI + vue-i18n 国际化
date: 2022-10-18
categories:
 - 项目开发
tags:
 - Vue
 - bug相关
 - 国际化
sidebar: auto
---

## 一、安装与配置

国际化分为两部分，一部分是页面文言国际化，一部分是组件文言国际化，其中页面文言国际化需要使用到插件 vue-i18n，组件文言国际化参考 ElementUI 的[指南](https://element-plus.gitee.io/zh-CN/guide/i18n.html)进行配置即可。

### vue-i18n

```sh
yarn add vue-i18n
```

在 src 下新建用来存储国际化文言的文件夹 locales 及国际化文件。

- src/locales/zh-cn.ts
- src/locales/en.ts
- src/locales/index.ts

```ts
// zh-cn.ts
export default {
  buttons: {
      login: '登录',
      submit: '提交',
      reset: '重置',
      next: '下一步',
      previous: '上一步',
      merge: '合并'
  }
}
```
```ts
// en.ts
export default {
  buttons: {
      login: 'Login',
      submit: 'Submit',
      reset: 'Reset',
      next: 'Next',
      previous: 'Previous',
      merge: 'Merge'
  },
}
```
```ts
// index.ts
import { createI18n } from 'vue-i18n'
import zhCn from './zh-cn'
import en from './en'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem('lang') || 'en',
  messages: {
    zhCn,
    en
  }
})

export default i18n
```
```ts
// main.ts 中添加 app.use(i18n)
import i18n from '@/locales'
app.use(i18n);
```

```html
<!-- template 中使用 -->
<template>
  <button>{{ $t('buttons.login') }}</button> // 登录 & Login
</template>
```
```ts
// ts 中使用
import i18n from './locales'
console.log(i18n.global.t('buttons.login'))
```

### ElementUI

参考 ElementUI 的指南需要在 app.vue 文件中将 router-view 标签用 el-config-provider 包裹起来。

```html
<!-- app.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import en from 'element-plus/lib/locale/lang/en';

// 这个地方要注意由于没好好看文档我以为 locale 的传参是字符串，导致产生了 bug
const locale = ref(localStorage.getItem('lang') === 'en' ? en : zhCn);
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>
```

### 切换语言

依旧是需要分别对 vue-i18n 和 ElementUI 分别操作来切换语言。

```ts
import i18n from '@/locales';

const handleCommand = (command: 'zhCn' | 'en') => {
  localStorage.setItem('lang', command);
  i18n.global.locale.value = command; // i18n 配置
}
```

ElementUI 我没有选择在 store 中处理，直接切换 localstorage 即可，但需要额外监听一下 localstorage 的改变来变更 el-config-provider 的 locale 参数。

```ts
// 导出一个方法改写 localStorage.setItem 用来添加监听
export default function dispatchEventStroage() {
  const signSetItem: any = localStorage.setItem
  localStorage.setItem = function (key, val) {
    let setEvent: any = new Event('setItemEvent')
    setEvent.key = key
    setEvent.newValue = val
    window.dispatchEvent(setEvent)
    signSetItem.apply(this, arguments)
  }
}
// 记得在 main.ts 中的 app.use(xxx) 里添加一下该方法注册成全局方法，此处省略
```

```ts
// app.vue 中添加事件监听来改变 el-config-provider 标签上 locale 的值即可
window.addEventListener('setItemEvent', (e: any) => {
  if (e.key === 'lang') {
    locale.value = e.newValue === 'en' ? en : zhCn;
  };
})
```

## 二、遇到的问题

### 问题一

> warning: [intlify] Detected HTML in 'xxx' message. Recommend not using HTML messages to avoid XSS.

说明文言中涉及到了<>符号，被误认为是 HTML 标签，两种解决方案：

- 修改为其他符号
- 添加如下配置

```ts
createI18n({
    warnHtmlInMessage: 'off' // disable of the Detected HTML in message
});
```

### 问题二

> warning: You are running the esm-bundler build of vue-i18n. It is recommended to configure your bundler to explicitly replace feature flag globals with boolean literals to get proper tree-shaking in the final bundle.

需要在 vite.config.ts 添加配置。

```ts
resolve: {
  alias: [
    {
      find: 'vue-i18n',
      replacement: resolve(__dirname, 'node_modules/vue-i18n/dist/vue-i18n.cjs.js') }
  ]
}
```

### 问题三

定义在 template 中的数据可以动态变更，但是定义在 ts 中的无法动态变更，需要使用到计算属性 computed。

```ts
const titleMap = computed(() => {
    return {
        'AdvancedAnalysisLoadData': i18n.global.t('tabs.loadData'),
        'AdvancedAnalysisProcessing': i18n.global.t('tabs.preprocessing'),
        'AdvancedAnalysisAnnotation': i18n.global.t('tabs.cluster'),
    }
})
```

```html
<el-tab-pane v-for="path in XXX"
    :label="titleMap[path.name]">
</el-tab-pane>
```