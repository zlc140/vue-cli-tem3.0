import Vue from 'vue'
import Vuex from 'vuex'
// 路由缓存导航数据模型
import routeCacheNav from './routeCacheNav'

// vue状态管理插件
Vue.use(Vuex);

const $store = new Vuex.Store(routeCacheNav);

// 导航缓存方法
const $cacheNav = {
  store: $store,
  add: info => {
    // 添加page缓存白名单
    $store.commit('addRouteName', info)
  },
  remove: name => {
    // 移除page缓存白名单
    $store.commit('removeRouteName', name)
  },
  addLayout: name => {
    // 添加layout缓存白名单
    $store.commit('addLayoutName', name)
  },
  removeLayout: name => {
    // 移除layout缓存白名单
    $store.commit('removeLayoutName', name)
  },
  // 更新权限
  updateAuthority: authorityList => {
    $store.commit('updateAuthority', authorityList)
  },
  getAuthority: () => {
    return $store.state.authority;
  }
};

// 页面操作通讯
let pageAction = {
  /**
   * 类似方法监听器
   * @param pageName 页面名称
   * @param actionName 操作名称
   * @param actionFn 操作回调的方法
   */
  waitAction(pageName, actionName, actionFn) {
    let index = $store.state.cachePageList.indexOf(pageName);
    if (index !== -1) {
      // 存储页面操作信息
      $store.state.cachePageInfoList[index].pageActionStore[actionName] = {
        option: {},
        fn: actionFn
      }
    }
  },
  /**
   * 操作触发
   * @param pageName 页面名称
   * @param actionName 操作名称
   * @param option 触发的自定义参数
   */
  emitAction(pageName, actionName, option) {
    let index = $store.state.cachePageList.indexOf(pageName);

    if (index !== -1) {

      // 获取页面操作信息
      let actionInfo = $store.state.cachePageInfoList[index].pageActionStore[actionName];

      // 调用操作的回调方法
      if (actionInfo) {
        actionInfo.fn(actionInfo.option)
      }

    } else {
      console.warn(pageName + '页面中：' + actionName + '自定义操作不存在')
    }
  }
};

export default $cacheNav;

export let store = $store;

export const install = function (Vue) {
  Vue.$cacheNav = $cacheNav;
  Vue.prototype.$cacheNav = $cacheNav;

  Vue.$pageAction = pageAction;
  Vue.prototype.$pageAction = pageAction;
};
