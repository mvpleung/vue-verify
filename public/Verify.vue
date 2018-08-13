<template>
  <div class="container">
    <div class="page-part">
      <label>字符串测试</label>
      <input type="tel"
        v-model="info.first"
        v-verify="'required'"
        placeholder="first"
        maxlength="11" />
    </div>
    <div class="page-part">
      <label>字符串测试(remind)</label>
      <input type="tel"
        v-model="info.six"
        v-verify="'required'"
        placeholder="six"
        maxlength="11" />
      <label v-remind="info.six" />
    </div>
    <div class="page-part">
      <label>字符串批量规则测试</label>
      <input type="tel"
        v-model="info.four"
        v-verify="'required|mobile'"
        placeholder="four"
        maxlength="11" />
    </div>
    <div class="page-part">
      <label>对象字面量测试</label>
      <input type="tel"
        v-model="info.second"
        v-verify="{test: 'required', message: '请输入 second'}"
        placeholder="second"
        maxlength="11" />
    </div>
    <div class="page-part">
      <label>数组规则测试</label>
      <input type="tel"
        v-model="info.third"
        v-verify="[{test: 'required', message: '请输入 third'},{test: 'mobile'}]"
        placeholder="third"
        maxlength="11" />
    </div>
    <div class="page-part">
      <label>数组规则测试</label>
      <input type="tel"
        v-model="info.five"
        v-verify="verify.verfifyCode"
        placeholder="five"
        maxlength="11" />
    </div>
    <div v-if="enable"
      class="page-part">
      <label>动态组件测试</label>
      <input type="tel"
        v-model="info.seven"
        v-verify="verify.verfifyCode"
        placeholder="seven"
        maxlength="11" />
    </div>
    <div class="page-footer">
      <label><input type="checkbox"
          v-model="enable" />测试动态组件</label>
      <label><input type="checkbox"
          v-model="checkAll" />是否批量校验（暂不支持批量msgBox）</label>
      <label><input type="checkbox"
          v-model="msgBox" />是否msgBox提示（行内错误展示不支持）</label>
      <button size="large"
        @click="check">测试</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'verify',
  data() {
    return {
      info: {
        first: '',
        second: '',
        third: '',
        four: '',
        five: '',
        six: '',
        seven: '',
        eight: ''
      },
      enable: false,
      checkAll: true,
      msgBox: true,
      verify: {
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
    };
  },
  watch: {
    checkAll(val) {
      this.$verify.config({
        multiple: val,
        msgBox: null
      });
    },
    msgBox() {
      this.$verify.config({
        msgbox: this.msgBox ? msg => alert(msg) : false
      });
    }
  },
  computed: {
    five() {
      return this.$verify.validate('info.five', this.verify.verfifyCode, true);
    },
    first() {
      return this.$verify.validate('info.first', true);
    }
  },
  methods: {
    check() {
      this.$verify.check();
    }
  }
};
</script>
<style scoped>
.container {
  text-align: left;
}
.page-part {
  height: 23px;
  margin-top: 20px;
}
.page-part label {
  display: inline-block;
  text-align: right;
  padding-right: 15px;
  width: 38%;
}
.page-footer {
  text-align: center;
  text-align: -webkit-center;
  margin-top: 20px;
}
.page-footer label,
.page-footer button {
  display: block;
  margin-top: 10px;
}
</style>
