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
				env: 'd',
				dir: ''
			},
			ruleValidate: {
			}
		},
		methods: {
			handleRemove: function() {
				this.$refs['formValidate'].validate(function(v) {
					WD.http.post('/h5/remove', VUE.formValidate, function(o) {
						VUE.$Message.success('成功!')
					}, function(err) {
						VUE.$Message.warning(err.message)
					});
				})
			}
		}
	}))

	VUE.$Message.config({ top: 100 })

}(this, this.VM, this.WD))
