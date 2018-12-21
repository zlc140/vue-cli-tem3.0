
export default function(Vue) {
	// 图片错误处理指令
	Vue.directive('errorImg', {
		inserted: function (el) {
			el.addEventListener('error', () => {
				el.src = '';
			})
		}
	});
	
	// 注入
	Vue.directive('focus', {
		// 当被绑定的元素插入到 DOM 中时……
		inserted: function (el) {
			// 聚焦元素
			el.focus()
		}
	});
	
	Vue.directive('nodbClick', {
		inserted(el) {
			el.addEventListener('click', () => {
				if (!el.disabled) {
					el.disabled = true;
					setTimeout(() => {
						el.disabled = false;
					}, 1000)
				}
			})
		}
	});
}