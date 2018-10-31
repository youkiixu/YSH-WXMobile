<template >
<view class="container">
    <view class="order-head">
        <view :class="orderStatus ? 'head-item' : ' head-item select'" @click="selectStatus()">全部订单</view>
        <view :class="orderStatus == OrderOperateStatus.WaitPay ? 'head-item select' : 'head-item '" @click="selectStatus(OrderOperateStatus.WaitPay)">待付款</view>
        <view :class="orderStatus == OrderOperateStatus.WaitDelivery  ? 'head-item select' : 'head-item '" @click="selectStatus(OrderOperateStatus.WaitDelivery)">待发货</view>
        <view :class="orderStatus == OrderOperateStatus.WaitReceiving  ? 'head-item select' : 'head-item '" @click="selectStatus(OrderOperateStatus.WaitReceiving)">待收货</view>
        <view :class="orderStatus == OrderOperateStatus.Finish  ? 'head-item select' : 'head-item '" @click="selectStatus(OrderOperateStatus.Finish)">已完成</view>
    </view>
    <view class="orders-list" >
        <view  class="order" v-for="(item, index) in orderList" :key="item.id" :data-index="index">
            <view class="list-item">
                <view class="item-h clear">
                    <view class="number">订单编号：{{item.Id}}</view>
                    <view class="pending">{{item.orderStatuString}}</view>
                </view>
                <navigator class="item-info clear" :url="'./orderDetail?Id=' + item.Id">
                    <view class="img">
                        <image :src="baseUrl + item.ThumbnailsUrl + '/1_350.png'"/>
                    </view>
                    <view class="txt">
                        <view class="txt-t">
                            <view class="txt-title">{{item.ProductName}}</view>
                            <view class="txt-num">共{{item.Quantity}}件商品</view>
                        </view>
                        <view class="txt-price">价格：￥<text class="t">{{item.ProductTotalAmount}}</text></view>
                    </view>
                </navigator>
                <view class="item-check clear">
                    <view class="total">合计：<text class="icon">￥</text><text class="t">{{item.ProductTotalAmount + item.Freight}}</text> (运费：{{item.Freight}})</view>
                    <view class="btn clear">
                        <!-- <button class="cancel" >取消订单</button> -->
                        <button class="confirm" @click="checkExpress(item)">查看物流</button>                 
                    </view>
                </view>
            </view>
        </view>
        <searchResultEmpty v-if="!orderList.length && !loading" text="该分类下没有订单信息"></searchResultEmpty>
        <loadingComponent v-if="loading"></loadingComponent>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import orderInfoStatus from '@/utils/orderInfoStatus'
import loadingComponent from '@/components/loadingComponent'
import searchResultEmpty from '@/components/searchResultEmpty'

