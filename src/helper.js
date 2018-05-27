let { inDoc } = require('./domTools');
module.exports = (function () {
  /**
   * 解析JSON
   * @param {*} json
   */
  function parseJson(json) {
    if (!json || json === '' || json === null) return null;
    try {
      return json instanceof Object ? json : eval('(' + json + ')');
    } catch (e) {
      console.error(e.message, e);
      return null;
    }
  }

  /**
   * check value type
   * @param  {String}  type
   * @param  {*}  val
   * @return {Boolean}
   */
  function is(type, val) {
    return Object.prototype.toString.call(val) === '[object ' + type + ']';
  }

  /**
   * 自定义foreach，支持 return false
   * @param {Array} arr
   * @param {Function} func
   */
  function forEach(arr, func) {
    if (!func) return;
    if (Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        let ret = func(arr[i], i); //回调函数
        if (typeof ret !== 'undefined' && (ret === null || ret === false))
          break;
      }
    } else {
      for (let item in arr) {
        let ret = func(arr[item], item); //回调函数
        if (typeof ret !== 'undefined' && (ret === null || ret === false))
          break;
      }
    }
  }

  /**
   * 批量展示消息
   *
   * @param {Vue} vm
   */
  function batchMsg(vm) {
    let options = vm.$options.verify.config || {};
    if (
      options &&
      options.multiple &&
      options.msgbox &&
      vm.$verify.errors().length > 0
    ) {
      options.msgbox(vm.$verify.errors().join(','));
    }
  }

  /**
   * 获取当前校验的节点
   * @param {Vue} vm
   * @param {String} field
   */
  function getVerifyEl(vm, field) {
    return (vm.$verify.$protoQueue.original || {})[field];
  }

  /**
   * 滚动到当前校验的节点
   * @param {Vue} vm
   * @param {String} field
   * @param {Number} offsetTop 偏移量
   */
  function scrollToVerifyEl(vm, field, offsetTop) {
    let el = getVerifyEl(vm, field);
    //不在可见区域内时，滚动
    if (
      el &&
      !(
        el.offsetTop + el.offsetHeight / 3 >= window.pageYOffset &&
        el.offsetTop + el.offsetHeight / 3 <
        window.pageYOffset + window.outerHeight
      )
    ) {
      scrollTo(0, el.offsetTop + (offsetTop || 0));
    }
  }

  /**
   * 是否需要MsgBox提示
   * @param {*} vm
   * @param {*} options
   */
  function isMsgBox(vm, field, validOnly) {
    let options = vm.$options.verify.config || {};
    return (
      !options.multiple &&
      !validOnly &&
      options.msgbox !== false &&
      !(
        vm.$options.verify &&
        vm.$options.verify.remind &&
        vm.$options.verify.remind.includes(field)
      )
    );
  }

  /**
   * 提取真实 field 字段
   * @param {Object} vnodeData vnode.data
   */
  function getVerifyField(vnodeData) {
    let field;
    if (vnodeData.model) {
      field = vnodeData.model.expression;
    } else {
      forEach(vnodeData.directives, item => {
        if (item.name === 'model') {
          field = item.expression;
          return false;
        }
      });
    }
    return field;
  }

  /**
   * 获取默认规则列表
   */
  function getDefaultRules() {
    return (
      this.defaultRules || (this.defaultRules = require('./defaultRules').rules)
    );
  }

  /**
   * 处理自定义指令校验规则
   * @param {Vue} vm vue实例
   * @param {Object} binding 自定义指令绑定对象
   * @param {Element} realEl 真实Dom
   * @param {Object} defaultRules 默认规则
   */
  function handleVerifyRule(vm, binding, realEl, defaultRules) {
    let field = realEl.dataset.verify_field;
    let verify = vm.$options.verify;
    //处理校验规则
    verify = verify || {};
    verify.rules = verify.rules || {};

    if (is('String', binding.value)) {
      //使用默认规则
      let bindRules = binding.value
        .split('|')
        .map(rule => defaultRules[rule])
        .filter(rule => rule !== undefined);
      verify.rules[field] = bindRules;
    } else {
      if (Array.isArray(binding.value)) {
        verify.rules[field] = binding.value
          .map(value => {
            if (is('String', value)) {
              return defaultRules[value];
            } else if (is('Object', value)) {
              return value.test !== undefined ?
                (() => {
                  let rule = is('String', value.test) ?
                    defaultRules[value.test] :
                    {};
                  return {
                    test: rule.test || value.test,
                    required: rule.required,
                    message: value.message || rule.message,
                    trigger: rule.trigger
                  };
                })() :
                value;
            }
          })
          .filter(rule => rule !== undefined);
      } else if (is('Object', binding.value)) {
        verify.rules[field] = [
          binding.value.test !== undefined ?
            (() => {
              let rule = is('String', binding.value.test) ?
                defaultRules[binding.value.test] :
                {};
              return {
                test: rule.test || binding.value.test,
                required: rule.required,
                message: binding.value.message || rule.message,
                trigger: rule.trigger
              };
            })() :
            binding.value
        ];
      }
    }

    //添加到分组验证队列
    let group = binding.arg;
    if (group) {
      if (!verify.group) verify.group = {};
      verify.group[group] = verify.group[group] || [];
      verify.group[group].push({
        el: realEl,
        field,
        rules: verify.rules[field]
      });
    }

    verify.errors = verify.errors || {};
    vm.$options.verify = verify;
  }

  /**
   * 获取当前校验规则
   * @param {Vue} vm
   * @param {String} field 校验字段名
   * @param {String} trigger 出发事件['blur','change']
   */
  function getVerifyRules(vm, field, trigger) {
    let elRules = ((vm.$options.verify || {}).rules || {})[field];
    if (elRules && Array.isArray(elRules) && trigger) {
      elRules = elRules.filter(
        rule => !rule.trigger || rule.trigger === trigger
      );
    }
    return elRules;
  }

  /**
   * 获取分组校验规则
   * @param {Vue} vm
   * @param {String} group 组名
   */
  function getGroupRules(vm, group) {
    let verify = vm.$options.verify || {};
    if (!verify.group || !verify.group[group]) {
      console.warn(group + ' not found in the component');
      return;
    }
    let groupRule = {};
    forEach(verify.group[group] || [], group => {
      if (inDoc(group.el)) {
        groupRule[group.field] = group.rules;
      }
    });
    return groupRule;
  }

  return {
    batchMsg: batchMsg, //批量提示错误
    scrollToVerifyEl: scrollToVerifyEl, //滚动到当前校验的节点
    isMsgBox: isMsgBox, //是否需要MsgBox提示
    getVerifyField: getVerifyField, //提取 field 字段
    getDefaultRules: getDefaultRules, //获取默认规则
    handleVerifyRule: handleVerifyRule, //处理自定义指令校验规则
    getVerifyRules: getVerifyRules, //获取当前节点校验规则
    getGroupRules: getGroupRules, //获取分组校验规则
    is: is, //数据类型判断
    parseJson: parseJson, //解析JSON
    forEach: forEach //自定义循环函数，支持 return false
  };
})();
