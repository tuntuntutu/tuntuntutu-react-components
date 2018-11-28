---
category: pc
type: 布局
title: PageTemplate
cols: 1
subtitle: 页面模板
---

页面模板，快速搭建 filter + table 布局 的页面

## 何时使用

适用于 filter + table 布局 的页面


## API


| 字段 | 数据类型 | 是否必填 | 默认值 | 备注 |
| --- | --- | --- | --- | --- |
|rowKey | string | 否 | id | 表格行 key 的取值 |
|config | Object | 是 | - |详情见下方 |
|requestOption | Object | 否 | {} | http请求参数覆盖 |
|filter | Array\<Object\>  | 是 | [] | |
|needExport | String | 否 | - | 导出按钮权限路径|
|toolbar | ReactNode | 否 | - | table的工具栏 |
|columns | Array\<Object\> | 是 | - | ANTD表格组件同样的字段定义,在启用TableToggleCol组件的基础上，扩展了两个字段：columnDisableToggle(不允许列控制显示隐藏)、columnDefaultHide(默认隐藏该列)|
|disableTableToggleCol | boolean| 否 | false | 是否显示切换列|
|connect | Function | 是 | ({ onSearch, form }) => { this.onSearch = onSearch; this.form = form; }| 对外暴露onSearch 和 form |
|eleAfterSearchBtn | ReactNode| 否 | - | 紧跟在搜索重置按钮后方的元素|
|... | any | 否 | - | 任何其他可以加在antd 的 table组件上的属性 |

> onSearch调用时，可以传入onSearch({ searchByCurrentPage: true})在当前页刷新列表

## config
| 字段 | 数据类型 | 是否必填 | 默认值 | 备注 |
| --- | --- | --- | --- | --- |
|url | Object | 是 | - | 列表请求数据的url体， { url: '', method: 'get'} |
|type | string | 否 | 'get' | 列表请求方式 |
|pageSize | string | 否 | 10 | 分页数 |
|searchOnLoad | boolean | 否 | true | 是否默认执行搜索 |
|beforeRequest | function | 否 | val => val | 请求数据前拦截器钩子 |
|afterRequest | function | 否 | val => val | 请求数据后拦截器钩子 |
|exportParams | function | 否 | val => val | 导出组件的数据 |
|successCode | number | 否 | 200 | 业务成功code |

> beforeRequest function 返回 false 会阻断搜索， 可以用来在某些条件下阻断搜索


## filter

| 字段 | 数据类型 | 是否必填 | 默认值 | 备注 |
| --- | --- | --- | --- | --- |
|component | string、element | 是 | - | string取值Select、Input、RangePicker，element可以任何符合form item的组件 |
|key | string | 是 |  - | 表单绑定值，和beforeRequest中的取值对应 |
|label | string | 是 | - | 标签值 |

## 约定的接口数据结构

> 后端接口需要符合下面的结构，也可以通过 afterRequest 转化成如下结构


```javascript
{
 list:[],//必须 列数据
 total:389,//必须 总条数
 pageNum:1,//非必须
 pageSize:10,//非必须
}
```



