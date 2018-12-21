/**
 * Created by xiyuan on 17-6-4.
 */
import URL from '@utils/url'

export default (serverRegister) => {
  serverRegister('http', {
    request: function (option, sendData) {
      let api = this
      let url = option.url
      option.data = option.data || {}
      option.type = option.method || option.type
      Object.keys(sendData || {}).forEach(function (key) {
        option.data[key] = sendData[key]
      })
      sendData = option.data
      // 是否同步请求
      option.async = option.async === undefined || option.async
      // 请求类型
      option.type = (new RegExp(option.type, 'ig').exec('GET,DELETE,POST,PUT,HEAD,FORM').toString() || 'GET')
      let xhr = api.xhr = option.xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function () {
        // 前置请求
        if (typeof option.beforeSend === 'function') {
          option.beforeSend.call(xhr, option)
        }
        // 请求状态判断
        if (xhr.readyState === 4) {
          let res
          if (xhr.status === 200) {
            switch (option.dataType || 'json') {
              case 'html':
                res = xhr.responseText
                break
              case 'xml':
                res = xhr.responseXML
                break
              case 'json':
                res = JSON.parse(xhr.responseText)
                break
              default:
                res = xhr.response || xhr.responseText
            }
            api.success(res, xhr)
          } else {
            api.error()
          }
          api.receive(res, xhr)
        }
      }
      // 请求类型
      switch (option.type) {
        case 'POST':
          break
        case 'GET':
          url = URL.computedUrl(url, option.data)
          break
        case 'DELETE':
          break
        case 'PUT':
          break
        case 'HEAD':
          break
      }
      xhr.open(option.type, url, option.async)
      // 上传进度后回调
      let uploadprogress = option.uploadprogress || option.uploadProgress
      if (typeof uploadprogress === 'function') {
        xhr.upload.onprogress = uploadprogress
      }
      // 资源返回进度回调
      if (typeof option.progress === 'function') {
        xhr.onprogress = option.progress
      }
      switch (option.type) {
        case 'POST':
          break
        case 'FORM':
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8')
          break
        case 'GET':
          // 判断请求是否需要设置content-type(主要处理zip压缩)
          // (typeof option.preset === "function" && option.preset.type) || xhr.setRequestHeader('Content-type','application/text/html;charset=utf-8');
          break
        case 'DELETE':
          break
        case 'PUT':
          break
        case 'HEAD':
          break
      }
      // 预设
      typeof option.preset === 'function' && option.preset(xhr)
      // ajax请求缓存
      if (option.cache !== undefined && !option.cache) {
        xhr.setRequestHeader('Cache-Control', 'no-cache')
        xhr.setRequestHeader('If-Modified-Since', '0')
      }
      // 设置请求头
      Object.keys(option.header || {}).forEach(function (key) {
        xhr.setRequestHeader(key, option.header[key])
      })
      xhr.send(JSON.stringify(sendData))
      return xhr
    },
    filter: {
      request: function (option) {
      },
      success: function (res, option) {
        // 检查数据是否存在
        if (!res) {
          this.error({
            data: null,
            message: '接口异常!',
            state: 0
          })
          // 检查数据状态
        } else if (res.status !== 200) {
          this.error(res)
        } else {
          return res.data
        }
      },
      error: function (res, option) {
        return res
      },
      receive: function (res, option) {
      }
    },
    config: {
      header: {
        // 'Device-Type':'mobile',
        // 'X-XSRF-TOKEN':getCookie('XSRF-TOKEN'),
        // 'X-Requested-With':'XMLHttpRequest'
      },
      timeout: 600,
      method: 'post',
      dataType: 'json'
    },
    stop: function (option) {
      // 停止当前请求
      option.xhr.abort()
    }
  })
}
