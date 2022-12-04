---
title: js生成二维码——QRCode.js中文文档
date: 2018-10-31
categories:
 - 项目开发
tags:
 - 二维码
sidebar: auto
---

>QRCode v1.2.2
[原文地址](https://www.npmjs.com/package/qrcode)
[API 文档](https://www.npmjs.com/package/qrcode#api)

## 一、安装

```sh
npm install --save qrcode
```

## 二、使用
### 在 JavaScript 中使用
模块引入：
```html
<!-- index.html -->
<html>
  <body>
    <canvas id="canvas"></canvas>
    <script src="bundle.js"></script>
  </body>
</html>
```
```js
// index.js -> bundle.js
var QRCode = require('qrcode')
var canvas = document.getElementById('canvas')

QRCode.toCanvas(canvas, 'sample text', function (error) {
  if (error) console.error(error)
  console.log('success!');
})
```
使用预编译包：
```html
<canvas id="canvas"></canvas>

<script src="/build/qrcode.min.js"></script>
<script>
  QRCode.toCanvas(document.getElementById('canvas'), 'sample text', function (error) {
    if (error) console.error(error)
    console.log('success!');
  })
</script>
```
如果通过npm安装，文件存储在node_modules/qrcode/build/folder中。
### 在ES6/ES7中使用
```js
import QRCode from 'qrcode'

// With promises
QRCode.toDataURL('I am a pony!')
  .then(url => {
    console.log(url)
  })
  .catch(err => {
    console.error(err)
  })

// With async/await
const generateQR = async text => {
  try {
    console.log(await QRCode.toDataURL(text))
  } catch (err) {
    console.error(err)
  }
}
```

## 三、模糊识别（此处为意译，原文直译为：纠错级别）
在二维码部分模糊的情况下依然可以进行识别，分为四个识别等级。更高的级别可以识别更模糊的二维码，但会降低二维码的容量（见第四节）。
如果生成的二维码不会被破坏，建议使用低识别等级。
等级|最大模糊面积
-|-
L（低级）|≤7%
M（中级）|≤15%
Q（四分之一）|≤25%
H（高级）|≤30%
可以通过 options.errorCorrectionLevel 属性设置错误级别。
如果未指定，则默认值为M。
```js
QRCode.toDataURL('some text', { errorCorrectionLevel: 'H' }, function (err, url) {
  console.log(url)
})
```

## 四、二维码容量
容量取决于二维码的版本和模糊识别等级，编码模式也会影响可存储数据的量。
>二维码版本：即二维码的规格，二维码共有40种规格的矩阵，从21x21（版本1），到177x177（版本40），每一版本比前一版本的边增加4个模块。

下表显示了每种编码模式和每个模糊识别等级的最大可存储字符数。
编码模式|L（低级）|M（中级）|Q（四分之一）|H（高级）
-|-|-|-|-
数字|7089|5596|3993|3057
数字+字母|4296|3391|2420|1852
字节|2953|2331|1663|1273
汉字|1817|1435|1024|784
>注意：使用混合模式（见第五节）时，最大字符数可能不同。

可以通过 options.version 属性设置二维码版本。
如果未指定版本，则将使用更合适的值。除非需要特定版本，否则不需要此选项。
```js
QRCode.toDataURL('some text', { version: 2 }, function (err, url) {
  console.log(url)
})
```

## 五、编码模式
编码模式可以更有效的方式编码字符串。编码模式取决于字符串内容。
编码模式|字符|压缩
-|-|-
数字|0, 1, 2, 3, 4, 5, 6, 7, 8, 9|3个字符由10位表示
数字+字母|0–9, A–Z (大写), 空格, $, %, *, +, -, ., /, :|2个字符由11位表示
汉字|基于JIS X 0208的Shift JIS系统的特征|2个汉字由13位表示
字节|ISO / IEC 8859-1字符集中的字符|每个字符由8位表示

如果输入文本未知，选择正确的模式可能会很棘手。
在这些情况下，字节模式是最佳选择，因为所有字符都可以用它进行编码。
但是，如果 QR 码阅读器支持混合模式，则使用自动模式可能会产生更好的效果。
### 混合模式
混合模式也是可能的。可以从具有不同编码模式的一系列段生成二维码以优化数据压缩。
但是，从模式切换到另一种模式的成本可能会导致最坏的结果，如果不考虑它。有关如何指定具有不同编码模式的段的示例，请参见手动模式。
### 自动模式
默认使用自动模式。
输入字符串在各种段中自动分割，优化后使用混合模式产生最短的比特流。
这是生成二维码的首选方式。
例如，字符串ABCDE12345678？A1A将分为3个段，具有以下模式：
分割|编码模式
-|-
ABCDE|数字+字母
12345678|数字
？A1A|字节
段和模式的任何其他组合将导致更长的比特流。
如果您需要保持较小的QR码，此模式将产生最佳效果。
### 手动模式
如果自动模式不适合您或您有特定需求，也可以使用手动模式指定每个段。通过这种方式，不会应用任何段优化。
分段列表可以作为对象数组传递：
```js
var QRCode = require('qrcode')

var segs = [
  { data: 'ABCDEFG', mode: 'alphanumeric' },
  { data: '0123456', mode: 'numeric' }
]

QRCode.toDataURL(segs, function (err, url) {
  console.log(url)
})
```
### 汉字模式
使用汉字模式可以以优化的方式对 Shift JIS 系统中的字符进行编码。
遗憾的是，没有办法从例如以 UTF-8 编码的字符计算 Shifted JIS 值，因此需要从输入字符到 SJIS 值的转换表。
默认情况下，此表不包含在包中，以使包尽可能小。

如果您的应用程序需要汉字支持，则需要传递一个函数，该函数负责将输入字符转换为适当的值。

lib 通过可选文件提供辅助方法，您可以包含该文件，如下例所示。

>注意：仅当您希望受益于数据压缩时才需要支持汉字模式，否则仍然可以使用字节模式对汉字进行编码。
```js
var QRCode = require('qrcode')
var toSJIS = require('qrcode/helper/to-sjis')

QRCode.toDataURL(kanjiString, { toSJISFunc: toSJIS }, function (err, url) {
  console.log(url)
})
```
使用预编译包：
```html
<canvas id="canvas"></canvas>

<script src="/build/qrcode.min.js"></script>
<script src="/build/qrcode.tosjis.min.js"></script>
<script>
  QRCode.toCanvas(document.getElementById('canvas'),
    'sample text', { toSJISFunc: QRCode.toSJIS }, function (error) {
    if (error) console.error(error)
    console.log('success!')
  })
</script>
```

## 六、多字节字符
初始二维码标准中不存在对多字节字符的支持，但可以在字节模式下编码 UTF-8 字符。

二维码提供了一种通过 ECI（扩展信道解释）指定不同类型字符集的方法，但它尚未在此 lib 中完全实现。

但是，大多数二维码阅读器即使没有 ECI 也能识别多字节字符。

请注意，单个汉字/假名或表情符号最多可占用 4 个字节。