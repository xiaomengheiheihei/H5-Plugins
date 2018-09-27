const Koa = require('koa')
const loggerAsync  = require('./middleware/logger-async')		// 打印请求的demo中间件
const app = new Koa()
const fs = require('fs');
const path = require('path')
const Router = require('koa-router')  //路由依赖的中间间
const bodyParser = require('koa-bodyparser')  //请求体，返回体解析类似json，text，图片等

app.use(loggerAsync())
app.use(bodyParser())

// app.use( async ( ctx ) => {
//   ctx.body = 'hello world!'
// })

app.use(require('./router/index').routes())
app.use(require('./router/configPage').routes())

app.listen(3000)
console.log('server is starting at port 3000')