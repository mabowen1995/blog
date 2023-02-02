---
title: Vue 角色权限管理设计与实现
date: 2022-04-17
categories:
 - 项目开发
tags:
 - 组织、角色、用户
 - Vue
sidebar: auto
---

目前项目中使用到的角色权限管理共分为三级，分别是页面级、行为级（控件级）、接口级，这里记录一下三级权限在 Vue 中的实现。

## 一、接口设计

用户登录后该用户的角色与权限信息会一同返回给前端，前端将这些信息存储到状态管理里备用即可。

权限信息为树形结构数据，包括：
- 页面级：该用户可访问的页面权限
- 行为级：该用户可执行的行为权限（可以理解为前端组件的`disabled`状态）
- 接口级：该用户可访问的接口权限

三者的关系为页面权限为父级，页面权限内包含行为权限和接口权限，而行为权限和接口权限没有耦合关系。

原本的设计是一个行为权限包含一个或多个接口权限，后来发现这样做在实际业务中难以运用，因为很多时候一个行为可能会使用到多个不同领域的接口，也就是一个接口可能给很多行为来使用，所以无法让某个接口权限只存在于一个行为内，最终选择解除了这种耦合关系。

## 二、页面级

通过 vue-router 中的路由守卫来进行控制

```js
{
    path: 'roles',
    name: 'Roles',
    component: RouterView,
    meta: {
      title: '角色管理',
    },
    // 自定义 PermissionGuard 方法，见下文
    beforeEnter: PermissionGuard,
    children: [
      // 此处省略
    ]
  }
```
自定义 PermissionGuard 方法
```js
export default function (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function) {
  // PermissionHandler 为验证是否有权限的方法，返回一个布尔值，见下文
  const hasPrivilege = PermissionHandler(to.meta?.roleKeys);
    if (!hasPrivilege) {
      // 没有权限跳转到无权限页，并将原本要访问的路由记录在 query 中
      return next(`/unauthorized?origin_target=${to.path}`);
    }
    return next();
}
```

## 三、行为级（控件级）

通过自定义的指令来实现，行为级就是针对那些可能会发生操作行为的控件进行显示隐藏的设置，比如最常见的增删改查按钮等。

```html
<!-- 自定义指令 v-permissions 的使用 -->
<button v-permissions="employee.create">创建成员</button>
```

### permission-directive.ts

```ts
import { PermissionType } from '@/permissions';
// handler 为权限判断方法，见下文
import handler from './permission-handler';

interface PermissionDirectiveBinding<T> {
  value: T[];
}

export default function <T>(el: Element, binding: PermissionDirectiveBinding<PermissionType>) {
  const permissions = binding.value;
  if (!handler(permissions)) {
    el.classList.add('hide');
  } else {
    el.classList.remove('hide');
  }
}
```

### permission-handler.ts

```ts
import { PermissionType } from "@/permissions";
import store from "@/store";

export type PermissionHandler = <T>(permissions: T[]) => Promise<boolean> | boolean;

export default function (targets: PermissionType[]): boolean {
  // 从状态管理中获取用户权限
  const permissions: string[] = store.getters.getPrivilege;
  // 管理员权限为 'all'
  if (permissions[0] === 'all') {
    return true;
  } else {
    let hasPermission = true;
    // 判断权限列表中是否含有指令接收到的权限
    if (targets) {
      for (const target of targets) {
        hasPermission = !!permissions.find(permission =>
          permission === target.authority
        );
        if (!hasPermission) return false;
      }
    }
    return hasPermission;
  }
}
```

### index.ts

```ts
import { App } from 'vue';
import directive from './permission-directive';

export default {
  install: (app: App) => {
    app.directive('permissions', directive);
  }
};
```

## 四、接口级

接口级则是需要后台实现，在接口设计时每个接口会对应一个权限，前端需要收集不同角色在每个页面及控件处使用到的接口，前端动态配置角色权限时，向后台发送新的接口权限列表。

后台则根据当前用户的角色查找该角色的接口权限列表，来判断该用户请求的接口是否可以执行。

## 五、小结

这样便实现了满足大部分业务场景需要的角色权限设计，三个级别可以自行决定使用哪些级别来进行项目的开发，如简单的小型项目单纯的使用页面级即可，而大型的后台管理系统往往会使用到全部三级来实现。