---
title: SPA中的hash和history
date: 2022-04-23
categories:
 - 项目开发
tags:
 - Vue
sidebar: auto
---

## 一、hash 和 history

SPA 即单页面应用，路由改变时不需要重新刷新整个浏览器标签页，为了满足这一需求就需要使用 hash 或 history 模式，目前 Vue、React、Angular 都支持这两种模式。


### hash
url 中会带有 # 号，# 号后的路由改变不会重新加载页面，但会记录在 window.hisotry 中，因此可以使用 history.back() 等方法，监听则通过 window.onhashchange() 方法。

### history
hisroty：利用 history.pushState() 和 history.replaceState() 方法，相比 hash 更加美观。

## 二、出现的问题

项目部署生产后，hash 模式能够正常使用，而 history 模式访问不到资源，反复检查路由配置确认没错后，检索到是 history 模式需要正确的 nginx 配置。

这一问题点上二者的区别是 hash 的改变不会发生请求，因此不影响服务器端，所以 nginx 不会拦截，而 history 模式则需要设置可访问的配置。

比如 http://www.ppdouble.com/home 如果不进行配置，那么 nginx 默认会去找服务器目录下的 home 文件，而我们想要的效果则是依旧寻找 index 文件，home 则交给前端去处理，使用 try_files 即可实现该效果。

```nginx
location / { 
 root /www/wwwroot; 
 index index.html; 
 try_files $uri $uri/ /index.html; 
}
```