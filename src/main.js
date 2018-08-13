import Vue from 'vue';
import App from '../public/App.vue';
import Verify from '@mvpleung/verify';

Vue.use(Verify, {
  msgbox: msg => alert(msg)
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app');
