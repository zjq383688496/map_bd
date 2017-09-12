;(function(global, VM, WD) {
	// $.ajaxSetup({ crossDomain: true, xhrFields: { withCredentials: true } })
	var API = {
			localhost:   'http://localhost:3050/api/gt',
			development: 'http://mail.dev.mjmobi.com/api/gt',
			pl:          'http://mail.pl.mjmobi.com/api/gt',
			production:  'http://mail.mjmobi.com/api/gt'
		},
		isLO = /localhost/.test(location.host)

	function toUrl(me) {
		me.API = API[me.env]
		console.log(me.API)
	}
	function init(me) {
		// me.spinShow = true
		me.wait     = true
		me.submit   = false
		var gt = document.querySelector('.geetest_holder')
		if (gt) gt.outerHTML = ''
		WD.http.get(API[me.env] + '/get', function(o) {
			// me.spinShow = false
			if (o.code === '0000') {
				initGeetest(o.data, me.init)
			} else {
				VUE.$Message.warning(err.message)
			}
		}, function(err) {
			// me.spinShow = false
			VUE.$Message.warning(err.message)
		})
	}

	global.VUE = new Vue(WD.extend(VM, {
		data: {
			frame: '',
			wait: true,
			submit: false,
			captcha: '',
			// isLO: isLO,
			// spinShow: false,
			env: isLO? 'localhost': 'development',
			formValidate: {
				username: '',
				password: '',
			},
			API: '',
			ruleValidate: {
			}
		},
		watch: {
			env: function(v) {
				toUrl(this)
				init(this)
			}
		},
		methods: {
			init: function(captcha) {
				var me = this
				me.captcha = captcha
				captcha.appendTo('#captcha')
				captcha.onReady(function () {
					me.wait = false
					me.submit = true
				})
			},
			handleSubmit: function() {
				var me = this
				if (me.submit) {
					// me.spinShow = true
					var result = me.captcha.getValidate()
					if (result) {
						WD.http.post(API[me.env] + '/validate', result, function(o) {
							// VUE.$Message.success(o.message)
							VUE.$Message.success(`成功!<br>用户名: ${me.formValidate.username}<br>密码: ${me.formValidate.password}`)
							// me.spinShow = false
							toUrl(me)
							init(me)
						}, function(err) {
							VUE.$Message.warning(err.message)
							// me.spinShow = false
						})
					} else {
						// me.spinShow = false
						return VUE.$Message.warning('请完成验证!')
					}
				} else {
					VUE.$Message.warning('加载验证模块失败! 请刷新页面后再试')
				}
			}
		},
		mounted: function() {
			var me = this
			toUrl(me)
			init(me)
		}
	}))

	VUE.$Message.config({ top: 100 })

}(this, VM, WD))
