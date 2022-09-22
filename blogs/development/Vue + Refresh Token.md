---
title: Vue + Refresh Token
date: 2022-04-16
categories:
 - 项目开发
tags:
 - 组织、角色、用户
 - Vue
sidebar: auto
---

## 一、关于 Refresh Token

之前公司项目中使用了 Refresh Token ，作为前端理解 Refresh Token 花了一些功夫。

为什么在已有 Access Token 的基础上还要再加一层 Refresh Token ？因为 Access Token 本身有过期时间，很多网站长时间不登录都会提示 Access Token 过期重新登录，然后某些记性不好的小伙伴就开始了忘记密码找回的流程，用户体验不是很好，而如果设置过长的 Access Token 过期时间那么安全性又会降低，Refresh Token 就解决了这两个矛盾的问题。

Refresh Token 由于仅仅用来请求普通 Token ，对安全性的要求没那么强烈，因此可以设置较长的过期时间，而当 Token 面临过期时，使用 Refresh Token 来重新获取 Access Token ，然后再用 Access Token 继续之前未完成的操作。

## 二、Vue 实现

后端需要专门的接口用来进行 Refresh Token 对 Access Token 的请求。

在 axios 的 http 拦截器里加入对 Refresh Token 和 Access Token 的相关处理。

### 1、获取 Token

```js
export const getToken = () => {
  const tokenObj: TokenObj = {};
    // 从本地存储中获取 Refresh Token 和 Access Token 及它们的过期时间
  tokenObj.accessToken = localStorage.getItem('accessToken');
  tokenObj.accessTokenExpiresTime = localStorage.getItem('accessTokenExpiresTime');
  tokenObj.refreshToken = localStorage.getItem('refreshToken');
  tokenObj.refreshTokenExpiresTime = localStorage.getItem('refreshTokenExpiresTime');
  return tokenObj;
};
```

### 2、存储 Token

```js
// 使用 axios 创建 http
export const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  withCredentials: false, // 跨域请求时发送 cookies
  timeout: 30000
});

export const setToken = (tokenObj) => {
  // 将 Access Token 添加进 http 默认请求头
  http.defaults.headers['Authorization'] = `${tokenObj.accessToken}`;
  Object.keys(tokenObj).forEach(key => {
      if (tokenObj[key]) {
          localStorage.setItem(key, tokenObj[key]);
      }
  });
};
```

### 2、判断接口是否是 Refresh Token 专用接口

```js
export const setConfigHeaders = (tokenObj: TokenObj, config: AxiosRequestConfig) => {
  if (tokenObj.accessToken && tokenObj.refreshToken && config.url) {
    if (config.url.indexOf('/refresh-token') >= 0) {
      // 此处为 Refresh Token 专用接口，请求头使用 Refresh Token
      config.headers['Authorization'] = `${tokenObj.refreshToken}`;
    } else if (!(config.url.indexOf('/login') !== -1 && config.method === 'post')) {
      // 其他接口，请求头使用 Access Token
      config.headers['Authorization'] = `${tokenObj.accessToken}`;
    }
  }
};
```

### 3、请求拦截器处理

```js
// 全局刷新状态，防止重复请求 /refresh-token 接口
window.isRefeshing = false;
// 原始请求队列
let requests: any = [];

export function requestHandler(
    config: AxiosRequestConfig
): AxiosRequestConfig | Promise<AxiosRequestConfig> {
  // 获取本地存储的 Token
  const tokenObj = getToken();
  // 将 Token 塞入请求头
  setConfigHeaders(tokenObj, config);

  if (config.url) {
    config.url = `/api/v1${config.url}`; // Restful Api 版本内容

    // 如果是 Refresh Token 专用接口或登录接口，不需要进一步处理
    if (config.url.indexOf('/refresh-token') >= 0 || config.url.indexOf('/login') >= 0) {
      return config;
    }
  }
  
  // 如果本地存储的 Token 相关内容无误，继续下一步处理
  if (tokenObj.accessToken && tokenObj.accessTokenExpiresTime && tokenObj.refreshToken && tokenObj.refreshTokenExpiresTime) {
    // 获取当前时间
    const now = Date.now();
    // 判断 Refresh Token 是否过期，要是它都过期了，那就要重新认证了
    if (now > tokenObj.refreshTokenExpiresTime) {
      clearToken();
      return config;
    }
    // Access Token 过期
    if (now > tokenObj.accessTokenExpiresTime) {
      if (!window.isRefeshing) {
        // 开始处理
        window.isRefeshing = true;
        // 请求 /refresh-token 接口
        authRefreshToken().then(data => {
          // 获取到全新的 Token 信息
          const {accessToken, accessTokenExpiresIn, refreshToken, refreshTokenExpiresIn} = data;
          // 计算出新的过期时间
          const accessTokenExpiresTime = now + accessTokenExpiresIn;
          const refreshTokenExpiresTime = now + refreshTokenExpiresIn;
          // 调用上文的 setToken 方法
          setToken({
            accessToken, accessTokenExpiresTime, refreshToken, refreshTokenExpiresTime
          });
          window.isRefeshing = false;
          return accessToken;
        }).then(token => {
          requests.forEach((cb: any) => cb(token));
          // 执行完成后，清空队列
          requests = [];
        }).catch(() => {
          // 错误则清除所有 Token 相关信息，让用户重新认证
          window.isRefeshing = false;
          clearToken();
          return config;
        });
      }

      // 原有的请求队列，在重新获取完 Access Token 后继续执行之前未完成的请求
      // 适用于同时多个请求的情况
      return new Promise(resolve => {
        requests.push((accessToken: string) => {
          config.headers['Authorization'] = `${accessToken}`;
          resolve(config);
        });
      });
    }
  }
  return config;
}
```