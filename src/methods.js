/*
 * 暴露方法
 * @Author: liangzc 
 * @Date: 2018-05-18 15:33:34 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-05-20 21:48:38
 */
export default {
  /**
   * 接收自定义配置，优先级>全局配置
   */
  '$verify.config': Function,
  /**
   * 手动校验某个字段值
   * @param {String} field vue 绑定字段名
   * @param {Array|Object} rule 校验规则（选填时，校验规则需和v-Mode保持一致）
   * @param {Boolean} validOnly 仅校验，不提示
   */
  '$verify.validate': Function,
  /**
   * 校验所有
   * @param {group} 分组校验(v-verify:group)
   * @param {validOnly} 仅校验，不提示
   */
  '$verify.check': Function,
  /**
   * 获取错误提示
   * @param {String} field 错误键名（为空时返回全部错误提示）
   * @return {String}
   */
  '$verify.errors': Function
};
