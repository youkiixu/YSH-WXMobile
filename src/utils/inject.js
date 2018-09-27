
import wx from '@/utils/wxFunction'

export default {
  install(Vue, options) {
    Vue.prototype.$wx = wx
  }
}