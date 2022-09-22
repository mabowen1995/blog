---
title: js数组实现分类统计
date: 2018-10-30
categories:
 - 项目开发
tags:
 - js
sidebar: auto
---

将水果数组中同类的水果合并为一条并求出总数
```js
var fruits = 
[{
	name: 'apple',
	value: 1
}, 
{
	name: 'apple',
	value: 2
}, // 总计3个苹果
{
	name: 'banana',
	value: 2
}, 
{
	name: 'banana',
	value: 3
}]; // 总计5个香蕉

var fruitTotal = [];  // 存最终数据结果

// 数据按照水果名称进行归类
var nameContainer = {}; // 针对键name进行归类的容器
fruits.forEach(item => {
	nameContainer[item.name] = nameContainer[item.name] || [];
	nameContainer[item.name].push(item);
});

console.log(nameContainer); // 按照水果名称归类完成：{ apple: Array(2), banana: Array(2) }

// 统计不同种类水果的数量
var fruitName = Object.keys(nameContainer); // 获取水果种类：["apple", "banana"]
fruitName.forEach(nameItem => {
	let count = 0;
	nameContainer[nameItem].forEach(item => {
		count += item.value; // 遍历每种水果中包含的条目计算总数
	});
	fruitTotal.push({'name': nameItem, 'total': count});
});

console.log(fruitTotal);
// 输出结果：
// [{ name: "apple", total: 3 },
//  { name: "banana", total: 5 }]
```