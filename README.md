# vue-verify

### install

```javascript
npm install verify-plugin
```

### use

```javascript
<template>
  <div class="input-box clearFix">
    <div>
      <input v-model="age" v-verify="age" placeholder="age"/>
      <label class="fl" v-remind="age"></label>
    </div>
    <!-- 对象字面量用法，参考指令说明 -->
    <div>
      <input v-model="age" v-verify="{rule: 'age'}" placeholder="age"/>
      <label class="fl" v-remind="{field: 'age', error: ['自定义错误提示，按定义规则顺序取值']}"></label>
    </div>
    <div>
      <input type="text" class="phoneIcon fl" placeholder="手机号码" v-model="regInfo.phone" v-verify="regInfo.phone">
      <label class="fl" v-remind="regInfo.phone"></label>
    </div>
    <button v-on:click="submit">提交</button>
  </div>
</template>

<script>
  import Vue from "vue";
  import verify from "verify-plugin";
  Vue.use(verify,{
      blur:true
  });
  export default {
    name: 'app',
    data () {
      return {
        age:"",
        regInfo: {
            phone: ""
        },
        verifyCode: '',
        idNumber: 0
      }
    },
    verify: {
        age:"required",
        regInfo: {
            phone: ["required","mobile"]
        },
        verifyCode: [
          {
            test: 'required',
            message: 'verifyCode不能为空' //自定义提示
         },
          {
            minLength: 4,
            message: 'verifyCode 最少四位' //可不定义，使用默认提示
         },
          {
            maxLength: 6,
            message: 'verifyCode 最长六位'
          }
        ],
        idNumber: [
          {
            test: 'required',
            message: 'idNumber不能为空' //自定义提示
          },
          {
            min: 10  //定义数字最小值，默认提示 “请输入一个大于等于10的数字”
          },
          {
            max: 1000,
            message: 'idNumber 最大为 1000'
          },
          {
            base: 10,
            message: 'idNumber 必须被 10 整除'
          }
        ]
      },
      methods:{
        submit: function () {
          console.log(this.$verify.check());
        }
      }
  }
</script>
```

### 验证错误信息说明

验证之后的错误存储在 vm.$verify.$errors 中，可自行打印出
vm.$verify.$errorArray 存储上一次验证的错误

### 配置说明

```bash
{
    rules:{}//自定义验证方法
    blur:Bool //失去焦点时 是否开启验证
    msgbox: Function, //自定义消息提示框
    force: Bool, //是否强制使用 msgBox
    scrollToEl: Bool, //是否滚动到校验的Dom节点
    field: { //针对输入框的单独配置
        msgbox: Bool, //输入框单独校验时是否使用 msgBox
        offsetTop: Number //滚动偏移量，配合 scrollToEl 使用
    },
    multiple: Bool //是否支持批量校验
}
```

### 自定义属性说明

[data-verify]

```bash
{
    blur: Bool, //是否支持 blur 校验
    replace: Object, //v-model 校验键名替换项，比如 v-model="a[index].c" with replace:{index:1} => v-model="a[1].c"
    ignore: Bool, //是否忽略当前校验，用于动态操作校验逻辑，比如条件下的动态忽略
    error: Array //自定义错误提示，按定义规则顺序取值
}
```

### 指令说明

#### v-verify

在表单控件元素上创建数据的验证规则，他会自动匹配要验证的值以及验证的规则。

##### v-verify 指令支持对象字面量（覆盖自定义属性）

```bash
{
    rule: 'require', //校验规则,仅支持字符串
    blur: Bool, //是否支持 blur 校验
    replace: Object, //v-model 校验键名替换项，比如 v-model="a[index].c" with replace:{index:1} => v-model="a[1].c"
    ignore: Bool, //是否忽略当前校验，用于动态操作校验逻辑，比如条件下的动态忽略
    error: Array //自定义错误提示，按定义规则顺序取值
}
```

##### v-verify 修饰符说明

