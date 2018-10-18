import Vue from 'vue'
import store from '@/store'
import App from '@/App'
import MpvueRouterPatch from 'mpvue-router-patch'
import inject from '@/utils/inject'
import filters from '@/utils/filter'
import '../static/css/weui.css'
import './css/app.css'
Vue.config.productionTip = false
Vue.use(MpvueRouterPatch)
Vue.use(inject)

//全局方法Vue.filter()统一注册自定义过滤器
Object.keys(filters).forEach(key => { //返回filters对象中属性名组成的数组
  Vue.filter(key, filters[key])
})

const app = new Vue({
  store,
  ...App
})
app.$mount()
