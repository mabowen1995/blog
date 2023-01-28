---
title: Vue3 内置组件 Transition
date: 2023-01-28
categories:
 - 项目开发
tags:
 - Vue
 - 性能优化
sidebar: auto
---

业务系统的开发中对于过渡和动画的效果要求一般没那么复杂，此文展示`<Transition>`组件的简单用法。

由于业务需要自己手写一个类似于`<el-drawer>`的显示隐藏过渡效果，于是参阅 Element Plus 的源码看到了`<Transition>`组件的使用。较为常规的就是用该组件包裹一个带有`v-if`或`v-show`属性的元素，来对该元素的显示隐藏加上过渡效果。

## 如何使用？

在 Vue3 中该组件无需注册直接使用即可，可以根据需要定义一个`name`，若不定义`name`默认值为`"v"`。

``` html
<Transition name="test">
  <!-- 仅支持单个元素或组件作为插槽内容。如果内容是一个组件，这个组件必须仅有一个根元素 -->
  <p v-if="show">hello</p>
</Transition>
```

``` css
/* 生成的class格式就是定义的name属性的值加上后缀 */
.test-enter-active,
.test-leave-active {
  transition: opacity 0.5s ease;
}

.test-enter-from,
.test-leave-to {
  opacity: 0;
}
```

## class 是做什么的？

一个`<Transition>`组件会生成6个 class，这6个 class 就可以理解为元素的生命周期，分别是：

- 元素进入前 .test-enter-from
- 元素进入中 .test-enter-active
- 元素进入后 .test-enter-to
- 元素离开前 .test-leave-from
- 元素离开中 .test-leave-active
- 元素离开后 .test-leave-to

如果元素的`v-show`属性的值从`false`变为`true`，那就意味着这个元素完整执行了前进入前、进入中、进入后三个周期，反之则是后三个周期，因此对这些周期对应的 class 添加样式就可以达到想要实现的效果。

## 添加样式

现在想要实现以下效果：

- 过渡 0.5 秒
- 由浅入深
- 水平划入

``` less
.test {
  &-enter-active,
  &-leave-active {
    transition: all 0.5s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
  }

  &-enter-from,
  &-leave-to {
    transform: translateX(100%);
  }
}
```

以上就可以实现简易的 drawer 组件过渡效果，更多高级用法参考官网。