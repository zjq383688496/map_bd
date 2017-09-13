const router  = require('express').Router()
const request = require('request')
const moment  = require('moment')
const config  = require('../config')

function render(path, opts) {
	return function(req, res, next) {
		res.render(path, opts || {})
	}
}

router.get('/',  render('index'))

router.get('/s', render('s'))
router.get('/s/wprov', (req, res, next) => {
	var api = config.api.s + req.originalUrl.substr(2)
	var opts  = {
		url: api
	}
	request.get(opts, function (err, response, data) {
		if (!err) {
			res.send(data)
		} else {
			res.send(err)
		}
	})
})
router.get('/s/list', (req, res, next) => {
	var opts  = {
		url: config.api.s + '/comp?channel=web',
		form: {
			type: '2',
			strs: '',
			provinceId: req.query.id
		},
		// url: config.api.s + '/comp?longitude='+lng+'&latitude='+lat+'&type=1&t='+moment().format('YYYY_MM_DD_HH_mm_ss'),
		json: true
	}
	request.post(opts, function (err, response, data) {
		if (!err) {
			res.send({
				code: '0000',
				data: data
			})
		} else {
			res.send(err)
		}
	})
})

function re(str) {
	return str.match(/^\d+\.\d{5}/)[0] + (Math.floor(Math.random()*10)+'')
}
router.post('/s/sign', (req, res, next) => {
	var body     = req.body,
		dealerId = body.id,
		storeLongitude = body.longitude,
		storeLatitude  = body.latitude

	if (dealerId && storeLongitude && storeLatitude) {
		// body.presentLongitude = re(storeLongitude)
		// body.presentLatitude  = re(storeLatitude)
		var op = {
			dealerId:         dealerId,
			storeLongitude:   storeLongitude,
			storeLatitude:    storeLatitude,
			presentLongitude: storeLongitude,
			presentLatitude:  storeLatitude,
			bpId:             '0007264245',
			userName:         'ZJQ383688496',
			type:             '1',
			t:                moment().format('YYYY_MM_DD_HH_mm_ss')
		}
		var str = []
		for (var p in op) {
			str.push(p + '=' + op[p])
		}
		var opts  = {
			url: config.api.s + '/sign?' + str.join('&'),
			json: true,
			headers: {
				'User-Agent': 'SonyApp/4.4.1 (iPhone; iOS 10.2.1; Scale/2.00)'
			}
		}
		console.log('================== API ==================')
		console.log(opts.url)
		console.log('================== DATA ==================')
		console.log(op)
		request.get(opts, function (err, response, data) {
			if (!err) {
				res.send({
					code: '0000',
					data: data
				})
			} else {
				res.send(err)
			}
		})
		// next()
	} else {
		next()
	}
})

// /like?dealerId=e2c75bd85e574dce8568b58510a3509e&mark=270037CF-0D25-4DF2-8FF5-10495E0678CE&channel=2&t=2017_09_12_17_35_02
// dealerId	4028ab555920f4b7015920f4d683001e
// mark	270037CF-0D25-4DF2-8FF5-10495E0678CE
// channel	2
// t	2017_09_13_22_29_01
module.exports = router
