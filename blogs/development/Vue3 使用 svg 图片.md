---
title: Vue3 使用 svg 图片
date: 2022-11-22
categories:
 - 项目开发
tags:
 - Vue
sidebar: auto
---

安装
```
yarn add vite-plugin-svg-icons -D
```

main.ts 中引入
``` ts
import 'virtual:svg-icons-register'
```

vite.config.ts 中添加配置
``` ts
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    createSvgIconsPlugin({
      // svg 图片存放的路径
      iconDirs: [resolve(__dirname, 'src/assets/svg')],
      // 格式
      symbolId: '[name]'
    }),
  ]
})
```

新增 components/svg-icon.vue 组件

``` html
<template>
    <svg :class="svgClass" aria-hidden="true">
        <use class="svg-use" :href="symbolId" />
    </svg>
</template>

<script setup lang="ts">import { computed } from 'vue';

const props = defineProps({
    prefix: {
        type: String,
        default: 'icon'
    },
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        default: ''
    }
})
const symbolId = computed(() => `#${props.name}`)
const svgClass = computed(() => {
    if (props.className) {
        return `svg-icon ${props.className}`
    }
    return 'svg-icon'
})
</script>
<style scope lang="less">
.svg-icon {
    fill: currentColor;
}
</style>
```

页面中使用
``` html
<template>
  <svg-icon name="prohect"></svg-icon>
</template>
 
<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon.vue";
</script>
```

在 main.ts 中全局引入
``` ts
import SvgIcon from "@/components/SvgIcon.vue";
app.component('svg-icon', SvgIcon)
```