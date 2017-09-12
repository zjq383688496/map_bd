'use strict'

const express      = require('express')
const cookieParser = require('cookie-parser')
const bodyParser   = require('body-parser')
const config       = require('./config')
const swig         = require('swig')

// 创建项目实例
const app = express()

const port = process.env.PORT || 9000

app.disable('x-powered-by')

// swig默认配置
swig.setDefaults({
	varControls: ['[[', ']]']
})

app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', 'views')	// 设置views目录

// 定义数据解析器
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.use(express.static(__dirname + '/public'))

// 服务端处理的时间
app.use(function (req, res, next) {
	var startTime = Date.now()
	var _send = res.send
	res.send = function () {
		res.set('Z-Execution-Time', String(Date.now() - startTime))
		return _send.apply(res, arguments)
	}
	next()
})

// 配置路由
require('./config.routes')(app)

app.listen(port, () => {
	console.log('localhost:' + port)
})

// module.exports = app
