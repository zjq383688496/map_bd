(function(global, VM, WD) {
	var API = '/user/getUserList'

	var validCheck = {
		service: function(rule, val, cb) {
			var service = global.VUE.formValidate.service
			if (!service && !val) {
				cb(new Error('未选择常用邮箱服务时, 邮件服务器不能为空'))
			} else {
				cb()
			}
		}
	}

	global.VUE = new Vue(WD.extend(VM, {
		data: {
			formValidate: {
				name: '',
				env: 'dev',
				service: '',
				email: '',
				host: '',
				port: '',
				pass: ''
			},
			ruleValidate: {
				name: [
					{ required: true, message: '名称不能为空', trigger: 'blur' }
				],
				email: [
					{ required: true, message: '邮箱不能为空', trigger: 'blur' },
					{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
				],
				host: [
					{ type: 'string', pattern: /^([^\s\.\/]+\.[^\s]{2,}|localhost)$/i, message: '邮件服务器格式不正确', trigger: 'blur' },
					{ validator: validCheck.service, trigger: 'blur' }
				],
				port: [
					{ type: 'string', pattern: /^(|\d+)$/i, message: '端口为数字', trigger: 'blur' }
				],
				pass: [
					{ required: true, message: '密码不能为空', trigger: 'blur' }
				]
			}
		},
		methods: {
			handleSubmit: function() {
				this.$refs['formValidate'].validate(function(v) {
					if (v) {
						WD.http.post('/mail/add', VUE.formValidate, function(o) {
							VUE.$Message.success('提交成功!')
						}, function(err) {
							VUE.$Message.warning(err.message)
						});
					} else {
						VUE.$Message.error('表单验证失败!')
					}
				})
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(this, this.VM, this.WD))