> 该指令最后一个修饰符为自定义分组

```javascript
//自定义teacher分组
v - verify.teacher;
//自定义student分组
v - verify.student;

//验证时可分开进行验证

//验证student 分组
this.$verify.check('student');
//验证teacher 分组
this.$verify.check('teacher');
//验证所有
this.$verify.check();
```

##### v-verify 指令也可使用 arg 参数进行验证分组

> 如果同时使用修饰符和 arg 分组 则 arg 会覆盖修饰符分组\*\*

```javascript
v-verify:student
//验证student 分组
this.$verify.check("student")
```

##### v-remind 指令支持对象字面量（覆盖自定义属性）

```javascript
{
    field: 'code', //校验提示字段，仅支持字符串
    blur: Bool, //是否支持 blur 校验
    replace: Object, //v-model 校验键名替换项，比如 v-model="a[index].c" with replace:{index:1} => v-model="a[1].c"
    ignore: Bool, //是否忽略当前校验，用于动态操作校验逻辑，比如条件下的动态忽略
    error: Array //自定义错误提示，按定义规则顺序取值
}
```

##### v-remind 修饰符说明

> .join 展示所有错误 用逗号隔开

### 方法说明

#### config

> 自定义配置，此配置会覆盖全局配置，仅在当前页面有效

this.$verify.config(options)

#### validate

> 单独校验某个字段 field: 字段名，rule：校验规则（可空，默认取配置规则），validOnly：是否仅校验值，不弹窗提示

this.$verify.validate(field, rule, validOnly)

#### check

> 校验配置了 v-verify 指令得所有字段，group：组名（参考指令说明中的分组，可空），validOnly：是否仅校验值，不弹窗提示

this.$verify.check(group, validOnly)

#### errors

> 返回错误列表 field：字段名（为空返回全部错误）

this.$verify.errors(field)

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

### 行内校验规则

```html
    <input v-verify="phonenumber" v-model="phonenumber" data-verify="{error:['手机号不能为空','请正确输入手机号码']}"/>
    <input v-verify="'required|mobile'" v-model="phonenumber" data-verify="{error:['手机号不能为空','请正确输入手机号码']}"/>


    <input v-verify="{rule: 'phonenumber', error: ['手机号不能为空','请正确输入手机号码']}" v-model="phonenumber"/>
    <input v-verify="{rule: 'required|mobile', error: ['手机号不能为空','请正确输入手机号码']}" v-model="phonenumber"/>
```

### 自定义验证规则一

```js
import Vue from 'vue';
import verify from 'verify-plugin';
var myRules = {
  max6: {
    test: function(val) {
      if (val.length > 6) {
        return false;
      }
      return true;
    },
    message: '最大为6位'
  }
};
Vue.use(verify, {
  rules: myRules
});
export default {
  name: 'app',
  data() {
    return {
      age: '',
      teacher: '',
      regInfo: {
        phone: ''
      }
    };
  },
  verify: {
    age: 'required',
    teacher: 'max6',
    regInfo: {
      phone: ['required', 'mobile']
    }
  },
  methods: {
    submit: function() {
      console.log(this.$verify.check());
    }
  }
};
```

### 自定义验证规则二

```js
import Vue from 'vue';
import verify from 'verify-plugin';

export default {
  name: 'app',
  data() {
    return {
      age: '',
      teacher: '',
      regInfo: {
        phone: ''
      }
    };
  },
  verify: {
    age: 'required',
    teacher: [
      {
        test: function(val) {
          if (val.length > 6) {
            return false;
          }
          return true;
        },
        message: '最大为6位'
      }
    ],
    regInfo: {
      phone: ['required', 'mobile']
    }
  },
  methods: {
    submit: function() {
      console.log(this.$verify.check());
    }
  }
};
```

#### License

---

[LICENSE](https://github.com/mvpleung/vue-verify/blob/master/LICENSE)

[1]: src/defaultRules.js
