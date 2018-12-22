---
category: Components
type: Data Entry
title: editor
cols: 1
subtitle: 富文本编辑器
---
富文本编辑器


## 何时使用

需要图文文本框

## API
字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- | ---
picConfig | string | 否 | - | 上传图片配置，见下方
value | string | 否 | 'post' | 编辑器中的值
disabled | boolean | 否 | false | 是否可以编辑富文本编辑器
className | string | 否 | '' | 富文本编辑器的样式
style | object | 否 |{}| 富文本编辑器的样式
height | string | 否 | 500 | 富文本编辑器的高度
onChange | function | 是 | - | value值改变触发的函数

### picConfig

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- | ---
url | object | 是 | {} | 上传图片的request参数
name | string | 否 | file | 发到后台的文件参数名
params | object | 否 | {} | 发到后台的额外参数
size | Number | 否 | 5 | 上传图片的最大大小
domain | string | 否 | '' | 上传图片的域名

