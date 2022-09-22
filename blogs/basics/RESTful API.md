---
title: RESTful API
date: 2022-04-22
categories:
 - 基础知识
tags:
 - http
sidebar: auto
---

RESTful API 是一种接口设计规范，使用了 RESTful API 规范后即便不看接口描述也能大概了解该接口的主要功能，比以往除了 GET 就是 POST 的接口设计清晰易读很多。

### 遵循的规范

- GET：读取
- POST：新建
- PUT：更新
- PATCH：部分更新
- DELETE：删除

1、接口由名词组成
2、避免多级 url，应使用 query 参数来查询
3、服务器应返回 json
4、返回正确的状态码
**5、提供链接**

提供链接指的需要根据接口设计使得每个接口在请求的过程中提供出下一步操作需要的接口。

### 一组符合规范的示例

|功能|接口|
|-|-|
|获取文章|GET /articles|
|新建文章|POST /article|
|更新文章|PUT /article/:articleId|
|删除文章|DELETE /article/:articleId|
|获取某分类下的文章|GET /articles?categoryId=xxx|