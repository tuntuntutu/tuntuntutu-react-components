---
category: Components
type: General
title: SelectDouble
cols: 1
subtitle: select两级级联
---

两级联动组件

## 何时使用
两级联动组件，如果是省市联动，可使用 provinceCity

## API

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- |  ---
width | number | 否 | 200 | select宽度
className | string | 否 | '' | 根节点样式
firstConfig | Object | 是  | {} | 一级select数据源，详情见下方config
secondConfig | Object | 是  | {} | 二级select数据源，详情见下方config
defaultValue | Object | 否 | {} | 默认值，详情见下方 value结构
value | Object | 否 | {} | 受控组件数据，详情见下方 value结构
format | Object | 否 | {} | 数据回填数据映射，{first: 'first', second: 'second'}
onChange | function | 否 | ()=>{} | 内容变化回调

#### value结构

默认以{first: '', value: ''}，如果重置format，则first、second则为映射后的值

```
// 默认
format: {first: 'first', second: 'second'}
value: {first: '', second: ''}
// 使用
format: {first: 'a', second: 'b'}
value: {a: '', b: ''}
```

#### config

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- |  ---
url | object | 是 | -- | request入参
data | object | 否 | {} | request data 参数
afterRequest | function | 否  |val=>val| 一级select数据源，详情见下方
beforeRequest | function | 否  |  val=>val | 二级select数据源，详情见下方
optionMap | object | 否 | {key: 'key', value: 'value'} | 后端数据映射

