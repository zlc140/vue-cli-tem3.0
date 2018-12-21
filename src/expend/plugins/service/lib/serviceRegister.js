/**
 * 服务注册
 * Created by xiyuan on 17-6-4.
 */
import serviceComm from './serviceComm'

export default (serverType, option) => {
  serviceComm.serviceStorage[serverType] = option
}
