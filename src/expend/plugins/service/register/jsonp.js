/**
 * Created by xiyuan on 17-6-4.
 */

import JSONP from '@utils/net/jsonp'

export default function (serverRegister) {
  serverRegister('jsonp', {
    request: function (option, sendData) {
      let api = this
      let url = option.url
      option.data = option.data || {}
      Object.keys(sendData || {}).forEach(function (key) {
        option.data[key] = sendData[key]
      })
      JSONP({
        url: url,
        data: option.data,
        jsonpCallback: option.method || 'callback',
        complete: function (data) {
          let sourceMap
          // 检查返回的状态
          if (this.state) {
            if (arguments.length !== 1) {
              // 检查是否多个jsonp切片
              sourceMap = (this.many ? [].slice.call(arguments) : [[].slice.call(arguments)]).reduce(function (map, source) {
                map[source[0]] = source[1]
                return map
              }, {})
              api.success(sourceMap)
            } else {
              api.success(data)
            }
          } else {
            api.error()
          }
          api.receive(sourceMap || data)
        }
      })
    },
    filter: {
      success: function (res, option) {
        return res
      },
      error: function (res, option) {
        return res
      },
      receive: function (res, option) {
        return res
      }
    },
    config: {
      header: {
        // 'Device-Type':'mobile',
        // 'X-XSRF-TOKEN':getCookie('XSRF-TOKEN'),
        // 'X-Requested-With':'XMLHttpRequest'
      },
      timeout: 600,
      dataType: 'json'
    }
  })
}
