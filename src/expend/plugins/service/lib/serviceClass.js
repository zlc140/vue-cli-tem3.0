import ServiceInterface from './serviceInterface'
import serviceComm from './serviceComm'

/**
 * 数据服务类
 */
class ServiceClass {
  /**
   * 构造函数
   * @param serviceConfig
   * @param option
   * @param ruleType
   */
  constructor(serviceConfig, option, ruleType) {
    let customConf;
    // 检查第一个参数是否字符串
    if (typeof option === 'string') {
      option = {
        url: option
      }
    } else if (typeof option === 'object') {
      // 优先保持自定义配置
      customConf = Object.assign({}, option)
    }
    // 获取服务类型
    this.serviceType = ruleType || option.ruleType || serviceConfig.ruleType || serviceComm.defaultRule;
    // service配置
    const serviceConf = serviceComm.serviceStorage[this.serviceType];
    // 内部配置
    this.__innerConf__ = {
      option: option,
      error: [],
      success: [],
      receive: [],
      customConf: customConf,
      serviceType: this.serviceType,
      serviceConf: serviceConf
    };
    // service实例
    new ServiceInterface(this.__innerConf__);
    
    // 遍历公共配置
    Object.keys(serviceConf.config || {}).forEach(function (key) {
      // 检查内部是否map类型
      if (typeof option[key] === 'object' && typeof serviceConf.config === 'object') {
        Object.keys(serviceConf.config[key]).forEach(function (ckey) {
          option[key][ckey] = serviceConf.config[key][ckey]
        })
      } else {
        option[key] = serviceConf.config[key]
      }
    });
    
    /*// 检查是否有过滤器
    if (typeof serviceConf.filter === 'object' && serviceConf.filter.request instanceof Function) {
      // 执行请求过滤器
      serviceConf.filter.request.call(example, option)
    }*/
  }
  
  /**
   * 错误回调
   * @param fn
   * @returns {ServiceClass}
   */
  error(fn) {
    if (typeof fn !== 'function') {
      return this;
    }
    if (this.__innerConf__.error.indexOf(fn) === -1) {
      this.__innerConf__.error.push(fn)
    }
    return this
  }
  
  /**
   * 成功回调
   * @param fn
   * @returns {ServiceClass}
   */
  success(fn) {
    if (typeof fn !== 'function') {
      return this;
    }
    if (this.__innerConf__.success.indexOf(fn) === -1) {
      this.__innerConf__.success.push(fn)
    }
    return this
  }
  
  // 数据接收
  receive(fn) {
    if (typeof fn !== 'function') {
      return this;
    }
    if (this.__innerConf__.receive.indexOf(fn) === -1) {
      this.__innerConf__.receive.push(fn)
    }
    return this
  }
  
  // 数据请求
  send(data, customParameters) {
    let innerConf = this.__innerConf__;
    const example=innerConf.example;
    const serviceConf=innerConf.serviceConf;
    
    // 自定义参数处理
    if ({}.toString.call(customParameters).match(/object\s+(\w*)/)[1].toLocaleLowerCase() === 'object') {
      innerConf.option.$customParameters = customParameters;
    }
  
    // 检查是否有过滤器
    if (typeof serviceConf.filter === 'object' && serviceConf.filter.request instanceof Function) {
      // 执行请求过滤器
      serviceConf.filter.request.call(example, innerConf.option)
    }
    // 开始请求数据
    innerConf.serviceConf.request.call(innerConf.example, innerConf.option, data)
  }
  
  // 服务销毁
  destroy() {
    let innerConf = this.__innerConf__
    delete this['__innerConf__'];
    // 停止服务
    if (innerConf.serviceConf.stop instanceof Function) {
      innerConf.serviceConf.stop.call(innerConf.example, innerConf.option)
    }
    
    ['error', 'success', 'receive'].forEach(function (key) {
      while (innerConf[key].length) {
        innerConf[key].pop();
      }
    });
    
    ['option', 'example'].forEach(function (key) {
      Object.keys(innerConf[key]).forEach(function (name) {
        delete innerConf[key][name];
      });
    });
    
    Object.keys(innerConf).forEach(function (key) {
      delete innerConf[key];
    })
  }
}

export default ServiceClass
