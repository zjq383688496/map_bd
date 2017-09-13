(function(global, VM, WD) {
	var API = '/user/getUserList'

	global.VUE = new Vue(WD.extend(VM, {
		data: {
			modal: false,
			storeInfo: {},
			prov: [],		// 省份列表
			provId: null,
			pos: {
				lng: '',
				lat: ''
			},
			map: null,
			list: []
		},
		methods: {
			getWprov: function(me) {
				$.getJSON('/s/wprov?callback=?', function(o) {
					me.prov = o.resultData
				})
			},
			getList: function(me) {
				WD.http.get('/s/list', { id: me.provId }, function(o) {
					o = o.resultData
					me.list = o || []
					console.log(o)
					if (me.list.length) me.bdm(me.list)
					VUE.$Message.success('获取成功!')
				}, function(err) {
					VUE.$Message.warning(err.message)
				})
			},
			// MAP API功能
			bdm: function(list) {
				var me = this,
					zoom = me.map? me.map.getZoom(): 13,
					map  = me.map = new BMap.Map('allmap')		// 创建Map实例

				map.clearOverlays()
				map.centerAndZoom(new BMap.Point(list[0].longitude, list[0].latitude), zoom)
				map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }))

				for(var i = 0; i < list.length; i++){
					var li = list[i]
					var marker = new BMap.Marker(new BMap.Point(li.longitude, li.latitude))
					map.addOverlay(marker)
					var label = new BMap.Label(i+1)
					label.setStyle({
						color: '#fff',
						backgroundImage: 'none',
						border: 'none',
						backgroundColor: 'transparent',
						marginTop: '1px',
						marginLeft: '1px'
					})
					var content = '<div style=\"font-size:14px;\">'+li.name+'<br>地址：'+li.address+'</div>'
					marker.setLabel(label)
					me.addClickHandler(content, marker, li)
				}

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
						height: 100,		// 信息窗口高度
						title : '店铺介绍',	// 信息窗口标题
						enableMessage: true	//设置允许信息窗发送短息
					})		// 创建信息窗口对象
				me.map.openInfoWindow(infoWindow, point)	//开启信息窗口
			},
			sign: function(o) {
				var me = this
				if (confirm('确认签到吗?')) {
					var opt = {
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
				me.pos.lng = e.point.lng
				me.pos.lat = e.point.lat
			},
			imgPrev: function(o) {
				this.storeInfo = o
				this.modal = true
			}
		},
		watch: {
			prov: function(v) {
				if (v.length) {
					this.provId = v[0].id
				}
			},
			provId: function(v) {
				this.getList(this)
			}
		},
		mounted: function() {
			this.getWprov(this)
		}
	}))

	VUE.$Message.config({ top: 100 })


}(this, this.VM, this.WD))
