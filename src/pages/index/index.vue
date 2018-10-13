<template >
<view class="container">
  <!-- <swiper class="banner" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
    <swiper-item v-for="item of banner" :key="item.id">
      <navigator :url="item.link">
        <img :src="item.image_url" background-size="cover" />
      </navigator>
    </swiper-item>
  </swiper> -->
  <view class="index-searchbar">
    <searchBar></searchBar>
  </view>
  <view v-for="(item , index ) in sassIndex" :key="index">
    <indexComponent :item="item"></indexComponent>
  </view>
  
  <!-- <view class="m-menu">
    <navigator  class="item" :url="item.url" v-for="item of channel" :key="item.id">
      <img :src="item.icon_url" background-size="cover" />
      <text>{{item.name}}</text>
    </navigator>
  </view> -->
</view>
</template>

<script>
// import api from '@/utils/api'
import { mapState, mapActions } from 'vuex'
import searchBar from '@/components/indexSearchBar'
import indexComponent from '@/components/index-components/indexComponent'

export default {
  components: {
    searchBar,
    indexComponent
  },
  computed: {
    ...mapState([
      'sassIndex'
    ])
  },
  async mounted () {
    const res = wx.getAccountInfoSync()
    console.log(res)
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
      title: 'sassShop',
      desc: '印生活',
      path: '/pages/index/index'
    }
  }
}
</script>

<style scoped>
.container {
  overflow: hidden;
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
