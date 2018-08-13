# vue-verify

vuejs 表单校验组件

### 安装

```
npm install @mvpleung/verify
```

### 配置

```js
import vueVerify from '@mvpleung/verify';
Vue.use(vueVerify, {
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

- 对象格式规则配置

```js
[
  {
    test: [String, Function(value), RegExp], //校验规则,String: 默认定义的规则
    message: String, //自定义错误提示
    trigger: String //出发校验事件，['blur', 'change']
  }
];
```

- 符串格式规则配置（[./defaultRules][1]）

```js
[
  'required|mobile' //使用默认定义的规则，多条规则以 '|' 分割，不能自定义 message
];
```

- 混合格式规则

```js
[
  {
    test: [String, Function(value), Test], //校验规则,String: 默认定义的规则， Test 为正则
    message: String, //自定义错误提示
    trigger: String //出发校验事件，['blur', 'change']
  },
  'required|mobile'
];
```

#### v-remind

> 用于校验字段的错误提示，参数类型为 [String, Model]，需要提示的字段名，可以传递 String 或者 this 可访问的属性

```js
<lable v-remind="name" />
```

### 方法说明

- $verify.config

  接收自定义配置，优先级>全局配置

- (Boolean) $verify.validate
  手动校验某个字段值

  - field `String` 校验字段名
  - rule? `[String, Array]` 校验规则，非必填，默认读取 v-verify 配置规则
  - validOnly? `Boolean` 是否仅作为校验，不提示错误信息，非必填

- (Boolean) $verify.check
  校验所有

  - group? `String` 校验组名，非必填
  - validOnly? `Boolean` 是否仅作为校验，不提示错误信息，非必填

- (String/Array) $verify.errors
  获取错误提示
  - field? `String` 需要获取某个字段错误提示时，传递此字段，不传返回全部错误信息

### 默认规则

[默认校验规则](https://raw.githubusercontent.com/mvpleung/vue-verify/master/src/defaultRules.js)

| Rule                    | Extra                         | Description                                                                                              |
| ----------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| **email**               |                               | 邮箱格式错误                                                                                             |
| **mobile**              |                               | 手机号码格式不正确                                                                                       |
| **required**            |                               | 必填                                                                                                     |
| **englishmixing**       | `placeholder: 占位符，默认''` | 英文+数字混合, `${placeholder}英文+数字混合`                                                             |
| **url**                 |                               | URL 格式错误                                                                                             |
| **tel**                 |                               | 请正确输入固定电话                                                                                       |
| **fax**                 |                               | 请正确输入传真号码                                                                                       |
| **fullname**            |                               | 不允许含有数字\标点符号(“·”除外），且首位与末位不能为空格，不允许含有汉字又同时含有字母，不小于 2 个字符 |
| **number**              |                               | 请输入纯数字                                                                                             |
| **integer**             |                               | 请输入非负整数(正整数和零)                                                                               |
| **integerNum**          |                               | 请输入非负浮点数(正浮点数和零)                                                                           |
| **positiveInt**         |                               | 请输入正整数                                                                                             |
| **positiveNum**         |                               | 请输入正整数或正浮点数                                                                                   |
| **address**             |                               | 必须包含汉字，不能连续 5 个相同字符，最少 5 个汉字，长度不少于 10 个字节                                 |
| **qq**                  |                               | 请正确输入 QQ 号码                                                                                       |
| **wechat**              |                               | 请正确输入微信号码                                                                                       |
| **username**            | `placeholder: 占位符，默认''` | `请正确输入${placeholder}用户名，4-16 位(数字、字母、下划线、减号)`                                      |
| **password**            |                               | 请正确输入密码，6-20 位英文和数字                                                                        |
| **height**              |                               | 请正确输入身高                                                                                           |
| **weight**              |                               | 请正确输入体重                                                                                           |
| **zipNo**               |                               | 请正确输入邮编                                                                                           |
| **bankNo**              |                               | 请正确输入银行卡号(10-23 位纯数字)                                                                       |
| **date**                | `placeholder: 占位符，默认''` | `请正确输入${placeholder}日期`                                                                           |
| **idcard**              | `placeholder: 占位符，默认''` | `请正确输入${placeholder}身份证号码`                                                                     |
| **passport**            | `placeholder: 占位符，默认''` | `${placeholder}证件类型为外国护照，证件号码位数必须为3-20个字符`                                         |
| **passportCN**          | `placeholder: 占位符，默认''` | `${placeholder}证件类型为中国护照，证件号码位数必须为7-10个字符`                                         |
| **birthCertificate**    | `placeholder: 占位符，默认''` | `请正确输入${placeholder}出生证`                                                                         |
| **HMMainlandPass**      | `placeholder: 占位符，默认''` | `请正确输入${placeholder}港澳居民来往内地通行证`                                                         |
| **TWMainlandPass**      | `placeholder: 占位符，默认''` | `请正确输入${placeholder}台湾居民来往大陆通行证`                                                         |
| **officersCertificate** | `placeholder: 占位符，默认''` | `${placeholder}证件类型为军官证，证件号码必须为10-18个字符`                                              |
| **soldierCard**         | `placeholder: 占位符，默认''` | `${placeholder}证件类型为士兵证，证件号码必须为10-18个字符`                                              |
| **taxpayerCode**        | `placeholder: 占位符，默认''` | `${placeholder}企业税号为15、18、20位数字或大写字母`                                                     |
| **base64**              | `placeholder: 占位符，默认''` | `请正确输入${placeholder}base64字符串`                                                                   |
| **platenumber**         | `placeholder: 占位符，默认''` | `${placeholder}车牌号不正确`                                                                             |
| **minlength**           | `minlength: 最小长度`         | `请输入一个长度最少为${minlength}位的字符`                                                               |
| **maxlength**           | `maxlength: 最大长度`         | `请输入一个长度最大为${maxlength}位的字符`                                                               |
| **min**                 | `min: 最小值`                 | `请输入一个大于等于${min}的数字`                                                                         |
| **max**                 | `max: 最大值`                 | `请输入一个小于等于${max}的数字`                                                                         |
| **base**                | `base: 整除基数`              | `请输入${base}的整数倍`                                                                                  |

#### License

---

[LICENSE](https://github.com/mvpleung/vue-verify/blob/master/LICENSE)
