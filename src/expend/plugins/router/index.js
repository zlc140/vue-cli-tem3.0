import Vue from 'vue'
// 路由插件
import Router from 'vue-router'
// 路由规则解析
import rulesParse from './rulesParse'
// 路由规则 配置
import routerConf from '@config/router'

// 启用路由插件
Vue.use(Router);

// 初始化RequestAnimationFrame
initRequestAnimationFrame();

let Instance = new Router({
	mode: 'history',
	routes: rulesParse(routerConf)
});

/**
 * 路由插件封装
 */
function install() {

}

// 返回路由实例
install.Instance = Instance;

export default install;

function initRequestAnimationFrame() {
	var lastTime = 0;
	var prefixes = 'webkit moz ms o'.split(' '); //各浏览器前缀
	
	var requestAnimationFrame = window.requestAnimationFrame;
	var cancelAnimationFrame = window.cancelAnimationFrame;
	
	var prefix;
//通过遍历各浏览器前缀，来得到requestAnimationFrame和cancelAnimationFrame在当前浏览器的实现形式
	for (var i = 0; i < prefixes.length; i++) {
		if (requestAnimationFrame && cancelAnimationFrame) {
			break;
		}
		prefix = prefixes[i];
		requestAnimationFrame = requestAnimationFrame || window[prefix + 'RequestAnimationFrame'];
		cancelAnimationFrame = cancelAnimationFrame || window[prefix + 'CancelAnimationFrame'] || window[prefix + 'CancelRequestAnimationFrame'];
	}

//如果当前浏览器不支持requestAnimationFrame和cancelAnimationFrame，则会退到setTimeout
	if (!requestAnimationFrame || !cancelAnimationFrame) {
		requestAnimationFrame = function (callback) {
			var currTime = new Date().getTime();
			//为了使setTimteout的尽可能的接近每秒60帧的效果
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function () {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
		
		cancelAnimationFrame = function (id) {
			window.clearTimeout(id);
		};
	}

//得到兼容各浏览器的API
	window.requestAnimationFrame = requestAnimationFrame;
	window.cancelAnimationFrame = cancelAnimationFrame;
}
