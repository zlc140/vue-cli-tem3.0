// service 库
import servicePluginsFn from './lib'
// service 配置
import serviceConf from '@config/service'

/**
 * 数据服务器插件
 * @param Vue
 * @param  serviceConf
 */
export default function (Vue) {
  // service 插件初始化
  let servicePlugins = servicePluginsFn(serviceConf);
  // 添加service全局方法
  Vue.$service = servicePlugins;
  // 添加service实例方法
  Vue.prototype.$service = servicePlugins;
}
