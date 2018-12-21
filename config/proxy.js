
// 代理各种网关资源链接
const proxyModeUrl = {
	"tesb": 'http://erp.tesb.lovego.xin',
	"tesm": 'http://erp.tesm.lovego.xin',
	"lovego": 'http://erp.lovego.com',
};

// 代理配置
const proxyConf = {
	// 会员中心
	'/user/': {
		'^/user/': '/lovego/user/'
	},
};

// 本地个性化配置
const localModeUrl = {
	'/users/': {
		target: 'http://192.168.2.61:9002',
		pathRewrite: {
			'^/users/': '/users/',
		}
	}
};
/******************************************************* 下面代码禁止修改 ******************************************************************************/

const DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;

/**
 * 规范化路径
 * @param path
 * @returns {*}
 */
function normalize(path) {
	path = path.replace(/\\/g, '/').replace(/\/\.\//g, '/');
	path = path.replace(/([^:/])\/+\//g, '$1/');
	while (path.match(DOUBLE_DOT_RE)) {
		path = path.replace(DOUBLE_DOT_RE, '/');
	}
	return path;
}

// 根据不同网关配置生成最终的代理配置
module.exports = Object.keys(proxyModeUrl).reduce((map, gateway) => {
	
	Object.keys(proxyConf).forEach(key => {
		let pathRewrite = proxyConf[key];
		let urlKey = normalize('/' + gateway + '/' + key);
		
		// 代理配置生成
		map[urlKey] = {
			changeOrigin: true,  //是否跨域
			target: proxyModeUrl[gateway],
			pathRewrite: typeof pathRewrite === 'object' ? Object.keys(pathRewrite).reduce((pathMap, path) => {
				pathMap[normalize(path.match(/^\^\//) ? '^/' + gateway + '/' + path.replace(/^\^\//, '') : '/' + gateway + path)] = pathRewrite[path];
				return pathMap;
			}, {}) : {[normalize('^/' + urlKey)]: pathRewrite}
		};
	});
	
	// 支持本地自定义配置
	Object.keys(localModeUrl).forEach((key) => {
		let info = localModeUrl[key];
		map[key] = {
			changeOrigin: true,  //是否跨域
			target: info.target,
			pathRewrite: info.pathRewrite,
		}
	});
	
	return map;
}, {});
