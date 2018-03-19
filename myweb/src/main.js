// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Layout from './components/layout'
import router from './router'
import axios from 'axios'
import Store from './store'

Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  Store,
  components: { Layout },
  template: '<Layout/>'
})
