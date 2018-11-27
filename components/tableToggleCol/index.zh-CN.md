---
category: pc
type: Data Entry
title: TableToggleCol
cols: 1
subtitle: 切换表格列
---
动态调整表格显示的列


## 何时使用

适用表格列数太多，不方便查看数据时

## API

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- | ---
columns | Array | 是 | - | 表格列的配置描述，具体项见Table组件的columns属性,新增columnDefaultHide属性，控制初始化是否隐藏，columnDefaultHide值默认为false，当需要默认隐藏列时，请设置为true
columnsChange | Function | 是 | - | 切换列的事件钩子，函数第一个参数，返回新的列数据
fixedColSize | Number | 否 | 5 | 保留固定列的最小列数，当列数少于fixedColSize时，取消左右固定列




