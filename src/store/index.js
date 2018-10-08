import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/utils/api'
import { rejects } from 'assert';
import { resolve } from 'path';

Vue.use(Vuex)

function loading() {
  wx.showLoading({
    title: '正在提交...'
  })
}
function hideLoading() {
  wx.hideLoading()
}

const store = new Vuex.Store({
  state: {
    sassIndex: [], // 首页数据
    categoryList: [], //选择的分类列表
    userInfo: {},//用户信息
    address: {},//地址编辑详情
    addressList: [],//个人地址列表
    checkOutInfo: {},//下单页面信息
    proSearchRst: {}//非标报价后的厂家价格列表
  },
  mutations: {
    getSassIndexData (state , res) {
      state.sassIndex = res
    },
    getCategoryListData (state , res) {
      state.categoryList = res
    },
    setUserInfo (state , res) {
      state.userInfo = res
    },
    set_address (state , res) {
      state.address = res
    },
    setUserAddressList (state , res) {
      state.addressList = res
    },
     // 给checkout页面复制
    setCheckOutInfo(state, res) {
      state.checkOutInfo = res
    },
    setProSearchRst(state, res) {
      state.proSearchRst = res
    }
  },
  actions: {
    // 读取首页数据
    async getSassIndex ({ commit }) {
      const res = await api.getSassIndex()
      commit('getSassIndexData', res.LModules)
    },
    // 读取分类数据
    async getCategoryList (vm , data) {
      vm.commit('getCategoryListData', data)
    },
    // 登陆
    async sassLogin(vm, data = {}) {
      let openId = wx.getStorageSync('openId')
      // openId = '1234567'
      if (openId) {
        data = Object.assign(data ,{ 'OpenId': openId})
      }
      const res = await api.sassLogin(data)
      if (res.success) {
        vm.commit('setUserInfo', JSON.parse(res.data))
      } else {
        return rejects(false)
      }
      
    },
    // 获取用户地址
    async getUserAddressList (vm , UserId) {
      const res = await api.getSassUserAddress({
        UserId: UserId
      });
      const addressList = JSON.parse(res.data)
      vm.commit('setUserAddressList', addressList)
    },
    // 标准品去到下单也
    async submitByProductId(vm, skuInfo) {
      const openId = wx.getStorageSync('openId')
      var par = Object.assign({
        'openId': openId
      }, skuInfo)
      loading()
      const res = await api.submitByProductId(par)
      hideLoading()
      if(res.success) {
        vm.commit('setCheckOutInfo', JSON.parse(res.data))
        wx.navigateTo({
          url: '../../pages/shopping/checkout'
        })
      } else {
        wx.showToast({
          title: res.msg,
          image: '/static/images/icon_error.png'
        })
      }
    },
    // 非标品去到下单也
    async SubmitByProductId2(vm, skuInfo) {
      const openId = wx.getStorageSync('openId')
      var par = Object.assign({
        'openId': openId
      }, skuInfo)
      loading()
      console.log(JSON.stringify(par))
      const res = await api.SubmitByProductId2(par)
      hideLoading()
      if (res.success) {
        vm.commit('setCheckOutInfo', res.data)
        wx.navigateTo({
          url: '../../pages/shopping/checkout'
        })
      } else {
        wx.showToast({
          title: res.msg,
          image: '/static/images/icon_error.png'
        })
      }
    },
    async getProSearchRst(vm , skuInfo) {
      const openId = wx.getStorageSync('openId')
      var par = Object.assign({
        'openId': openId
      }, skuInfo)
      loading()
      const res = await api.getProSearchRst(par)
      hideLoading()
      if(res.success) {
        vm.commit('setProSearchRst', res.data)
        wx.navigateTo({
          url: '../../pages/auto/quoteList'
        })
      }
    }
  }
})

export default store
