<template >
<view class="container">
  <view class="index-searchbar" v-if="sassIndex">
    <searchBar></searchBar>
  </view>
  <view v-for="(item , index ) in sassIndex" :key="index" v-if="sassIndex">
    <indexComponent :item="item"></indexComponent>
  </view>
  <loadingComponent v-if="!sassIndex"></loadingComponent>
</view>
</template>

<script>
// import api from '@/utils/api'
import { mapState, mapActions } from 'vuex'
import searchBar from '@/components/indexSearchBar'
import indexComponent from '@/components/index-components/indexComponent'
import loadingComponent from '@/components/loadingComponent'

export default {
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
  },

  methods: {
    ...mapActions([
      // 'getIndexData',
      'getSassIndex'
    ])
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.getSassIndex()
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
</style>
