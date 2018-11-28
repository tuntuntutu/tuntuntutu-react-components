---
category: pc
type: 基础
title: Log
cols: 1
subtitle: 日志
---

弹窗展示日志

## 何时使用

适用查看操作日志的场景

## API

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- | ---
url | Object | 是 | -- | 请求地址 {url: '', method:'get'}
requestOption | Object | 否 | {} | http请求配置覆盖
query | Object | 是 | null | 请求参数
columns |Array | 是 | [ ] | 表格的列名
text | String | 否 | '日志' | 打开组件的链接的名字
title | String | 否 | '操作日志' | 顶部的名字
afterRequest | function | 否 | val => val | 请求钩子
needPagination | boolean | 否 | true | 是否需要分页


## 约定的接口数据结构

> 后端接口需要符合下面的结构，也可以通过 afterRequest 转化成如下结构

```javascript
// needPagination 为true
data: {
 list:[],//必须 列数据
 total:389,//必须 总条数
 pageNum:1,//非必须
 pageSize:10,//非必须
}

// needPagination 为false
data: [] //必须 列数据
```


