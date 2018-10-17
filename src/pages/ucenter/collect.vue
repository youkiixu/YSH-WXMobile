<template >
<view class="container">

<view class="collect-head">
   <view class="sort">  
      <view class="item">商品收藏</view>  
      <view class="item">厂家收藏</view>  
      <view class="item">我的足迹</view>   
  </view>
  <view class="classifi">  
      <view class="inner">全部</view>  
      <view class="inner">降价</view>  
      <view class="inner">特卖</view> 
      <view class="inner manage">管理</view>   
  </view>
</view>

 <view class="list">
      <view class="group-item">
        <view class="goods">
          <view class="item" @click="openGoods"  @touchstart="touchStart" @touchend="touchEnd"
      v-for="(item, index) of collectList" :key="item.id" :data-index="index">
            <view class="cart-goods">
              <img class="img" :src="item.imagePath"/>
              <view class="info">
                <view class="t">
                  <text class="name">{{item.ProductName}}</text>                 
                </view>
                <view class="b">
                  <view class="price">
                    <text class="icon">￥</text>{{item.MinSalePrice}}
                  </view>                
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>



<!--   
  <view class="collect-list">
    <view class="item" @click="openGoods"  @touchstart="touchStart" @touchend="touchEnd"
      v-for="(item, index) of collectList" :key="item.id" :data-index="index">
      <image class="img" :src="item.imagePath"/>
      <view class="info">
        <view class="name">{{item.ProductName}}</view>
        <view class="subtitle">{{item.Date}}</view>
        <view class="price">￥{{item.MinSalePrice}}</view>
      </view>
    </view>
  </view> -->
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      typeId: 0,
      collectList: [],
      pageNo:0,
      pageSize: 20
    }
  },
  async mounted () {
    await Promise.all([
      this.GetFavoriteProductList()
    ])
  },
  methods: {
    // 获取我的收藏信息
    async GetFavoriteProductList () {
      const openId = wx.getStorageSync('openId')
      this.pageNo++
      const res = await api.GetFavoriteProductList({ openId: openId , pageNo: this.pageNo , pageSize: this.pageSize });
      if (res.success) {
        var tableData = JSON.parse(res.data)
        this.collectList = this.collectList.concat(tableData.Table)
      }
    },
    // 长按删除，点击进入商品详情
    async openGoods (event) {
      const openId = wx.getStorageSync('openId')
      let goodsId = this.collectList[event.currentTarget.dataset.index].Id;
      console.log('goodsId为：',goodsId)
      // 触摸时间距离页面打开的毫秒数
      var touchTime = this.touch_end - this.touch_start;
      // console.log(touchTime);
      // 如果按下时间大于350为长按
      if (touchTime > 350) {
        var that = this;
        wx.showModal({
          title: '',
          content: '取消收藏？',
          success: async function (res) {
            // console.log('确定取消收藏', res);
            if (res.confirm) {
              // const res = await api.CollectAddOrDelete({ typeId: that.typeId, valueId: goodsId });
              const res = await api.CancelConcernProducts({ openId: openId, Ids: goodsId });
              if (res.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                that.getCollectList();
              }
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '../goods/goods?id=' + goodsId
        });
      }
    },
    // 按下事件开始
    touchStart (e) {
      this.touch_start = e.timeStamp;
    },
    // 按下事件结束
    touchEnd (e) {
      this.touch_end = e.timeStamp;
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/ucenter/collect'
    }
  }
}
</script>

<style scoped>
page{
    background: #f1f1f1;
    height: 100%;
}

.container{
    background: #f1f1f1;
    height: 100%;
}
.collect-head{
  position: fixed;
  left: 0;
  z-index: 10;
  background-color: #fff;
}
.collect-head .sort{
  height: 80rpx;
  width: 750rpx;
  display: flex;
  border-bottom: 2rpx solid #f1f1f1;
}
.collect-head .sort .item{
    line-height: 80rpx;
    text-align: center;
    flex:1;
    color: #282828;
    font-size: 28rpx;
    margin-left: 60rpx;
}
.collect-head .sort .item:last-child{
  margin-right: 60rpx;
}
.collect-head .classifi{
  height: 70rpx;
  width: 750rpx;
  display: flex;
  background-color: #fff;
}
.collect-head .classifi .inner{
    line-height: 70rpx;
    text-align: center;
    flex:2;
    color: #282828;
    font-size: 24rpx;
    margin-left: 60rpx;
}
.collect-head .classifi .manage{
  flex:1.5;
  border-left: 2rpx solid #f1f1f1;
}

 .list{
    height: auto;
    width: 100%;
    overflow: hidden;
    margin-top: 170rpx;
    margin-bottom: 120rpx;
}

 .group-item{
    height: auto;
    width: 100%;
    background: #fff;
    padding: 0 20rpx;
    box-sizing: border-box;
    margin-bottom: 18rpx;
}

.group-item .item{
    height: 228rpx;
    width: 100%;
    overflow: hidden;
    border-bottom: 2rpx solid #f1f1f1;
}
.group-item .item .cart-goods{
    float: left;
    height: 228rpx;
    width: 672rpx;
    border-bottom: 1px solid #f4f4f4;
}

.group-item .item .img{
    float: left;
    height:190rpx;
    width: 190rpx;
    background: #f4f4f4;
    margin: 19.5rpx 18rpx 19.5rpx 0;
}

.group-item .item .info{
    float: left;
    width: 420rpx;
    margin: 19.5rpx 26rpx 19.5rpx 0;
}

.group-item .item .t{
    margin: 8rpx 0;
    font-size: 24rpx;
    color: #282828;
    overflow: hidden;
}
.group-item .item .name{
    line-height: 30rpx;
    font-size: 24rpx;
    color: #282828;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.group-item .item .b{   
    line-height: 30rpx;
    font-size: 32rpx;
    color: #dc2121;
    overflow: hidden;
    margin-top: 30rpx;
}
.group-item .item .b .icon{
  font-size: 28rpx;
}



/* .collect-list{
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #fff;
  padding-left: 30rpx;
  border-top: 1px solid #e1e1e1;
}

.item{
  height: 212rpx;
  width: 720rpx;
  background: #fff;
  padding: 30rpx 30rpx 30rpx 0;
  border-bottom: 1px solid #e1e1e1;
}

.item:last-child{
  border-bottom: 1px solid #fff;
}

.item .img{
  float: left;
  width: 150rpx;
  height: 150rpx;
}

.item .info{
  float: right;
  width: 540rpx;
  height: 150rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20rpx;
}

.item .info .name{
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
}


.item .info .subtitle{
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #888;
  line-height: 40rpx;
}

.item .info .price{
  margin-top: 8rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 40rpx;
} */

</style>
