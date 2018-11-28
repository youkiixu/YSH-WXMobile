<template >
<div class="container">
  <div class="index-searchbar" v-if="sassIndex && !loading">
    <searchBar></searchBar>
  </div>
  <div v-for="(item , index ) in sassIndex" :key="index" v-if="sassIndex">
    <indexComponent :item="item"></indexComponent>
  </div>
  <loadingComponent v-if="loading"></loadingComponent>

   <!-- 跳去客服聊天 -->
   <div class="toChat" @click="toChat" hover-class>
          <img class="icon" src="http://kiy.cn/Areas/Wxmobile/Content/img/online-service.png"/>
   </div>
</div>
</template>

<script>
// import api from '@/utils/api'
import wx from 'wx'
import { mapState, mapActions } from 'vuex'
import searchBar from '@/components/indexSearchBar'
import indexComponent from '@/components/index-components/indexComponent'
import loadingComponent from '@/components/loadingComponent'

export default {
  data () {
    return {
      loading: true  
    }
  },
  components: {
    searchBar,
    indexComponent,
    loadingComponent
  },
  computed: {
    ...mapState([
      'sassIndex'
    ])
  },
  async mounted () {
    const res = wx.getAccountInfoSync()

    await Promise.all([
      // this.getIndexData(),
      this.getSassIndex()
    ])
    this.loading = false
  },

  methods: {
    ...mapActions([
      // 'getIndexData',
      'getSassIndex'
    ]),
    async toChat() {
      this.$wx.showLoading('正在加载客服')
     // const res = await api.gustServiceList({strGroupName: this.detailInfo.ShopName})
      this.$wx.hideLoading()
      // // 临时
      // this.$wx.showErrorToast('暂无客服')
      // return
      // if(!res.success) {
      //   this.$wx.showErrorToast(res.msg)
      //   return
      // }
         
      this.$router.push({
        path: '../../wxchat/userList',
        query: {        
          strGroupName: " ",
        }
      })
    }
  },
  // 小程序原生下拉刷新
  async onPullDownRefresh () {
    await Promise.all([
      this.getSassIndex()
    ])
    this.loading = false
    wx.stopPullDownRefresh()
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: '印生活商城',
      desc: '印生活',
      path: '/pages/index/index'
    }
  }
}
</script>

<style scoped>
.container {
  overflow: hidden;
  background-color: #f1f1f1;
}
.index-searchbar {
  position: absolute;
  top: 20rpx;
  z-index: 99;
  left: 0rpx;
  width:750rpx;
  overflow: hidden;
  padding:10rpx 0;
  height:74rpx;
}
.toChat{
  width: 70rpx;
  height: 70rpx;
  color: #585c63;
  font-size: 20rpx;
  text-align: center;
  line-height: 120rpx;
  border-radius: 50%;
  position: fixed;
  bottom: 55rpx;
  right: 20rpx;
  z-index: 1000; 
}
.toChat img{
  width: 100%;
  height: 100%;
}
</style>
