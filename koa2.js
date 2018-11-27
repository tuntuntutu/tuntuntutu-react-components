/**
 * yarn test
 * 启动单元测试的时候，前置启动request进行单元测试的依赖服务
 * */

/* eslint-disable */
const Koa = require('koa2');
const Router = require('koa-router');
const cors = require('koa2-cors');

const app = new Koa();
const router = new Router();


router.get('/request/get', (ctx, next) => {
  ctx.body = {
    code: 200,
    message: '正常',
  };
});

/**
 * 后端返回码的 test cases
 * */
router.get('/request/status/555', (ctx, next) => {
  ctx.body = {
    authFilterErrorCode: 555,
    authFilterErrorMessage: '请求的资源不存在，请联系管理员！',
  };
});

/**
 * pageTemplate test data
 * */
router.get('/pageTemplate/queryList', (ctx, next) => {
  ctx.body = {
    code: 200,
    message: '正常',
    data:{
      list:[
        { key: 0, name: 'Jack' },
        { key: 1, name: 'Lucy' },
        { key: 2, name: 'Tom' },
        { key: 3, name: 'Jerry' },
      ],
      total:4
    }
  };
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
