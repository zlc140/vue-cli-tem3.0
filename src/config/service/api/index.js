// API接口字典
import map from './map/index';

import main_dev from './main_development';
import main_pro from './main_production';

const apiConf = {
  map
};

// 环境配置
/*import('./main_' + process.env.NODE_ENV).then(function (res) {
  const envConf = res.default
  Object.keys(envConf).forEach(function (key) {
    apiConf[key] = envConf[key];
  });
});*/

const envConf = process.env.NODE_ENV === 'development' ? main_dev : main_pro;

Object.keys(envConf).forEach(function (key) {
  apiConf[key] = envConf[key];
});


export default apiConf;
