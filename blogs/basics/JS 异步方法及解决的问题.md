---
title: JS 异步方法及解决的问题
date: 2022-04-28
categories:
 - 基础知识
tags:
 - js
sidebar: auto
---

最近的一个区块链项目面试中被问到了 js 异步都有哪些，分别解决了什么问题。就知道一个 promise 解决回调地狱的我可谓是当场懵逼了，好家伙这也没背过啊，在此记录一下。

## 一、异步都有哪些方法

- 回调函数、事件监听、定时器
- Promise
- Web Workder
- async/await

## 二、解决了什么问题

### 回调函数、事件监听、定时器

执行一些需要等待的任务且不影响同步任务的进行。

### Promise

解决了复杂业务场景中回调函数累加之后产生的回调地狱等问题。

### Web Workder

由于 js 是单线程的，随着多核 CPU 的出现单线程无法充分使用计算机性能，因此可以使用 Web Workder 来开辟另一个线程，来分配一些任务给 Web Workder 来运行。

> [参考文章：Web Worker 使用教程](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)

### async/await

使得代码在形式上更接近于同步代码，非常的简洁。async/await 是非阻塞的，但类似 Promise.all 这样的并行方法 async/await 暂时是无法实现的。