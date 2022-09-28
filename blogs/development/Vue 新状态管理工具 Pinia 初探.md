---
title: Vue 新状态管理工具 Pinia 初探
date: 2022-04-25
categories:
 - 项目开发
tags:
 - Vue
sidebar: auto
---

### Pinia 是什么？
由 Vue 团队核心成员开发的下一代 Vue 状态管理工具，也获得了尤雨溪的认可，只不过目前还和 Vuex 是不同的仓库。

而在用法上最大的变化则是抛弃了 Mutation，以往在使用 Vuex 时始终觉得通过 Actions 来通知 Mutation 改变 State 的操作如果能简化成一部就会方便很多，新版本果然没有让人失望！

### Pinia 使用

不照搬照抄官网的示例，决定首先在自己的博客中使用 Pinia 状态管理改造一下文章列表的获取。

### 安装
```
npm i pinia
```

### main.ts
```ts
// 引入并使用
import { createPinia } from 'pinia';
app.use(createPinia());
```
### articles.store.ts
```ts
// 创建文章的 Store
export const ArticlesStore = defineStore('articles', {
  // 定义 state
  state: () => {
    return {
      // 列表数据
      items: [] as ArticleModel[],
      // 列表分页数据
      meta: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      // 是否首次加载，首次加载显示骨架屏
      loaded: false,
      // 是否加载中，加载中显示 loading 图标
      loading: true
    }
  },
  // 定义行为 actions，新版的 actions 支持同步和异步，因此可以省略掉 mutation
  actions: {
    // 请求文章列表接口
    async getItems(query: ArticleQueryModel) {
      try {
        this.loading = true;
        const result = await ArticleService.search(query);
        // 请求成功后可直接改变 state 中的属性
        this.items = result.data;
        this.meta = result.meta!;
        this.loading = false;
        this.loaded = true;
      } catch (error: any) {
        message.error(error.message);
        this.loading = false;
      }
    }
  },
  // 定义计算属性 getters
  getters: {
    getArticleById: (state) => {
      // 根据 _id 来获取某一条文章
      // getters 不能接受参数，但可以返回函数来接受参数
      return (articleId) => state.items.find((item: ArticleModel) => item._id === articleId)
    },
  }
})
```

### article-list.vue

```ts
setup() {
  // 导入预先定义好的 store
  const articlesStore = ArticlesStore();
  // 使用 storeToRefs 来保持响应式地获取属性
  const { loaded, loading, items, meta } = storeToRefs(articlesStore);
  // 触发 actions
  onMounted(() => articlesStore.getItems({ ...route.query }));

  return {
    loaded,
    loading,
    items,
    meta
  };
}
```
> [Pinia 中文文档](https://pinia.web3doc.top/)