/*
 * @Author: liangzc 
 * @Date: 2017-06-22
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-05-27 17:08:23
 */
import verify from './verify';

// 配置项详见 ./props.js
// 方法详见   ./methods.js

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(verify);
}

export default verify;
