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

function showError(msg) {
    wx.showToast({
      title: msg,
      image: '/static/images/icon_error.png'
    })
}

const store = new Vuex.Store({
  state: {
    wxUserInfo: {},//微信用户信息
    sassIndex: [], // 首页数据
    categoryList: [], //选择的分类列表
    userInfo: {},//用户信息
    address: {},//地址编辑详情
    addressList: [],//个人地址列表
    checkOutInfo: {},//下单页面信息
    proSearchParam : {},//非标报价的参数
    proSearchRst: {},//非标报价后的厂家价格列表
    cartCheckOutInfo: {}, //购物车下单页面参数
    shoppingCartCount: 0
  },
  mutations: {
    setWxUserInfo(state , res) {
      state.wxUserInfo = res
    },
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
    },
    // 设置购物车数量
    setShoppingCartCount (state , res) {
      state.shoppingCartCount = res
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
        rejects(res)
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
        showError(res.msg)
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
        showError(res.msg)
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
      } else {
        showError(res.msg)
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
          var pages = getCurrentPages() //获取加载的页面
          var currentPage = pages[pages.length - 2] 
          var url = currentPage.route //获取webView关闭前的url
          if (url == 'autoPages/autoquote') {
            // 临时处理，分包的bug
            wx.navigateTo({
              url: `../../../../goodsPages/goods?data=${JSON.stringify(data)}`
            })
          } else {
            // 临时处理，分包的bug
            wx.navigateTo({
              url: `../../goodsPages/goods?data=${JSON.stringify(data)}`
            })
          }
        }
      } else {
        // 自助报价进去厂家列表
        loading()
        const res = await api.getProSearchRst(par)
        hideLoading()
        if (res.success) {
          vm.commit('setProSearchRst', res.data)
          wx.navigateTo({
            url: '../../quoteList'
          })
        } else {
          showError(res.msg)
        }
      }
    },
    async getShoppingCartCount ({ commit }) {
      const openId = wx.getStorageSync('openId')
      if (openId) {
        const res = await api.getShoppingCartCount({
          openId: openId
        })
        if(res.success) {
          commit('setShoppingCartCount', res.data)
        }
      }
    }
  }
})

export default store
