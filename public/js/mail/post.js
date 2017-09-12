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
				env: 'dev',
				to: '',
				from: '',
				to: '',
				opts: {
					title: ''
				}
			},
			ruleValidate: {
				from: [
					{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
				],
				to: [
					{ required: true, message: '邮箱不能为空', trigger: 'blur' },
					{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
				],
				title: [
					{ required: true, message: '邮件标题不能为空', trigger: 'blur' }
				]
			}
		},
		methods: {
			handleSubmit: function() {
				this.$refs['formValidate'].validate(function(v) {
					if (v) {
						WD.http.post('/mail/post', VUE.formValidate, function(o) {
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