export default {
    components: {
        loadingComponent,
        searchResultEmpty
    },
  data () {
    return {
      orderList: [],
      pageNo: 1,
      pageSize: 15,
      orderStatus: false,
      loading: true
    }
  },
  computed: {
      OrderOperateStatus() {
          return orderInfoStatus.OrderOperateStatus
      },
      baseUrl () {
          return this.$wx.baseUrl
      }
  },
  async mounted () {
      // 加了全局mixins还原旧数据，废除以下代码
    // this.orderList = []
    if(this.$route.query.orderStatus) {
        // 获取订单状态
        this.orderStatus = this.OrderOperateStatus[this.$route.query.orderStatus]
    } else {
        this.orderStatus = false
    }
    await Promise.all([
      this.getUserOrderList()
    ])
  },
  methods: {
    // 获取用户订单数据
    async getUserOrderList () {
        const openId = wx.getStorageSync('openId')
        // this.$wx.showLoading()
        this.loading = true

        const res = await api.getUserOrderList({ openId: openId , pageNo: this.pageNo , pageSize: this.pageSize , orderStatus: this.orderStatus })               
        // this.$wx.hideLoading()
        if (res.success) {
            var arr = []
            let data = JSON.parse(res.data)      
            data.map(item => {
                item.orderStatuString = this.$wx.orderStatus(item.OrderStatus)
                arr.push(item)
            })
            this.orderList = this.orderList.concat(arr)
            this.loading = false
        } else {
            // 没有登陆请登录
            this.$wx.toLogin()
        }
        
    },
    // 选择状态
    selectStatus (status) {
        if(status) {
            this.orderStatus = status
        } else {
            this.orderStatus = false
        }
        console.log(this.orderStatus)
        this.orderList = []
        this.pageNo = 1
        this.getUserOrderList()
    },
    // 查看物流
    checkExpress (item) {
        const par = {
            Remindtype: item.Remindtype,
            Id: item.Id,
            ExpressCompanyName: item.ExpressCompanyName,
            ShipOrderNumber: item.ShipOrderNumber
        }
        this.$router.push({path: './express' , query : {data : JSON.stringify(par)}})
    },

    // 点击“去付款”
    payOrder (event) {
      let currentOrder = this.orderList[event.target.dataset.orderIndex];
      // 给pay页面传两个参数orderId,actualPrice
      // console.log('订单信息', currentOrder);
      wx.redirectTo({
        url: '../pages/pay/pay?orderId=' + currentOrder.id + '&actualPrice=' + currentOrder.actual_price
      })
    }
  },
  // 小程序原生上拉加载
  onReachBottom () {
    this.pageNo++
    this.getUserOrderList()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.pageNo = 1
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
.container{
    height:100%;
    width: 100%;
    display:flex;
    flex-direction:column;

    background: #f1f1f1;
}
.order-content {
    flex: 1;
  width: 100%;
  background: #fff;
  display: flex;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.order-head{
    position: fixed;
    top: 0;
    padding: 0 20rpx;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    height: 80rpx;
    width: 750rpx;
    background: #fff;
    z-index: 999;
    box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.2);
}
.order-head .select {
    color: #009e96;
    border-bottom: 3rpx solid #009e96;
}
.order-head .head-item{
    flex: 1;
    margin-left: 20rpx;
    color: #282828;
    font-size: 24rpx;
    line-height: 80rpx;
    text-align: center;
}
.order-head .head-item:first-child{
    margin-left: 0;
}
.order-head .head-item .active{
    border-bottom: 2rpx solid #009e96;
    color: #009e96;
}
.orders-list{
    margin-top: 80rpx;
    width: 750rpx; 
}
.orders-list .order{
    margin-top: 20rpx;
    background: #fff;
   
}
.orders-list .list-item:first-child{
    margin-top: 0;
}
.list-item .item-h{
    height: 70rpx;
    line-height: 70rpx;
    border-bottom: 2rpx solid #f1f1f1;
}
.list-item .item-h .number{
    width: 85%;
    float: left;
    color: #666;
    font-size: 24rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
}
.list-item .item-h .pending{
    /* width: 13%; */
    float: right;
    color: #009e96;
    font-size: 20rpx;
    text-align: right;
     padding: 0 20rpx;
    box-sizing: border-box;
}
.item-info{
    height: 188rpx;
    border-bottom: 2rpx solid #f1f1f1;
}
.item-info .img{
    width: 160rpx;
    height: 160rpx;
    background: #009e96;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    margin: 14rpx 20rpx 14rpx 20rpx;
}
.item-info .img image{
   width: 160rpx;
   height: 160rpx;
}
.item-info .txt{
    width: 520rpx;
    height: 160rpx;
    margin: 14rpx 20rpx 14rpx 0;
    float: left;
}
.item-info .txt .txt-t{
    height: 130rpx;
}
.item-info .txt .txt-title{  
    color: #282828;
    font-size: 24rpx;
    line-height: 35rpx;
}
.item-info .txt .txt-num{
    color: #666666;
    font-size: 24rpx;
    line-height: 30rpx;
    margin-top: 10rpx;
}
.item-info .txt .txt-price{
    height: 30rpx;
    color: #666666;
    font-size: 24rpx;
    line-height: 30rpx;
    text-align: right;
}
.item-info .txt .txt-price .t{
    font-size: 28rpx;
}
.item-check{
    height: 88rpx;
    line-height: 88rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
}
.item-check .total{
    width: 80%;
    font-size: 24rpx;
    color: #282828;
    float: left;
}
.item-check .btn{
    width: 20%;
    float: right;
}
.item-check .total .icon{
    color: #dc2121;
}
.item-check .total .t{
    color: #dc2121;
    font-size: 32rpx;
}
button::after {
  border: none;
}
button{
    background: #fff;
    margin: 0;
    padding: 0;
}
.item-check .btn .cancel{
  width: 140rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
  color: #666;
  border: 2rpx solid #666;
  margin: 22rpx 0;
  float: left;
  border-radius: 8rpx;
  margin-left: 40rpx;
}
.item-check .btn .confirm{
  width: 140rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
  color: #009e96;
  border: 2rpx solid #009e96;
  float: right;
  margin: 22rpx 0;
  border-radius: 8rpx;
}
</style>
