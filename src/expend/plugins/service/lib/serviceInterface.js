//服务类
class serviceInterface {
  constructor(innerConf) {
    //实例传递
    innerConf.example = this;
    this.__innerConf__ = innerConf;
    this.customConf = innerConf.customConf;
  }
  
  //数据接收
  receive(...args) {
    let This = this;
    let resData;
    let innerConf = this.__innerConf__;
    let serviceConf = innerConf.serviceConf;
    
    //检查是否有过滤器
    if (typeof serviceConf.filter === 'object' && serviceConf.filter.receive instanceof Function) {
      //执行过滤器
      resData = serviceConf.filter.receive.call(this, args[0], innerConf.option);
      args[0] = resData
    }
    
    innerConf.receive.forEach((fn) => {
      fn.apply(This, args);
    })
  }
  
  //数据请求成功
  success() {
    let This = this;
    let resData;
    let args = [].slice.call(arguments);
    let innerConf = this.__innerConf__;
    let serviceConf = innerConf.serviceConf;
    
    //检查是否有过滤器
    if (typeof serviceConf.filter === 'object' && serviceConf.filter.success instanceof Function) {
      //执行过滤器
      resData = serviceConf.filter.success.call(this, args[0], innerConf.option);
      if (resData === undefined) return
      args[0] = resData
    }
    
    innerConf.success.forEach(fn => {
      fn.apply(This, args);
    })
  }
  
  //数据请求失败
  error(...args) {
    //检查当前是否销毁
    if (!this.__innerConf__) return;
    
    let This = this;
    let resData;
    let innerConf = this.__innerConf__;
    let serviceConf = innerConf.serviceConf;
    
    //检查是否有过滤器
    if (typeof serviceConf.filter === 'object' && serviceConf.filter.error instanceof Function) {
      //执行过滤器
      resData = serviceConf.filter.error.call(this, args[0], innerConf.option);
      args[0] = resData
    }
    
    innerConf.error.forEach((fn) => {
      fn.apply(This, args);
    })
  }
  
}

export default serviceInterface;
