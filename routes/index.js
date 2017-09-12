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
router.get('/s/list', (req, res, next) => {
	var query = req.query,
		lng   = query.lng,
		lat   = query.lat

	if (lng && lat) {
		var opts  = {
			url: config.api.s + '/comp?longitude='+lng+'&latitude='+lat+'&type=1&t='+moment().format('YYYY_MM_DD_HH_mm_ss'),
			json: true,
		}
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
		body.presentLongitude = storeLongitude
		body.presentLatitude  = storeLatitude
		body.bpId = '0007264245'
		body.userName = 'ZJQ383688496'
		body.type = '1'
		body.t = moment().format('YYYY_MM_DD_HH_mm_ss')
		var str = []
		for (var p in body) {
			str.push(p + '=' + body[p])
		}
		var opts  = {
			url: config.api.s + '/sign?' + str.join('&'),
			json: true,
			headers: {
				// 'Referer': query.referer,
				'User-Agent': 'SonyApp/4.4.1 (iPhone; iOS 10.2.1; Scale/2.00)',
				'Cookie': 'saplb_*=(J2EE322943820)322943850; TLTUID=0A6402080000015E73B3ED6D00007449'
			},
			'Cookie': 'saplb_*=(J2EE322943820)322943850; TLTUID=0A6402080000015E73B3ED6D00007449'
		}
		console.log(body)
		console.log(opts.url)
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

// config.api.s + '/sign?dealerId=11dd790be96140b392dfd4d2e7026075&bpId=0007264245&userName=ZJQ383688496&storeLongitude=121.466928&storeLatitude=31.223389&presentLongitude=121.505118&presentLatitude=31.355102&t='+moment().format('YYYY_MM_DD_HH_mm_ss')


module.exports = router
