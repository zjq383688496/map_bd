(function(global, VM, WD) {
	var API = '/user/getUserList'
	var POS = {
		bg: [116.404, 39.915],	// 北京
		sh: [121.479, 31.235],	// 上海
		gz: [113.269, 23.137],	// 广州
		sz: [114.061, 22.552],	// 深圳
		wh: [114.310, 30.600],	// 武汉
		cq: [106.556, 29.570],	// 重启
		cd: [104.073, 30.668],	// 成都
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
				var me = this,
					map = me.map = new BMap.Map('allmap')		// 创建Map实例
				map.clearOverlays()

				map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}))

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
				map.centerAndZoom(new BMap.Point(me.pos.lng, me.pos.lat), map.getZoom() < 4? 12: map.getZoom())

				map.removeEventListener('click', me.showInfo)
				map.addEventListener('click', me.showInfo)
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
			},
			showInfo: function(e) {
				var me = this
				// alert(e.point.lng + ', ' + e.point.lat)
				me.pos.lng = e.point.lng
				me.pos.lat = e.point.lat
				me.getList()
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
