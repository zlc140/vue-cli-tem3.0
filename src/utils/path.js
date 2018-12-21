/**
 * 路径处理
 * Created by xiyuan on 17-3-7.
 */
'use strict'

import URL from './url'

/**
 * 获取文件路径
 * @param path
 */
function dirname(path) {
  return path.match(/[^?#]*\//)[0];
}

const DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//;

// 当前项目入口地址
const cwd = (!location.href || location.href.indexOf('about:') === 0) ? '' : dirname(location.href);

/**
 * 规范化路径
 * @param path
 * @returns {*}
 */
function normalize(path) {
  path = path.replace(/\\/g, '/').replace(/\/\.\//g, '/');
  path = path.replace(/([^:/])\/+\//g, '$1/');
  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, '/');
  }
  return path;
}

/**
 * 绝对路径
 * @param path
 * @param url
 */
function resolve(path, url) {
  if (url === void 0) {
    url = undefined;
  }
  path = path.replace(/\\/g, '/');
  let [host, protocol, paths] = [undefined, undefined, path.match(/^(\w+:)?\/\/(\w[\w.]*(:\d+)?)/)];
  if (paths) {
    protocol = paths[1];
    host = paths[2];
  }
  if (url) {
    if (paths) {
      if (!protocol) {
        path = URL.protocol(url) + host;
      }
    } else {
      if (path.charAt(0) === '/') {
        path = URL.domain(url) + path;
      } else {
        url = resolve(url);
        path = dirname(url) + path;
      }
    }
  } else {
    if (paths) {
      if (!protocol) {
        path = window.location.protocol + host;
      }
    } else {
      if (path.charAt(0) === '/') {
        path = URL.domain() + path;
      } else {
        path = dirname(window.location.href) + path;
      }
    }
  }
  return normalize(path);
}

/**
 * 获取路径中的文件名
 * @param path
 * @returns {string}
 */
function fileName(path) {
  let res = path.match(/^[\S]+\/([^\s/]+)$/);
  return res ? res[1] : '';
}

/**
 * 获取路径中的文件
 * @param path
 * @returns {string}
 */
function file(path) {
  let res = path.match(/^[\S]+\/([^\s./]+)[^\s/]*$/);
  return res ? res[1] : '';
}

/**
 * 获取路径中的文件后缀
 * @param path
 * @returns {string}
 */
function suffix(path) {
  let res = path.match(/\.[^./]*$/);
  return res ? res[0] : '';
}

/**
 * 获取去除后缀路径
 * @param path
 * @returns {string}
 */
function noSuffix(path) {
  let res = path.match(/[^?#]*\/[^./]*/);
  return res ? res[0] : '';
}

export default {
  cwd: cwd,
  dirname: dirname,
  normalize: normalize,
  resolve: resolve,
  fileName: fileName,
  file: file,
  suffix: suffix,
  noSuffix: noSuffix
}
