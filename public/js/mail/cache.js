(function(global, VM, WD) {
	var API = '/user/getUserList'

	var validCheck = {
		json: function(rule, val, cb) {
			try {
				JSON.parse(val)
				cb()
			} catch (e) {
				cb(new Error('数据格式不正确'))
			}
		}
	}

	global.VUE = new Vue(WD.extend(VM, {
		data: {
			env: 'dev',
			hash: ' ',
			json: '{}',
			form1: {
				data: '',
				expired: ''
			},
			rule1: {
				data: [
					{ required: true, message: '数据不能为空', trigger: 'blur' },
					{ validator: validCheck.json, trigger: 'blur' }
				],
				expired: [
					{ type: 'string', pattern: /^(0|[1-9][0-9]*)$/, message: '过期时间为数字', trigger: 'blur' }
				]
			},
			form2: {
				key: ''
			},
			rule2: {
				key: [
					{ required: true, message: '密钥不能为空', trigger: 'blur' }
				]
			}
		},
		methods: {
			handleSubmit: function(name) {
				this.$refs[name].validate(function(v) {
					if (v) {
						var da = VUE[name]
						da.env = VUE.env
						da.type = name === 'form1'? 0: 1
						WD.http.post('/mail/cache', da, function(o) {
							if (da.type) {
								VUE.json = JSON.stringify(o.data)
							} else {
								VUE.hash = VUE.form2.key = o.data
							}
							VUE.$Message.success(o.message)
						}, function(err) {
							if (da.type) {
								VUE.json = '{}'
							} else {
								VUE.hash = ' '
							}
							VUE.$Message.warning(err.message)
						});
					} else {
						VUE.$Message.error('表单提交失败!')
					}
				})
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(this, this.VM, this.WD))
