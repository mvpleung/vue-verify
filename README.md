# vue-verify
vuejs 表单校验组件

### 安装 

```
npm install @mvpleung/verify
```

### 配置

```js
import vueVerify from '@mvpleung/verify';
Vue.use(vueVerify,{
    trigger: String, //触发校验事件，默认为全部，['blur', 'change']
    msgbox: Function, //自定义消息提示框
    scrollToEl: true, //是否滚动到校验的Dom节点
    offsetTop: Number, //滚动偏移量，配合 scrollToEl 使用
    multiple: false //是否支持批量校验
});
```

### 如何使用
```vue
<template>
   <div class="input-box clearFix">
	  <input
	    v-model="name"
	    v-verify="[{test: 'required', message: '请输入 name'},{test: 'mobile'}]"
	   />
	  <input
	    v-model="code"
	    v-verify="rules.verfifyCode"
	   />
	   <button v-on:click="next">下一步</button>
   </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
          return {
            name: '',
            rules: {
                verfifyCode: [
                  {
                    test: 'required',
                    message: '验证码不能为空'
                  },
                  {
                    test: /^(\+|-)?\d+($|\.\d+$)/,
                    message: '请正确输入验证码'
                  },
                  {
                    minlength: 4,
                    message: '请输入四位验证码'
                  }
                ]
          }
        },
        methods:{
          next() {
            if (this.$verify.check()) {
                console.log('verify success');
            }
          }
        }
    }
</script>

```

### 指令说明

#### v-verify

> 参数为数组

* 对象格式规则配置
```js
    [
        {
          test: [String, Function(value), RegExp], //校验规则,String: 默认定义的规则
          message: String, //自定义错误提示
          trigger: String //出发校验事件，['blur', 'change']
        }
    ]
```
* 符串格式规则配置（[./defaultRules][1]）
```js
    [
        'required|mobile' //使用默认定义的规则，多条规则以 '|' 分割，不能自定义 message
    ]
```
* 混合格式规则
```js
    [
          {
            test: [String, Function(value), Test], //校验规则,String: 默认定义的规则， Test 为正则
            message: String, //自定义错误提示
            trigger: String //出发校验事件，['blur', 'change']
          },
          'required|mobile'
    ]
```

#### v-verify:arg

> 分组校验，v-verify:[group]

```javascript
  <input
    v-model="name"
    v-verify:basic="[{test: 'required', message: '请输入 name'},{test: 'mobile'}]"
   />
  <input
    v-model="code"
    v-verify:other="rules.verfifyCode"
   />
```
```
this.$verify.check('basic'); //校验组名为 basic 的表单项
this.$verify.check('other'); //校验组名为 other 的表单项
```

#### v-remind
> 用于校验字段的错误提示，参数类型为 [String, Model]，需要提示的字段名，可以传递 String 或者 this可访问的属性
```js
    <lable v-remind="name"/>
```

### 方法说明

* $verify.config

    接收自定义配置，优先级>全局配置

* (Boolean) $verify.validate
 手动校验某个字段值
  * field `String` 校验字段名
  * rule?  `[String, Array]` 校验规则，非必填，默认读取 v-verify配置规则
  * validOnly? `Boolean` 是否仅作为校验，不提示错误信息，非必填

* (Boolean) $verify.check
 校验所有
  * group? `String` 校验组名，非必填
  * validOnly? `Boolean` 是否仅作为校验，不提示错误信息，非必填

* (String/Array) $verify.errors
 获取错误提示
  * field? `String` 需要获取某个字段错误提示时，传递此字段，不传返回全部错误信息


### [默认规则][1]

##### License
-------

[LICENSE](https://github.com/mvpleung/vue-verify/blob/master/LICENSE)


  [1]: src/defaultRules.js
