const router = require('koa-router')();
const fs = require('fs');
const path = require('path')
const parseString = require('xml2js').parseString

router.get('/', async (ctx, next) => {
	ctx.redirect('/index')
})

router.get('/index', async(ctx, next) => {
	"use strict";
    ctx.body = await getViews('/index')
    // ctx.body = f1()
})

router.post('/getJson',async(ctx, next) => {
    ctx.body = await f1();
})

async function f1 () {
	let a2;
	await f2().then((data) => {
		parseString(data, { explicitArray : false}, (err, result) => {
			// console.log(JSON.stringify(result));
			a2 = JSON.stringify(result)
		})
	})
	return a2;
}

module.exports = router

function getXml (url) {
	return new Promise((resolve, reject) => {
		fs.readFile(path.resolve('./server/xmls/channeltemplates.xml'), (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	});
}

async function f2 () {
	const a1 = await getXml();
	return a1.toString();
}


/**
 * 根据请求参数获取页面地址
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
function getViews (page) {
	return new Promise((resolve, reject) => {
		let viewUrl = path.resolve('./') + page + '.html';
		fs.readFile(viewUrl, "binary", (err, data) => {
			if (err) {
				reject(err)
			} else {
				resolve(data)
			}
		})
	});
}