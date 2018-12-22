---
category: Components
type: General
title: Gallery
cols: 1
subtitle: 查看图片
---

查看图片组件

## 何时使用
需要用到查看图片预览切换效果的地方

## API

字段 | 数据类型 | 是否必填 | 默认值 | 备注
:--:|:--:|:--:|:--:|:--:|:--:
imgList | Array/String | 是 | [] | 图片数据源
onClose | Function | 否 | () => {} | 关闭时的回调
visible | Boolean | 否  | false | 是否显示
index | Number | 否 | 0 | 当前显示第几张图片
