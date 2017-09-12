(function(global, VM, WD) {
	var API = '/user/getUserList'
	var POS = {
		bg: [116.404, 39.915],
		sh: [121.479, 31.235],
		gz: [113.269, 23.137],
		sz: [114.061, 22.552]
	}

	global.VUE = new Vue(WD.extend(VM, {
		data: {
			city: 'sh',
			pos: {
				lng: POS.sh[0],
				lat: POS.sh[1]
			},
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
			},
			map: null,
			list: []
		},
		methods: {
			init: function() {
				
			},
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
			},
			getList: function() {
				var me = this
				WD.http.get('/s/list', this.pos, function(o) {
					o = o.resultData
					me.list = o || []
					console.log(o)
					me.bdm(me.list)
					VUE.$Message.success('获取成功!')
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			// MAP API功能
			bdm: function(list) {
				function showInfo(e){
					alert(e.point.lng + ', ' + e.point.lat)
				}
				var me = this,
					map = me.map = new BMap.Map('allmap')		// 创建Map实例
				map.clearOverlays()

				for(var i = 0; i < list.length; i++){
					var li = list[i]
					var marker = new BMap.Marker(new BMap.Point(li.longitude, li.latitude))
					map.addOverlay(marker)
					var label = new BMap.Label(i)
					label.setStyle({
						// width:       '40px',
						height :     '30px',
						lineHeight:  '20px',
						color :      '#fff',
						border:      0,
						background:  'none',
						fontSize :   '12px',
						textAlign:   'center',
						fontFamily:  '微软雅黑'
					})
					marker.setLabel(label)
					me.addClickHandler(li.name, marker, li)
				}
				map.centerAndZoom(new BMap.Point(POS[me.city][0], POS[me.city][1]), 12)

				// map.removeEventListener('click', showInfo)
				// map.addEventListener('click', showInfo)
			},
			addClickHandler: function(content, marker, data) {
				var me = this
				marker.addEventListener('click', function(e){
					me.openInfo(content, e, data)
				})
			},
			openInfo: function(content, e, o) {
				var me         = this,
					p          = e.target,
					point      = new BMap.Point(p.getPosition().lng, p.getPosition().lat),
					infoWindow = new BMap.InfoWindow(content, {
						width : 250,		// 信息窗口宽度
						height: 80,			// 信息窗口高度
						title : '信息窗口',	// 信息窗口标题
						enableMessage: true	//设置允许信息窗发送短息
					})		// 创建信息窗口对象
				me.map.openInfoWindow(infoWindow, point)	//开启信息窗口
			},
			sign: function(o) {
				if (confirm('确认签到吗?')) {
					var me  = this,
						opt = {
							id: o.id,
							longitude: o.longitude,
							latitude:  o.latitude
						}
					WD.http.post('/s/sign', opt, function(o) {
						console.log(o)
						VUE.$Message.success(o.resultMsg)
					}, function(err) {
						VUE.$Message.warning(err.message)
					})
				}
			}
		},
		watch: {
			city: function(v) {
				var me = this,
					p  = POS[v]
				me.pos.lng = p[0]
				me.pos.lat = p[1]
				me.getList()
			}
		},
		mounted: function() {
			this.getList()
		}
	}))

	VUE.$Message.config({ top: 100 })


}(this, this.VM, this.WD))
