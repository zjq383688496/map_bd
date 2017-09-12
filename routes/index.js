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
			// 'Cookie': 'saplb_*=(J2EE322943820)322943850; TLTUID=0A6402080000015E73B3ED6D00007449'
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

// {
// 	dealerId=e2c75bd85e574dce8568b58510a3509e,
// 	bpId=0007264245,
// 	userName=ZJQ383688496,
// 	storeLongitude=121.484617,
// 	storeLatitude=31.276780,
// 	presentLongitude=121.508177,
// 	presentLatitude=31.357151,
// 	t=2017_09_12_18_01_34
// }

module.exports = router
