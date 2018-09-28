<template >
<view class="container">
    <view class="orders">
        <navigator :url="'./orderDetail?Id=' + item.Id" class="order" v-for="(item, index) in orderList" :key="item.id" :data-index="index">
            <view class="h">
                <view class="l">订单编号：{{item.Id}}</view>
                <view class="shop-name"> {{item.ShopName}}</view>
                <view class="r">{{item.OrderDate}}</view>
            </view>
            <view class="goods">
                <view class="img">
                    <image :src="item.ThumbnailsUrl"/>
                </view>
                <view class="info">
                    
                    <text class="name">{{item.ProductName}}</text>
                    <text class="number">共{{item.Quantity}}件商品</text>
                </view>
                <view class="status"></view>
            </view>
            <view class="b">
                <view class="l">实付：￥{{item.SalePrice + item.Freight}}    (运费：{{item.Freight}})</view>
                
                <view class="r">
                    <button class="btn" @click="payOrder">去付款</button>
                </view>
                <view class="r" style="margin-right: 10rpx;">
                    <button class="btn" @click="checkExpress(item)">查物流</button>
                </view>
            </view>
        </navigator>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      orderList: [],
      pageNo: 1,
      pageSize: 15,
    }
  },
  async mounted () {
    await Promise.all([
      this.getUserOrderList()
    ])
  },
  methods: {
    // 获取用户订单数据
    async getUserOrderList () {
        const openId = wx.getStorageSync('openId')
        const res = await api.getUserOrderList({ openId: openId , pageNo: this.pageNo , pageSize: this.pageSize })               
        const data = JSON.parse(res.data)      
        if (res.success === true) {
            this.orderList = data; 
        }        
        console.log(this.orderList[0])
    },
    // 查看物流
    checkExpress (item) {
        this.$router.push({path: './express' , query : {data : JSON.stringify(item)}})
    },

    // 点击“去付款”
    payOrder (event) {
      let currentOrder = this.orderList[event.target.dataset.orderIndex];
      // 给pay页面传两个参数orderId,actualPrice
      // console.log('订单信息', currentOrder);
      wx.redirectTo({
        url: '../pay/pay?orderId=' + currentOrder.id + '&actualPrice=' + currentOrder.actual_price
      })
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/ucenter/order'
    }
  },
  // 小程序原生上拉加载
  onReachBottom () {
    this.page++
    this.getUserOrderList()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.page = 1
    this.orderList = []
    this.getUserOrderList()
    wx.stopPullDownRefresh()
  }

  
}
</script>

<style scoped>
page{
    height: 100%;
    width: 100%;
    background: #f4f4f4;
}

.orders{
    height: auto;
    width: 100%;
    overflow: hidden;
}

.order{
    margin-top: 20rpx;
    background: #fff;
}

.order .h{
    display: flex;
    height: 83.3rpx;
    line-height: 83.3rpx;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    border-bottom: 1px solid #f4f4f4;
    font-size: 30rpx;
    color: #333;
}
.order .h .shop-name {
    padding: 0 15rpx;
}
.order .h .l{
    /* float: left; */
}

.order .h .r{
    /* float: right; */
    color: #b4282d;
    font-size: 24rpx;
}

.order .goods{
    display: flex;
    align-items: center;
    height: 199rpx;
    margin-left: 31.25rpx;
}

.order .goods .img{
    height:145.83rpx;
    width:145.83rpx;
    background: #f4f4f4;
}

.order .goods .img image{
    height:145.83rpx;
    width:145.83rpx;
}

.order .goods .info{
    height: 145.83rpx;
    flex: 1;
    padding-left: 20rpx;
}

.order .goods .name{
    margin-top: 30rpx;
    display: block;
    height: 44rpx;
    line-height: 44rpx;
    color: #333;
    font-size: 30rpx;
}

.order .goods .number{
    display: block;
    height: 37rpx;
    line-height: 37rpx;
    color: #666;
    font-size: 25rpx;
}

.order .goods .status{
    width:105rpx;
    color: #b4282d;
    font-size: 25rpx;
}

.order .b{
    height: 103rpx;
    line-height: 103rpx;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    border-top: 1px solid #f4f4f4;
    font-size: 30rpx;
    color: #333;
}

.order .b .l{
    float: left;
}

.order .b .r{
    float: right;
}

.order .b .btn{
    margin-top: 19rpx;
    height: 64.5rpx;
    line-height: 64.5rpx;
    text-align: center;
    padding: 0 20rpx;
    border-radius: 5rpx;
    font-size: 28rpx;
    color: #fff;
    background: #b4282d;
}
</style>
