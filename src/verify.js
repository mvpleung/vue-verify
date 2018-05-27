/*
 * 校验核心js
 * @Author: focus 
 * @Date: 2017-04-14
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-05-27 17:22:38
 */
let _ = require('lodash/object'),
  { findDom, apply } = require('./domTools'),
  helper = require('./helper'),
  defaultRules = helper.getDefaultRules(),
  defaultConfig = {},
  $msgInstance;

/**
 * 校验数据
 * @param {String} field 校验字段
 * @param {Objec|Array} rule 校验规则
 * @param {Boolean} validOnly 是否仅校验不提示
 */
let validate = function(field, rule, validOnly) {
  let vm = this; //Vue组件对象
  let value = _.get(vm, field);
  let allCheck = _.get(vm.$options, 'verify.config.allCheck', false);
  if (allCheck) {
    if (!defaultConfig.multiple && vm.$verify.errors().length > 0) return false; //单次校验，替代批量校验
  } else {
    if (vm.$verify.errors(field)) return false; //单次校验，替代批量校验
  }

  //如果为验证规则为数组则进行遍历
  if (Array.isArray(rule)) {
    return (
      rule
        .map(item => validate.call(vm, field, item, validOnly))
        .indexOf(false) === -1
    );
  }

  let special = ['maxlength', 'minlength', 'max', 'min', 'base'],
    isSpecial = special.some(k => rule[k] !== undefined);
  if (!(rule && (rule.test || isSpecial))) {
    console.warn('rule of ' + field + ' not define');
    return false;
  }

  let valid = true;
  if (
    rule &&
    rule.test &&
    (rule.required ||
      rule.required !== true && defaultRules.required.test(value))
  ) {
    //验证数据
    valid = helper.is('Function', rule.test) ?
      rule.test.call(this, value) :
      rule.test.test(value);
  }

  //校验特殊规则 minLength、maxLength、min、max、base
  if (rule && isSpecial) {
    helper.forEach(
      special
        .map(s => ({ value: rule[s], rule: defaultRules[s] }))
        .filter(s => s.rule !== undefined && s.value !== undefined),
      (r, i) => {
        valid = r.rule.test(value, r.value);
        rule.message =
          rule.message ||
          r.rule.message.replace(new RegExp('\\{0\\}', 'g'), r.value || '');
      }
    );
  }

  //错误对象
  let $error = _.get(vm.$options.verify.errors, field);
  let config = _.get(vm.$options, 'verify.config', {});
  //验证未通过
  if (!valid) {
    if (allCheck === true && config.scrollToEl === true) {
      //默认滚动到校验的节点，仅限于全部校验时
      helper.scrollToVerifyEl(vm, field, config.offsetTop || 0);
    }
    //处理 placeholder 占位符，比如 '{0}不能为空'
    rule.message = rule.message ?
      rule.message.replace(new RegExp('\\{0\\}', 'g'), rule.placeholder || '') :
      rule.message;
    if (helper.isMsgBox(vm, field, validOnly)) {
      if ($msgInstance && $msgInstance.close) {
        $msgInstance.close();
      }
      let msgBox = _.get(vm.$options, 'verify.config.msgbox');
      msgBox && ($msgInstance = msgBox(rule.message));
    }
    !validOnly && $error.push(rule.message);
  }
  return valid;
};

/**
 * 初始化自定义指令
 * @param {Vue} Vue
 * @param {Object} options
 */
