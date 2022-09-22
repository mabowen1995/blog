---
title: 理解 Vue3 使用的 Proxy
date: 2022-04-15
categories:
 - 基础知识
tags:
 - Vue
sidebar: auto
---

在 vue3 中放弃了 Object.defineProperty 来进行数据劫持，而改用了 Proxy 替代原本的方案。

Object.defineProperty 的缺陷在于需要深度遍历并对每一个属性进行劫持，而对于没有属性的数组而言，数组的索引也可以视为被劫持的属性，但是和对象相同，对于新增的元素而言，不会触发监听事件，vue 对此的解决方案是劫持数组原型链上的函数，即便如此也仍旧无法监听对数组长度的修改。

而使用 Proxy 进行劫持则弥补了这些缺陷，阮一峰的[《ECMAScript6 入门》](https://es6.ruanyifeng.com/#docs/proxy)中对于 Proxy 是这样描述的：

> Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

相对于 Object.defineProperty 需要对每一个属性进行劫持，Proxy 则更加的便捷，只需要劫持需要监听的对象即可。

```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(target, propKey, value, receiver);
  }
});
obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2

// target 是需要被劫持的对象，handler 是劫持后定义的行为
var proxy = new Proxy(target, handler);
// 不过如果想要使得劫持起作用，必须要操作劫持后的对象（proxy）而不是原对象（target）
```

除了常用的 get/set 外，Proxy 可以定义13种拦截操作。并且 Proxy 还可以进行取消操作，可以通过 Proxy.revocable() 返回一个可取消的实例。

> Proxy.revocable()的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。

而针对如此万能的 Proxy 需要注意的问题是当一个对象被劫持后该对象的 this 指向将变为 Proxy 。