/**
 * tools
 * 
 */
/**
 * 根据请求参数获取页面地址
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
exports = function getViews (page) {
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

/**
 * 获取xml文件
 * @param  {[type]} page [description]
 * @return {[type]}      [description]
 */
exports = function getXml (url) {
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