/**
 * Created by xiyuan on 17-6-4.
 */
import URL from '@utils/url'
import PATH from '@utils/path'
import userStore from '@comm/store/user/userInfo.store'
import MD5 from 'md5';

import Router from '@plugins/router'

// 路径字典
let API_URL_MAP = null;

function sortBy(a, b) {
  let A = a.trim().toUpperCase();
  let B = b.trim().toUpperCase();
  if (A > B) {
    return 1;
  }
  if (A < B) {
    return -1
  }
  return 0
}

// 缓存时间 ms
const cacheTime = 1000;

// 接口数据缓存
const apiStorage = {};

export default (serverRegister, serviceConf) => {
  // 当前服务配置
  const CONFIG = serviceConf.rules['api'];
  // 服务注册
  serverRegister('api', {
    request: function (option, sendData) {
      let api = this;
      let url = option.url;
      option.data = option.data ? option.data : (sendData instanceof Array ? [] : {});
      let keyLists = [];
      let str = ''
      
      Object.keys(sendData || {}).forEach(function (key) {
        // 对空值进行拦截
        if (sendData[key] === null) {
          delete sendData[key];
          delete option.data[key];
          return
        }
        
        option.data[key] = sendData[key];
        keyLists.push(key);
      });
      //key值通过字母排序
      keyLists.sort(sortBy);
      keyLists.forEach(function (key, index) {
        str += (key + '=' + sendData[key] + '&');
      });
      str += 'B727A792521E373FA6D7F1F331B77EBC';
      let md5SendData = MD5(str);
      option.header['signValue'] = md5SendData;
      
      sendData = option.data;
      // 是否同步请求
      option.async = option.async === undefined || option.async;
      // 请求类型
      option.type = (new RegExp(option.type, 'ig').exec('GET,DELETE,POST,PUT,HEAD,FORM,FORMDATA,PATCH') || '').toString() || 'GET';
      //option.type = String((new RegExp(option.type, 'ig').exec('GET,DELETE,POST,PUT,HEAD,FORM,FORMDATA,PATCH') || '')|| 'GET').toLocaleUpperCase();
      // ajax请求实例
      let xhr = api.xhr = option.xhr = new XMLHttpRequest();
      
      xhr.timeout = option.timeout;
      
      // 数据状态监听
      xhr.onreadystatechange = function () {
        let apiDataInfo = null;
        if (option.type === 'GET') {
          // 检查是否有缓存
          apiDataInfo = apiStorage[url]
          if (apiDataInfo.status !== 1) {
            apiDataInfo = null;
          }
        }
        
        // 前置请求
        if (typeof option.beforeSend === 'function') {
          option.beforeSend.call(xhr, option)
        }
        // 请求状态判断
        if (xhr.readyState === 4) {
          let res;
          if (xhr.status === 200 || xhr.status >= 500) {
            switch (option.dataType || 'json') {
              case 'html':
                res = xhr.responseText;
                break;
              case 'xml':
                res = xhr.responseXML;
                break;
              case 'json':
                try {
                  res = JSON.parse(xhr.responseText);
                }
                catch (e) {
                }
                break;
              default:
                res = xhr.response || xhr.responseText
            }
            if (apiDataInfo) {
              apiDataInfo.xhr = xhr;
              apiDataInfo.status = 2;
              apiDataInfo.result = res;
              apiDataInfo.callbackFns.success.forEach(info => info.fn.bind(info.instance)(res, xhr))
            } else {
              api.success(res, xhr);
            }
          } else {
            if (apiDataInfo) {
              apiDataInfo.status = 4;
              apiDataInfo.callbackFns.error.forEach(info => info.fn.bind(info.instance)(res, xhr))
            } else {
              api.error(null, xhr);
            }
          }
          apiDataInfo ? apiDataInfo.callbackFns.receive.forEach(info => info.fn.bind(info.instance)(res, xhr)) : api.receive(res, xhr);
        }
      };
      
      let requestType = option.type;
      // 请求类型
      switch (option.type) {
        case 'POST':
          break;
        case 'FORM':
        case 'FORMDATA':
          requestType = 'POST';
          break;
        case 'DELETE':
        case 'GET':
          sendData = URL.objectToUrl(option.data);
          url = URL.computedUrl(url, option.data);
          break;
        case 'PUT':
          break;
        case 'HEAD':
          break
      }
      
      // 此处需启用缓存处理
      if (option.type === 'GET') {
        // 检查是否有缓存
        let apiDataInfo = apiStorage[url]
        if (apiDataInfo) {
          // 进行状态检查
          if (apiDataInfo.status === 1) {
            apiDataInfo.callbackFns.error.push({
              instance: api,
              fn: api.error
            });
            apiDataInfo.callbackFns.success.push({
              instance: api,
              fn: api.success
            });
            apiDataInfo.callbackFns.receive.push({
              instance: api,
              fn: api.receive
            });
            return;
            // 检查是否在缓存有效期内
          } else if (apiDataInfo.status === 2 && (Date.now() - apiDataInfo.startTime < cacheTime)) {
            api.success(apiDataInfo.result, apiDataInfo.xhr);
            api.receive(apiDataInfo.result, apiDataInfo.xhr);
            return;
          }
        }
        apiStorage[url] = {
          startTime: Date.now(),
          status: 1,
          instance: api,
          xhr: null,
          result: null,
          callbackFns: {
            error: [{
              instance: api,
              fn: api.error
            }],
            success: [{
              instance: api,
              fn: api.success
            }],
            receive: [{
              instance: api,
              fn: api.receive
            }],
          }
        }
      }
      
      // 打开资源请求
      xhr.open(requestType, url, option.async);
      // 上传进度后回调
      let uploadprogress = option.uploadprogress || option.uploadProgress
      if (uploadprogress) {
        xhr.upload.onprogress = uploadprogress
      }
      // 资源返回进度回调
      if (typeof option.progress === 'function') {
        xhr.onprogress = option.progress
      }
      
      switch (option.type) {
        case 'POST':
        case 'PATCH':
          sendData = JSON.stringify(sendData);
          // 检查数据请求类型
          switch (option.dataType || 'json') {
            case 'json':
              xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8');
              break;
          }
          break;
        case 'FORM':
          sendData = URL.objectToUrl(sendData);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
          break;
        case 'FORMDATA':
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
          sendData = new FormData();
          if (option.data) {
            Object.keys(option.data).map(key => {
              sendData.append(key, option.data[key]);
            });
          }
          break;
        case 'GET':
          // 判断请求是否需要设置content-type(主要处理zip压缩)
          // (typeof option.preset === "function" && option.preset.type) || xhr.setRequestHeader('Content-type','application/text/html;charset=utf-8');
          break;
        case 'DELETE':
          break;
        case 'PUT':
          break;
        case 'HEAD':
          break
      }
      // 预设
      typeof option.preset === 'function' && option.preset(xhr);
      // ajax请求缓存
      if (option.cache !== undefined && !option.cache) {
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('If-Modified-Since', '0');
      }
      // 设置请求头
      Object.keys(option.header || {}).forEach(function (key) {
        xhr.setRequestHeader(key, option.header[key])
      });
      // 请求数据发起
      xhr.send(sendData);
      return xhr
    },
    filter: {
      request: function (option) {
        // 获取api 字典
        if (!API_URL_MAP) {
          API_URL_MAP = CONFIG.map || {};
        }
        
        const customOption = API_URL_MAP[option.url];
        let customUrl = customOption || option.url;
        // 获取缓存中的地址
        let host = CONFIG.host || '';
        let gateway = typeof option.gateway === 'undefined' ? (CONFIG.gateway || '') : option.gateway;
        
        // 检查是否个性化配置
        if (typeof customOption === 'object') {
          customUrl = customOption.url;
          Object.assign(option, customOption);
        }
        
        // 检查是否有自定义配置
        if (this.customConf) {
          Object.assign(option, this.customConf)
        }
        
        // 检查是否启用token
        if (option.isToken === undefined || option.isToken) {
          // 用户登陆令牌
          let token = userStore.getters.token;
          // 检查token是否再内存中
          if (!token) {
            userStore.commit('getToken')
            token = sessionStorage.getItem('__user_token')
          }
          // 添加token标识
          //option.header['token'] = token;
          option.header['backSessionId'] = token;
          //option.header['sessionId'] = token;
        }
        
        // 兼容 默认不填写协议
        if (host && !host.match(/(\w+:)\/\//)) {
          host = 'http://' + host
        }
        // 兼容 默认不填写 api的网关路径
        if (!host.match(new RegExp(gateway + '[/]?$'))) {
          host += '/' + gateway
        }
        
        // 规范请求的地址
        option.url = PATH.resolve(customUrl.replace(/^\//, ''), host + '/');
        
        const customParameters = option.$customParameters;
        // 检查自定义配置
        if (customParameters) {
          // 路径变量处理
          option.url = option.url.replace(/{\s*([^}]+?)\s*}/g, function (str, $1) {
            if (customParameters[$1]) {
              return customParameters[$1];
            } else {
              return '';
            }
          })
        }
      },
      success: function (res, xhr) {
        // 检查数据是否存在
        if (!res) {
          this.error('接口异常!')
          //检查数据状态
        } else if (xhr.response || xhr.dataType == 'html') {
          return res;
        } else if (res.errCode !== '00') {
          
          // 检查登陆是否过期
          if (res.errCode == '30013') {
            alert("登陆过期或未登录!")
            Router.Instance.push({path: '/login'})
          }
          
          this.error(res.errMsg, xhr);
        } else {
          return res.data || '';
        }
      },
      error: function (res, xhr) {
        let err = ''
        if (xhr) {
          try {
            err = JSON.parse(xhr.xhr.responseText).message;
          }
          catch (e) {
            err = null
          }
        }
        return res || err || '接口异常!';
      },
      receive: function (res, xhr) {
        return res;
      }
    },
    config: {
      header: {
        // 'Device-Type':'mobile',
        // 'X-XSRF-TOKEN':getCookie('XSRF-TOKEN'),
        // 'X-Requested-With':'XMLHttpRequest'
      },
      timeout: 200000,
      method: 'post',
      dataType: 'json'
    },
    stop: function (option) {
      // 停止当前请求
      option.xhr.abort()
    }
  })
}
