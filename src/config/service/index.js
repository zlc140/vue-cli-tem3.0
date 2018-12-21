// api服务配置
import api from './api'
// http服务配置
// import http from './http'

export default {
  // 默认启用的service请求规则
  ruleType: 'api',
  // service规则
  rules: {
    api,
    // http
  }
}
