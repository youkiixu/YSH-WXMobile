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
    proSearchParam : {},//非标报价的参数
    proSearchRst: {},//非标报价后的厂家价格列表
    cartCheckOutInfo: {} //购物车下单页面参数
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
    },
    // 设置非标报价的参数
    setProSearchParam (state , res) {
      state.proSearchParam = res
    },
    // 设置购物车下单信息
    setCartCheckOutInfo(state, res) {
      state.cartCheckOutInfo = res
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
      try {
        const res = await api.getSassUserAddress({
          UserId: UserId
        });
        const addressList = JSON.parse(res.data)
        vm.commit('setUserAddressList', addressList)
      } catch (error) {
        vm.commit('setUserAddressList', [])
      }
    },
    // 标准品去到下单也
    async submitByProductId(vm, skuInfo) {
      const openId = wx.getStorageSync('openId')
      if (openId == '') {
        wx.showToast({
          title: '请先登录',
          image: '/static/images/icon_error.png'
        })
        return
      }
      var par = Object.assign({
        'openId': openId
      }, skuInfo)
      loading()
      const res = await api.submitByProductId(par)
      hideLoading()
      if(res.success) {
        vm.commit('setCheckOutInfo', JSON.parse(res.data))
        wx.navigateTo({
          url: '../shoppingPages/checkout'
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
      const res = await api.SubmitByProductId2(par)
      hideLoading()
      if (res.success) {
        vm.commit('setCheckOutInfo', res.data)
        wx.navigateTo({
          url: '../shoppingPages/checkout'
        })
      } else {
        wx.showToast({
          title: res.msg,
          image: '/static/images/icon_error.png'
        })
      }
    },
    // 购物车去下单页
    async submitByShoppingCart (vm , cardId) {
      const openId = wx.getStorageSync('openId')
      var par = Object.assign({
        'openId': openId
      }, cardId)
      loading()
      const res = await api.submitByShoppingCart(par)
      hideLoading()
      if (res.success) {
        vm.commit('setCartCheckOutInfo' , res.data)
        wx.navigateTo({
          url: './cartCheckout'
        })
      }
      
    },
    // 获取非标品报价
    async getProSearchRst(vm , skuInfo) {
      const openId = wx.getStorageSync('openId')
      var par = Object.assign({
        'openId': openId
      }, skuInfo)
      vm.commit('setProSearchParam', skuInfo)
      if (skuInfo.isDetail) {
        // 从detail页过来的,不重写加载
        if(skuInfo.detailCommon) {
          
        } else {
          // 去详情页
          const data = {
            ProductId: skuInfo.ProductId,
            ProductName: skuInfo.title,
            code: skuInfo.qitemCode,
          }
          wx.navigateTo({
            url: `../../goodsPages/goods?data=${JSON.stringify(data)}`
          })
        }
      } else {
        loading()
        const res = await api.getProSearchRst(par)
        hideLoading()
        if (res.success) {
          vm.commit('setProSearchRst', res.data)
          wx.navigateTo({
            url: './quoteList'
          })
        } else {
          wx.showToast({
            title: res.msg,
            image: '/static/images/icon_error.png'
          })
        }
      }
    }
  }
})

export default store
