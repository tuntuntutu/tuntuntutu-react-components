---
category: pc
type: General
title: SelectMax
cols: 2
subtitle: 下拉框Max
---

对 antd 的 select进行业务向的简化封装

## 何时使用

需要异步获取options数据、不想自己遍历options的情况

## API

 字段 | 数据类型 | 是否必填 | 默认值 | 备注
 --- | --- | --- | --- |  ---
 url | Object | 否 | null | 请求地址obj，即 {url:'', method: 'get'}
 options | Array | 否 | [] | 下拉框内容
 optionMap | Object | 否 | { key: 'key', value: 'value'} | option参数转化map
 afterRequest | function | 否 | val=>value | 转化方法



