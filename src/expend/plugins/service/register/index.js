import Api from './api'
import Http from './http'
import Jsonp from './jsonp'

const registerMap = [
  Api,
  Http,
  Jsonp
]
export default {
  install: (serverRegister, serviceConf) => {
    registerMap.map(function (module) {
      module(serverRegister, serviceConf)
    })
  }
}
