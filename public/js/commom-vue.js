(function(global) {

if (!global.WD) {
	global.VM = {
		el: '#vApp',
		data: {
		}
	}
	global.WD = {
		http: {
			ajax: function(type, url, data, success, error) {
				var _data, _success, _error
				if (typeof(data)==='function') {
					_data    = {}
					_success = data
					_error   = success
				} else {
					_data    = data
					_success = success
					_error   = error
				}
				$.ajax({
					url: url,
					data: _data,
					type: type,
					success: function(d) {
						if (d.code === '0000') {
							_success && _success(d.data)
						} else {
							_error && _error(d)
						}
					},
					error: function(err) {
						if (typeof(_error)==='function') _error(err)
					}
				})
			},
			get: function(url, data, success, error) {
				this.ajax('get', url, data, success, error)
			},
			post: function(url, data, success, error) {
				this.ajax('post', url, data, success, error)
			}
		},
		__getClass: function(obj) {
			return toString.call(obj).match(/^\[object\s(.*)\]$/)[1]
		},
		// Object继承
		extend: function(org, obj) {
			var me = this
			for (var v in obj) {
				if (!org[v]) {
					org[v] = obj[v]
				} else {
					var typeO = me.__getClass(org[v]),
						typeN = me.__getClass(obj[v])
					if (typeO === typeO && typeO === 'Object') {
						me.extend(org[v], obj[v])
					} else {
						org[v] = obj[v]
					}
				}
			}
			return org
		},
		merge: function(org, now) {
			for (var v in org) {
				if (org[v]) now[v] = org[v]
			}
		}
	}
}

}(this))
