---
title: python 压缩图片
date: 2022-09-28
categories:
 - 项目开发
tags:
 - 可视化
 - python
sidebar: auto
---

## 需求

将 tif 格式的图片文件压缩值横向1080像素的大小，使用 python 的第三方图像处理库 PIL(Python Image Library)。

## 实现

``` py
from PIL import Image
from PIL import ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None # 可读取超大图像

def save_tif(data):
  # file_path = '......'
  im = Image.open(file_path)
  x, y = im.size
  k = (1080 / x)
  # x缩小到1080像素
  out = im.resize((int(x * k), int(y * k)), Image.ANTIALIAS)
  out.save(str(file_path) + '.jpg')
```