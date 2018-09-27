/**
 * 配置参数页面路由地址
 */
const router = require('koa-router')();

router.get('/config', async(ctx, next) => {
	"use strict";
    ctx.body = '配置'
})

module.exports = router;