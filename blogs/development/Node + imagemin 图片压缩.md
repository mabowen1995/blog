---
title: Node + imagemin 图片压缩
date: 2022-04-14
categories:
 - 项目开发
tags:
 - node.js
sidebar: auto
---

> "imagemin": "^7.0.1",
  "imagemin-mozjpeg": "^8.0.0",
  "imagemin-pngquant": "^9.0.2",

images 插件在只能将 png 格式压缩为 jpg 格式，而 TinyJPG 插件有免费额度限制，并且最主要的是需要将图片上传至 TinyJPG 服务器进行压缩，因此最终选择了使用 imagemin 插件进行压缩。

如果对压缩质量要求较高建议使用TinyJPG，imagemin实测压缩后色彩上有些许失真。

安装这三组插件时需要指定版本，版本不匹配可能会导致一些bug。

```js
const imagemin = require('imagemin');
const imageminMozjpeg  = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

router.post("/upload", async (req, res) => {
  // singleload 方法为 multer 构造，在此使用返回的 req 中的 file 对象即可
  singleUpload(req, res, (err) => {
    if (err) {
      // 错误处理逻辑
    } else {
      // 压缩图片
      imagemin([req.file.path], {
        destination: req.file.destination,
	// 这里的 destination 使用图片原有路径
	// 如果使用新的路径，则不会影响原图片，而是在新路径下保存压缩后的图片
	// 想要保留压缩前后的两份图片，可以使用这种方式
        plugins: [
	  // 压缩 jpg 格式
          imageminMozjpeg(),
	  // 压缩 png 格式
          imageminPngquant()
        ]
      });
      res.json({
        data: {
          path: `${req.file.path.substring(6)}`,
        },
      });
    }
  });
});
```