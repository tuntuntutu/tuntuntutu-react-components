---
category: pc
type: 数据输入
title: TimeRangePicker
cols: 1
subtitle: 时间区间
---
时间区间选择器


## 何时使用

需要时间区间选择

## API

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- | ---
value | Array | 否 | - | 时间区间数值，格式为：\[12:13:12,12:32:32\]，和format对应
format | String | 否 | HH:mm:ss | 和value，defaultValue对应
onChange | Function | 否 | - | 数据变化效果
defaultValue | Array | 否 | - | 时间区间默认值，格式为：\[12:13:12,12:32:32\]，和format对应
splitContent | any | 否 | - | 两个时间之间的分割符号，默认'-'




