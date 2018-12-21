'use strict'

function getType(value) {
	var type = typeof (value);
	if(type == 'object') {
		type = {}.toString.call(value).toLowerCase().match(/object\s+(html\w+?(element)|(\w+))/);
		type = type[2] || type[1]
	}
	return type
}

/*JSON转字符串*/
function stringify(obj) {
	var type = getType(obj)
	switch (type) {
		case 'null':
			return JSON.stringify(obj);
		case 'function':
			return obj.toString();
		case 'array':
			return `[${obj.map(stringify).join(',')}]`
		default:
			if(typeof obj == 'object') {
				return '{' + Object.keys(obj).map(function(key) {
					return `"${key}":${stringify(obj[key])}`;
				}).join(',') + '}';
			}else {
				return JSON.stringify(obj)
			}
	}
}

/*JSON字符串恢复为json对象*/
function parse(str) {
	let json = str;
	if(typeof (str) === 'object') {
		return str;
	} else {
		try {
			json = new Function("return " + str)()
		}
		catch (e) {
			return str;
		}
		return json;
	}
}

export default {
	stringify: stringify,
	parse: parse
}