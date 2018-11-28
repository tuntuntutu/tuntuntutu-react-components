---
category: pc
type: 其他
title: Request
cols: 1
subtitle: 请求
---

http请求框架
## 功能

- 数据类型
    1. 支持文件流(form-data)上传
    2. GET POST PUT DELETE请求方法
- 参数
    1. 首尾去空
    2. 删除值为undefined的key
- 返回码预处理
    1. HTTP状态码556时，同步跳到授权页面进行登录
    2. 555时，提示请求的资源不存在，请联系管理员

## 何时使用

需要发起异步请求时调用

## API

字段 | 数据类型 | 是否必填 | 默认值 | 备注
--- | --- | --- | --- | ---
url | String | 是 | - | 请求地址
data | Object,String,Number | 否 | - | 请求入参
method | String | 否 | 'get' | 'get'\|'post'
rules | Object | 否 | {noEmptyString:false,noEmoji:true} | 数据过滤规则(noEmptyString[是否过滤单个或者多个空格],非字符串的undefined将直接过滤，不再提供对应规则;noEmoji默认过滤Emoji表情)
dataType | String | 否 | 'json' | 请求数据类型('json','form','form-data')
code | Number | 否 | 200 | 业务成功的标识code
loading | Boolean | 否 | true | 全局loading效果，可以有效阻止用户再次请求
errorToast | Boolean | 否 | true | 业务code不匹配时，是否弹出错误，默认弹出
intactData | Boolean | 否 | false | 是否返回完整数据(仅针对成功的业务场景，失败业务场景需要在catch中解析message字符串，完整数据封装在message的json字符串里)，默认只返回业务数据，需要返回完整数据，在入参中设置intactData为true
messageKey | String | 否 | 'message' | 业务code不匹配时，覆盖错误信息存放的属性值。如'msg'、'errorMsg'的等
authUrlKey | String | 否 | 'authUrl' | 当 登录失效（httpCode为556）时，需要跳转至的url的key值。例如：'loginUrl', 'authLoginUrl'

> 以及支持axios的其他配置参数

## dataType

- json: application/json（默认）
- form: application/x-www-form-urlencoded
- form-data: multipart/form-data

<style>
.code-box-demo .ant-btn{
   margin-right: 5px;
}
</style>
