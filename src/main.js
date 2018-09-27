import Vue from 'vue'
import store from '@/store'
import App from '@/App'
import MpvueRouterPatch from 'mpvue-router-patch'
import inject from '@/utils/inject'
import '../static/css/weui.css'
import './css/app.css'
Vue.config.productionTip = false
Vue.use(MpvueRouterPatch)
Vue.use(inject)

const app = new Vue({
  store,
  ...App
})
app.$mount()
