// 时间序列
import formatTime from './date/formatTime';

export default function (Vue) {
	// 注入
	Vue.filter('formatTime', formatTime);
	
}