/**
 * 网址处理
 * Created by xiyuan on 17-3-7.
 */
'use strict'
/* url编码 */
const encode = window ? window.encodeURIComponent : encodeURIComponent

/* 获取url的hash */
function hash(url) {
	if (typeof url === 'string') {
		window.location.hash = encodeURI(url);
	}
	return window.location.hash.replace(/^#/, '');
}

/* 获取url地址 */
function url(url) {
	if (typeof url === 'string') {
		window.location.href = url;
	}
	return window.location.href;
}

/* 设置或返回主机名和当前 URL 的端口号 */
function host(url) {
	if (typeof url === 'string') {
		if (url = url.match(/^(\w+:)?\/\/(\w[\w.]*(:\d+)?)/)) {
			return url[2];
		}
	}
	return window.location.host;
}

/* 设置或返回当前 URL 的主机名 */
function hostName(url) {
	if (typeof url === 'string') {
		if (url = url.match(/^(\w+:)?\/\/(\w[\w.]*)/)) {
			return url[2];
		}
	}
	return window.location.hostname;
}

/**
 * domain name
 * @param url
 * @returns {string}
 */
function domain(url) {
	if (url === void 0) {
		url = undefined;
	}
	if (typeof url === 'string') {
		if (url = url.match(/^(\w+:)?\/\/(\w[\w.]*(:\d+)?)/)){
			return (url[1] ? url[1] : window.location.protocol) + '//' + url[2];
		}
	}
	return window.location.protocol + '//' + window.location.host;
}

/* 设置或返回当前 URL 的端口号 */
function port(url) {
	if (typeof url === 'string') {
		if (url = url.match(/^(\w+:)?\/\/(\w[\w.]*(:(\d+))?)/)){
			return url[4] || 80
		}
	}
	return window.location.port
}

/* 设置或返回当前 URL 的协议 */
function protocol(url) {
	if (typeof url === 'string') {
		if (url = url.match(/^\w+:/)){
			return url[0]
		}
	}
	return window.location.protocol
}

/* 合并数据到url参数中 */
function computedUrl(url, data) {
	let hash
	let normal
	let hashIndex = url.indexOf('#')
	let dataUrl = objectToUrl(data)
	if (hashIndex < 0) {
		normal = url
		hash = ''
	} else {
		normal = url.slice(0, hashIndex)
		hash = url.slice(hashIndex)
	}
	normal += dataUrl ? (normal.indexOf('?') < 0 ? '?' : '&') : '';
	return normal + dataUrl + hash
};

/* 把对象转换成url参数 */
function objectToUrl(obj) {
	let value;
	let data = [];
	if (typeof obj === 'object') {
		Object.keys(obj).forEach(function (key) {
			value = obj[key];
			if (typeof value === 'object' && value !== null) {
				Object.keys(value).forEach(function (i) {
					data.push(encode(key) + '=' + encode(value[i]));
				});
			} else {
				data.push(encode(key) + '=' + encode(value));
			}
		});
	} else {
		data.push(obj);
	}
	return data.join('&');
}

/* 转换URL参数为object */
function toObject(str, toggle) {
	let _str = str;
	let result = {};
	let index = str.indexOf('?') + 1;
	let hashIndex = str.indexOf('#');
	if (index) {
		// 检查hash是否存在,并且检查sercha是否在hash前面
		if (hashIndex > index) {
			str = str.substring(index, hashIndex);
			// 判断是否开启合并hash中的参数
			if (toggle) {
				_str = _str.substring(hashIndex);
				index = _str.indexOf('?') + 1;
				index && (str = str + '&' + _str.substring(index));
			}
			// 检查hash是否存在
		} else if ((toggle && hashIndex < index) || hashIndex === -1) {
			str = str.substring(index);
		}
		let key = ~0;
		let arr = str.split('&');
		let l = arr.length;
		while (++key < l) {
			let value = arr[key].split('=');
			// 修复多个重名表单name值
			let nameKey = decodeURIComponent(value[0]);
			let nameValue = decodeURIComponent(value[1]);
			let nameValues = result[nameKey];
			switch (typeof nameValues) {
				case 'object':
					result[nameKey].push(nameValue);
					break;
				case 'string':
					result[nameKey] = [nameValues, nameValue];
					break;
				default:
					result[nameKey] = nameValue;
			}
		}
	}
	return result;
}

export default {
	hash: hash,
	url: url,
	host: host,
	domain: domain,
	hostName: hostName,
	port: port,
	protocol: protocol,
	computedUrl: computedUrl,
	objectToUrl: objectToUrl,
	toObject: toObject
}
