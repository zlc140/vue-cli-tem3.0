// 数据服务类
import ServiceClass from './serviceClass'
import registerComm from '../register'
// 服务注册
import serverRegister from './serviceRegister'

/**
 * service服务提供
 * @param serviceConf
 * @returns {Function}
 */
export default serviceConf => {
  // 服务注册安装
  registerComm.install(serverRegister, serviceConf);
  return (option, ruleType) => new ServiceClass(serviceConf, option, ruleType)
}
