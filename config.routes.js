const config   = require('./config')
const title    = require('./models/title')

module.exports = function(app) {

	app.use((req, res, next) => {
		var _render = res.render,
			path    = req.originalUrl.replace(/\/{2,}/g, '/').replace(/\/$/, '').replace(/\?.*/, '')
			res.render = function () {
			if (arguments.length === 1) {
				arguments.length = 2
				arguments[1] = {}
			}
			arguments[1].config = config
			arguments[1].title  = title[path || '/']
			return _render.apply(this, arguments)
		}
		next()
	})

	app.use('/',    require('./routes'))	// 主页
	// app.use('/api', require('./routes/api'))	// API

	// 404 catch-all 处理器 & 500 错误处理器
	app.use((req, res, next) => {
		res.redirect('/')
	})
	app.use((err, req, res, next) => {
		res.redirect('/')
	})
}