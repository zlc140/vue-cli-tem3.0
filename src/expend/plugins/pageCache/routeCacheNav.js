// 路由缓存导航数据模型
export default {
  state: {
    // 当前页面name
    nowPageName: '',
    // 页面缓存列表
    cachePageList: [],
    // 页面缓存信息
    cachePageInfoList: [],
    // 页面layout缓存列表
    cacheLayoutList: [],
    // 权限
    authority: []
  },
  getters: {
    // 缓存白名单
    cacheWhiteList: state => {
      // 合并数组并去重
      return Array.from(new Set(state.cachePageList.concat(state.cacheLayoutList))).join(',')
    },
    // 页面tab列表
    pageTabList: state => {
      return state.cachePageInfoList;
    }
  },
  mutations: {
    // 新增缓存页面名称
    addRouteName: (state, info) => {
      state.nowPageName = info.name;
      if (state.cachePageList.indexOf(info.name) === -1) {
        // 初始化页面操作数据容器
        info.pageActionStore = {};

        state.cachePageList.push(info.name);
        state.cachePageInfoList.push(info);
      }
    },
    // 删除缓存页面名称
    removeRouteName: (state, name) => {
      const index = state.cachePageList.indexOf(name);
      if (index !== -1) {
        state.cachePageList.splice(index, 1);
        state.cachePageInfoList.splice(index, 1)
      }
    },
    // 新增缓存页面名称
    addLayoutName: (state, name) => {
      if (state.cacheLayoutList.indexOf(name) === -1) {
        state.cacheLayoutList.push(name)
      }
    },
    // 删除缓存页面名称
    removeLayoutName: (state, name) => {
      const index = state.cacheLayoutList.indexOf(name);
      if (index !== -1) {
        state.cacheLayoutList.splice(index, 1)
      }
    },
    // 更新权限
    updateAuthority(state, authorityList) {
      state.authority = authorityList;
    }
  }
}
