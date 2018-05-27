/*
 * 配置项
 * @Author: liangzc 
 * @Date: 2018-05-18 15:33:47 
 * @Last Modified by: liangzc
 * @Last Modified time: 2018-05-21 00:10:08
 */
export default {
  /**
   * 自定义配置
   */
  options: {
    trigger: String, //出发校验事件，['blur', 'change']
    msgbox: MintUI.Toast, //自定义消息提示框
    scrollToEl: true, //是否滚动到校验的Dom节点
    offsetTop: Number, //滚动偏移量，配合 scrollToEl 使用
    multiple: false //是否支持批量校验
  },
  /**
   * 指令字面量属性
   * @param {String} v-verify:arg 分组校验 arg:组名
   */
  'v-verify:group': [
    //对象格式规则
    {
      test: [String, Function(value), Test], //校验规则,String: 默认定义的规则， Test 为正则
      message: String, //自定义错误提示
      trigger: String //出发校验事件，['blur', 'change']
    },

    //字符串格式规则
    'required|mobile', //使用默认定义的规则，多条规则以 '|' 分割，不能自定义 message

    //数组格式规则
    [
      {
        test: [String, Function(value), Test], //校验规则,String: 默认定义的规则， Test 为正则
        message: String, //自定义错误提示
        trigger: String //出发校验事件，['blur', 'change']
      },
      'required|mobile'
    ]
  ],
  /**
   * v-remind行内提示
   */
  'v-remind': [String, Model] //需要提示的字段名，可以传递 String 或者 this可访问的属性
};
