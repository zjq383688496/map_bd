(function() {
	var aliyun = {
		init: function() {
			var me = this;

			var flag = true;
			$('#submit1').on('click', function() {
				if (!flag) return false;
				flag = false;
				var formData = new FormData(document.querySelector('#form'));
				$('input[type=file]').each(function(i, e) {
					if (!e.files.length) formData.delete(e.name);
				});
				if (me.valid(me)) {
					$.ajax({
						url:  '/saas',
						type: 'POST',
						data: formData,
						// 告诉jQuery不要去处理发送的数据
						processData: false,
						// 告诉jQuery不要去设置Content-Type请求头
						contentType: false,
						beforeSend: function(){
							console.log('正在进行，请稍候');
						},
						success: function(res) {
							if (res.code === '0000') {
								alert(res.message || '成功!');
							} else {
								alert(res.message || '失败!');
							}
							flag = true;
						},
						error: function(res) {
							alert('error');
							flag = true;
						}
					});
				} else {
					flag = true;
				}
			});

			me.color();
			me.imgValid();
		},
		color: function() {
			$('[name=mainColor], [name=darkColor]').minicolors();
		},
		valid: function(cb) {
			var RE = {
				host: /^([^\s\.\/]+\.[^\s]{2,}|localhost)$/i,
				companyId: /^\d+$/,
				email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
			}
			var host = $('[name=host]'),
				hostVal = host.val(),
				companyId = $('[name=companyId]'),
				companyIdVal = companyId.val(),
				email        = $('[name=email]'),
				emailVal     = email.val(),
				password     = $('[name=password]'),
				passwordVal  = password.val(),

				service     = $('[name=service]').val(),

				logo        = $('[name=logo]'),
				userIcon    = $('[name=userIcon]'),
				qrcode      = $('[name=qrcode]'),
				logoLogin   = $('[name=logoLogin]'),
				bannerLogin = $('[name=bannerLogin]'),
				loading     = $('[name=loading]')

			if (true) {}
			if (service) $('[name=mailHost]').val('')
			if (!RE.companyId.test(companyIdVal)) { alert(companyId.attr('err'));   return 0 }
			if (emailVal != '' && !RE.email.test(emailVal)) { alert(email.attr('err'));               return 0 }
			if (!passwordVal) { alert(password.attr('err'));                        return 0 }

			if (logo.data('v')         === false) { alert(logo.attr('err'));        return 0 }
			if (userIcon.data('v')     === false) { alert(userIcon.attr('err'));    return 0 }
			if (qrcode.data('v')       === false) { alert(qrcode.attr('err'));      return 0 }
			if (logoLogin.data('v')    === false) { alert(logoLogin.attr('err'));   return 0 }
			if (bannerLogin.data('v')  === false) { alert(bannerLogin.attr('err')); return 0 }
			if (loading.data('v')      === false) { alert(loading.attr('err'));     return 0 }
			return 1
		},
		imgValid: function() {
			$('input[type=file]').on('change', function() {
				var f = $(this),
					scale  = f.attr('img-scale')-0,
					width  = f.attr('img-width')-0,
					height = f.attr('img-height')-0,
					
					reader = new FileReader(),
					file = f[0].files[0],
					imgUrlBase64 = reader.readAsDataURL(file);
				var isScale = scale? 1: 0;

				f.data('v', false)
				reader.onload = function() {
					var img = document.createElement('img');
					img.src = reader.result;
					f.next('img').attr('src', img.src);
					img.onload = function() {
						var w = img.width,
							h = img.height;
						if (isScale) {
							if (scale === w/h) f.data('v', true)
						} else {
							if(w === width && h === height) f.data('v', true)
						}
					}
				}
			})
		}
	};
	aliyun.init();
}());