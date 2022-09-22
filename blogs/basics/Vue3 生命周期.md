---
title: Vue3 生命周期
date: 2022-04-14
categories:
 - 基础知识
tags:
 - Vue
sidebar: auto
---

Vue 3 生命周期一览

|选项式 API|Hook inside setup|
|-|-|
beforeCreate|Not needed*
created|Not needed*
beforeMount|onBeforeMount
mounted|onMounted
beforeUpdate|onBeforeUpdate
updated|onUpdated
beforeUnmount|onBeforeUnmount
unmounted|onUnmounted
errorCaptured|onErrorCaptured
renderTracked|onRenderTracked
renderTriggered|onRenderTriggered
activated|onActivated
deactivated|onDeactivated

- beforeCreate()、created() 的代码放入 setup() 中调用即可
- onMounted() 中可以进行 API 的调用
- onActivated()、onDeactivated() 使用 keep-alive 包裹的组件的打开和关闭时触发
- onErrorCaptured() 后代组件发生错误时触发
- onRenderTracked() VUE 3 中才能够使用，渲染期间首次跟踪依赖时触发，多用于调试
- onRenderTriggered() VUE 3 中才能够使用，触发新渲染时调用，多用于调试