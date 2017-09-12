(function(global, VM, WD) {
	var API = {
			localhost:   'http://mail.dev.mjmobi.com/api/login/login',
			development: 'http://mail.dev.mjmobi.com/api/login/login',
			pl:          'http://mail.pl.mjmobi.com/api/login/login',
			production:  'http://mail.mjmobi.com/api/login/login'
		},
		URL = {
			localhost: {
				dsp: 'http://localhost:3020',
				ssp: 'http://localhost:3010',
				dmp: 'http://localhost:3018',
				ldb: 'http://localhost:3024'
			},
			development: {
				dsp: 'http://dsp-dev.mjmobi.com',
				ssp: 'http://ssp.dev.weimob.com',
				dmp: 'http://dmp.dev.weimob.com',
				ldb: 'http://ldb.dev.mjmobi.com'
			},
			pl: {
				dsp: 'http://dsp.pl.mjmobi.com',
				ssp: '',
				dmp: '',
				ldb: 'http://ldb.pl.mjmobi.com'
			},
			production: {
				dsp: 'http://dsp.mjmobi.com',
				ssp: 'http://ssp.weimob.com',
				dmp: 'https://dmp.weimob.com',
				ldb: 'http://luodibao.com.cn'
			}
		},
		FRAME = {
			localhost: {
				dsp: 'http://localhost:3020/islogin',
				ssp: 'http://localhost:3010/islogin',
				dmp: 'http://localhost:3018/islogin',
				ldb: 'http://localhost:3024/islogin'
			},
			development: {
				dsp: 'http://dsp-dev.mjmobi.com/islogin',
				ssp: 'http://ssp.dev.weimob.com/islogin',
				dmp: 'http://dmp.dev.weimob.com/islogin',
				ldb: 'http://ldb.dev.mjmobi.com/islogin'
			},
			pl: {
				dsp: 'http://dsp.pl.mjmobi.com/islogin',
				ssp: '',
				dmp: '',
				ldb: 'http://ldb.pl.mjmobi.com/islogin'
			},
			production: {
				dsp: 'http://dsp.mjmobi.com/islogin',
				ssp: 'http://ssp.weimob.com/islogin',
				dmp: 'https://dmp.weimob.com/islogin',
				ldb: 'http://luodibao.com.cn/islogin'
			}
		},
		LOGIN = {
			localhost: {
				dsp: null,
				ssp: null,
				dmp: null,
				ldb: null
			},
			development: {
				dsp: null,
				ssp: null,
				dmp: null,
				ldb: null
			},
			pl: {
				dsp: null,
				ssp: null,
				dmp: null,
				ldb: null
			},
			production: {
				dsp: null,
				ssp: null,
				dmp: null,
				ldb: null
			}
		},
		isLO = /localhost/.test(location.host)

	function toUrl(me) {
		var type = ''
		if (!me.env || !me.platform) return
		if (me.platform === 'ssp') type = '/' + (me.type || 'h5')
		me.formValidate.url = (URL[me.env][me.platform] || '') + type
		me.frame = FRAME[me.env] && FRAME[me.env][me.platform]? FRAME[me.env][me.platform]: ''
		isLO && console.log(me.formValidate.url)
	}

	global.VUE = new Vue(WD.extend(VM, {
		data: {
			frame: '',
			login: LOGIN,
			isLO: isLO,
			type: 'h5',
			spinShow: false,
			env: isLO? 'localhost': 'development',
			platform: 'dsp',
			formValidate: {
				account: '',
				password: '',
				url: ''
			},
			ruleValidate: {
				account: [
					{ required: true, message: '用户名不能为空', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			}
		},
		watch: {
			type: function(v) {
				toUrl(this)
			},
			env: function(v) {
				toUrl(this)
			},
			platform: function(v) {
				toUrl(this)
			}
		},
		methods: {
			loginStatus: function(data) {
				var me     = this,
					status = data.islogin
				if (!me.env || !me.platform) return
				me.login[me.env][me.platform] = status
			},
			handleSubmit: function() {
				var me = this
				me.$refs['formValidate'].validate(function(v) {
					if (!me.formValidate.url) {
						return VUE.$Message.warning('该环境下的 ' + me.platform.toUpperCase() + ' 平台未配置!')
					}
					if (v) {
						me.spinShow = true
						WD.http.post(API[me.env], VUE.formValidate, function(o) {
							VUE.$Message.success(o.message)
							window.open(o.data, '_blank')
							me.spinShow = false
						}, function(err) {
							VUE.$Message.warning(err.message)
							me.spinShow = false
						});
					} else {
						me.spinShow = false
						VUE.$Message.error('表单验证失败!')
					}
				})
			}
		},
		mounted: function() {
			toUrl(this)
		}
	}))

	VUE.$Message.config({ top: 100 })


	global.addEventListener('message', function(e) {
		VUE.loginStatus(e.data)
	}, false)

}(this, VM, WD))
