import PATH from '@utils/path'

// 视图App引入
const viewImport = ruleConf => () => {
  const source = import('@app/' + ruleConf.sourcePath + '.vue');
  // 获取视图内部数据
  source.then(res => {
    res = res.default;
    // 检查页面是否定义名称
    if (!res.name) {
      res.name = (ruleConf.name || /*ruleConf.path ||*/ ruleConf.sourcePath).replace(/\/(\w)/g, function (str, $1) {
        return $1.toUpperCase();
      })
    }
    if (!ruleConf.name) {
      ruleConf.name = res.name
    }
    return res;
  });

  return source
};

// 递归获取 视图内容
function Recursion(RouterRules, routeData, newRouterRules, rootPath) {
  rootPath = rootPath || '';
  routeData = routeData || [];
  newRouterRules = newRouterRules || [];
  RouterRules.forEach(function (ruleConf) {
    //路由路径
    ruleConf.realPath = PATH.normalize(rootPath + '/' + (ruleConf.path || '')).replace(/^\/\//, '/').replace(/\/$/, '');

    let newRuleConf = Object.assign({}, ruleConf);
    let routeItemList = [];
    let routeInfo = {
      title: ruleConf.title,
      icon: ruleConf.icon || '',
      path: ruleConf.realPath,
    };
    routeData.push(routeInfo);
    if (Array.isArray(newRuleConf.children)) routeInfo.list = routeItemList;

    // 检查是否存在资源路径
    if (1 && typeof newRuleConf.sourcePath === 'string') {
      newRuleConf.component = viewImport(newRuleConf);

      // 初始化路由元信息
      if (typeof newRuleConf.meta === 'undefined') {
        newRuleConf.meta = {}
      }

      // 检查是否开启缓存
      newRuleConf.meta._$cache$_ = !!newRuleConf.cache/* !== false*/;
      // newRuleConf.meta._$cache$_ = false;
      newRuleConf.meta._$title$_ = ruleConf.title;

      if (newRuleConf.sibling) {
        Recursion(newRuleConf.children, routeItemList, newRouterRules, rootPath)
      } else
      // 检查是否拥有子路由
      if (Array.isArray(newRuleConf.children)) {
        newRuleConf.children = Recursion(newRuleConf.children, routeItemList, [], ruleConf.realPath)
      }
      newRouterRules.push(newRuleConf)
    } else {
      // 检查是否拥有子路由
      if (Array.isArray(newRuleConf.children)) {
        Recursion(newRuleConf.children, routeItemList, newRouterRules, ruleConf.realPath)
        //检查是否重定向
      } else if (newRuleConf.redirect) {
        newRouterRules.push(newRuleConf)
      }
    }

  });
  return newRouterRules;
}

export default function (RouterRules) {
  let a = [];
  let resRouteData = Recursion(RouterRules, a);
  // 递归处理路由配置
  // console.log(JSON.stringify(RouterRules));
  return resRouteData;
}