let initDirective = function(Vue, options = {}) {
  Vue.directive('verify', {
    bind: function(el, binding, vnode, oldVnode) {
      let expression = binding.expression.replace(new RegExp('\'', 'gm'), ''); //处理字符串形式的校验规则，比如 "'required|email'"
      if (expression === null || expression === '' || expression.length === 0)
        return;

      let vm = vnode.context; //当前组件实例

      let realEl = findDom(el, ['input', 'select', 'textarea']); //获取真实Element，处理封装控件

      //提取 field
      realEl.dataset.verify_field = helper.getVerifyField(vnode.data);

      helper.handleVerifyRule(vm, binding, realEl, defaultRules);

      //得到焦点 移除错误
      realEl.addEventListener('focus', e => {
        _.set(vm.$options.verify.errors, e.target.dataset.verify_field, []);
        if ($msgInstance && $msgInstance.close) {
          $msgInstance.close();
        }
      });

      //失去焦点 进行验证
      let currentOptions = _.get(vm.$options, 'verify.config', {});
      let event = (e, trigger) => {
        _.set(vm.$options.verify.config, 'allCheck', false); //全部校验标识
        const elRules = helper.getVerifyRules(
          vm,
          e.target.dataset.verify_field,
          trigger
        );
        if (elRules) {
          validate.call(vm, e.target.dataset.verify_field, elRules);
        }
      };
      (currentOptions.trigger === 'blur' || !currentOptions.trigger) &&
        realEl.addEventListener('blur', e => event(e, 'blur'));

      (currentOptions.trigger === 'change' || !currentOptions.trigger) &&
        realEl.addEventListener('input propertychange', e =>
          event(e, 'change')
        );

      //添加数据监听绑定 getter setter
      Vue.util.defineReactive(
        vm.$options.verify.errors,
        realEl.dataset.verify_field,
        []
      );

      //错误默认值为空
      _.set(vm.$options.verify.errors, realEl.dataset.verify_field, []);
    }
  });

  Vue.directive('remind', {
    bind: function(el, binding, vnode, oldVnode) {
      //缓存使用 remind 提示的字段，遇到此字段时 remind 提示优先
      el.dataset.verify_field = binding.expression;
      let verify = vnode.context.$options.verify || {};
      verify.remind = verify.remind || [];
      verify.remind.push(binding.expression);
      vnode.context.$options.verify = verify;
    },
    update: function(el, binding, vnode, oldVnode) {
      let errors = vnode.context.$verify.errors(el.dataset.verify_field);
      if (errors) {
        apply(el, true);
        el.innerHTML = errors;
      } else {
        apply(el, true);
        el.innerHTML = '';
      }
    }
  });
};

let Verify = function(VueComponent) {
  this.vm = VueComponent;
  this.vm.$options.verify.config = defaultConfig;
};

/**
 * 接收自定义配置，优先级>全局配置
 */
Verify.prototype.config = function(opt = {}) {
  this.vm.$options.verify.config = Object.assign({}, defaultConfig, opt);
};

/**
 * 手动校验某个字段值
 * @param {String} field vue 绑定字段名
 * @param {Array|Object} rule 校验规则（选填时，校验规则需和v-Model保持一致）
 * @param {Boolean} validOnly 仅校验，不提示
 */
Verify.prototype.validate = function(field, rule, validOnly) {
  if (typeof rule === 'boolean') {
    validOnly = rule;
    rule = null;
  }
  // _.set(this.vm.$options.verify.errors, field, []);
  let elRules = rule || helper.getVerifyRules(this.vm, field);
  return elRules ? validate.call(this.vm, field, elRules, validOnly) : true;
};

/**
 * 校验所有
 * @param {String} group 分组校验(v-verify:group)
 * @param {Boolean} validOnly 仅校验，不提示
 */
Verify.prototype.check = function(group, validOnly) {
  let vm = this.vm; //Vue实例
  _.set(vm.$options.verify.config, 'allCheck', true); //全部校验标识
  if (typeof group === 'boolean') {
    validOnly = group;
    group = null;
  }
  let verifyQueue;
  if (group) {
    verifyQueue = helper.getGroupRules(vm, group);
    if (!verifyQueue) {
      return false;
    }
  } else {
    verifyQueue = _.get(vm.$options, 'verify.rules', {});
  }

  //遍历验证队列进行验证
  let result = [];
  helper.forEach(verifyQueue, (value, key) => {
    _.set(vm.$options.verify.errors, key, []);
    result.push(validate.call(vm, key, value, validOnly));
  });
  result = result.indexOf(false) === -1;
  helper.batchMsg(vm);
  return result;
};

/**
 * 获取错误提示
 * @param {String} field 错误键名（为空时返回全部错误提示）
 * @return {String}
 */
Verify.prototype.errors = function(field) {
  if (!field) {
    return Object.values(_.get(this.vm.$options, 'verify.errors', {})).reduce(
      (prev, next) => prev.concat(next)
    );
  }
  let errorText = _.get(this.vm.$options, `verify.errors['${field}']`, null);
  return errorText && Array.isArray(errorText) ? errorText[0] : null;
};

let init = function() {
  this.$options.verify = this.$options.verify || {};
  this.$verify = new Verify(this); //添加vm实例验证属性
  this.$verify.rules = defaultRules;
};

let install = function(Vue, options = {}) {
  options.scrollToEl === undefined && (options.scrollToEl = true);
  defaultConfig = options;

  if (options.rules) {
    defaultRules = Object.assign(defaultRules, defaultRules, options.rules);
  }

  Vue.mixin({
    beforeCreate: init
  });

  initDirective(Vue, options);
};

module.exports = install;
