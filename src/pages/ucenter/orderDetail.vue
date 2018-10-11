<template >
 <view class="container">
    <view class="order-info" >
        <view class="item-a">下单时间：{{orderInfo.OrderDate}}</view>
        <view class="item-b">订单编号：{{orderInfo.Id}}</view>
        <view class="item-c">
            <view class="l">实付：<text class="cost">￥{{orderInfo.ProductTotalAmount}}</text></view>
            <view class="r">
                <view class="btn" @click="cancelOrder" v-if="canCancel">取消订单</view>
                <view class="btn active" @click="payOrder" v-if="canPay">去付款</view>
            </view>
        </view>
    </view>
    <view class="order-goods">
        <view class="h">
            <view class="label">商品信息</view>
            <view class="status">{{orderInfo.OrderStatusStr}}</view>
        </view>
        <view class="goods">
            <view class="item" v-for="(item, index) in orderGoods" :key="item.id" :data-index="index">
                <view class="img">
                    <image :src="item.ThumbnailsUrl"/>
                </view>
                <view class="info">
                    <view class="t">
                        <text class="name">{{orderInfo.ProductName}}</text>
                        
                        <text class="number">x{{orderInfo.Quantity}}</text>
                    </view>
                    <view class="attr">{{item.ParaStr}}</view>
                    <!-- <view class="price">￥{{item.ReceivedAmount}}</view> -->
                </view>
            </view>
        </view>
    </view>
    <view class="order-bottom">
        <view class="address">
            <view class="t">
                <text class="name">{{orderInfo.ShipTo}}</text>
                <text class="mobile">{{orderInfo.CellPhone}}</text>
            </view>
            <view class="b">{{orderInfo.RegionFullName + orderInfo.Address}}</view>
        </view>
        <view class="total">
            <view class="t">
                <text class="label">商品合计：</text>
                <text class="txt">￥{{orderInfo.ProductTotalAmount}}</text>
            </view>
            <view class="t">
                <text class="label">运费：</text>
                <text class="txt">￥{{orderInfo.ReceivedAmount}}</text>
            </view>
        </view>
        <view class="pay-fee">
            <text class="label">实付：</text>
            <text class="txt">￥{{orderInfo.ProductTotalAmount}}</text>
        </view>
    </view>
  
</view> 

</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import { mapState } from 'vuex'
import orderInfoStatus from '@/utils/orderInfoStatus'

export default {
  data () {
    return {
      OrderId:'',
      orderInfo: {},
      canCancel: false,
      canPay: false,
      orderGoods: []
    }
  },
  computed: {
    ...mapState(['userInfo'])  
  },
  async mounted () {
    
  },
  // 每次打开触发，更新数据
  async onShow () {
    this.orderInfo = [];
    this.orderGoods = []; 
    this.canCancel = false
    this.canPay = false
    this.OrderId = this.$route.query.Id 
    await Promise.all([
      this.getUserOrderDetail()
    ])
    this.init()
  },
  methods: {
    // 获取用户订单数据
    async getUserOrderDetail (e) {
       const openId = wx.getStorageSync('openId')
        this.$wx.showLoading()
        const res = await api.getUserOrderDetail({ openId : openId, orderId : this.OrderId });
        this.$wx.hideLoading()

        if (res.success === true) {
            const data = JSON.parse(res.data)
            console.log(data)
            this.orderInfo = data[0];
            this.orderGoods = data[1].QuoteRecord;   
            this.orderInfo.OrderStatusStr = this.$wx.orderStatus(this.orderInfo.OrderStatus)
        } else {
            this.$router.back()
        }
    },
    init () {
        const m = this.orderInfo
        console.log(m)
        // 判断是否可以取消
        if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitPay || m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitDelivery && m.PaymentType == orderInfoStatus.PaymentTypes.CashOnDelivery) {
            if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.Audited || m.Production == 1) {

            } else {
                this.canCancel = true
            }
        }
        if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitPay || (!m.IsCleared && m.OrderStatus != orderInfoStatus.OrderOperateStatus.Close && m.ReceivedAmount == 0)) {
            if (!m.IsCleared && m.ReceivedAmount == 0 && !m.IsReprint || (m.IsReprint && m.OrderTotalAmount > 0))
            {
                this.canPay = true
            }
        }
        
        
    },
    // 点击“去付款”
    async payOrder () {
      let that = this;
      const openId = wx.getStorageSync('openId')
      const miniProgram = wx.getAccountInfoSync()
      var par = {
          openId: openId,
          pappid: miniProgram.miniProgram.appId,
          orderIds: this.OrderId
      }
      this.$wx.showLoading()
      const res = await api.getSaaSQRCode(par);
      this.$wx.hideLoading()
      // console.log('订单详情页去付款,请求结果', res);

      if (res.success  ) {
          if(!res.bPay) {
            const data = JSON.parse(res.data.paySign)
            // 原生的支付方法
            wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': data.signType,
                'paySign': data.paySign,
                'success': function (res) {
                    wx.redirectTo({
                        url: '../pay/payResult?status=1&Id=' + that.OrderId
                    })
                },
                'fail': function (res) {
                    wx.redirectTo({
                        url: '../pay/payResult?status=0&Id=' + that.OrderId
                    })
                }
            });
          } else {
              this.$wx.showErrorToast('此订单已支付')
          }

      } else {
        this.$wx.showErrorToast('发起支付失败')
      }
    },
    // 点击取消订单
    cancelOrder () {
        const _this = this;
        this.$wx.showModal({
            content: `确认取消订单号为${this.OrderId}的订单?`,
        }).then(res => {
            _this.setOrderClose()
        })
    },
    // 请求取消订单接口
    async setOrderClose() {
        let par = {
            OrderId: this.OrderId,
            UserId: this.userInfo.Id
        }
        const res = await api.setOrderClose(par)
        if(res.success){
            this.$wx.showSuccessToast(res.msg)
            this.getUserOrderDetail()
        } else {
            this.$wx.showSuccessToast(res.msg)
        }

    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/ucenter/orderDetail'
    }
  }
}
</script>

<style scoped>
page{
    height: 100%;
    width: 100%;
    background: #f4f4f4;
}

.order-info{
    padding-top: 25rpx;
    background: #fff;
    height: auto;
    overflow: hidden;
    width: 100%;
}

.item-a{
    padding-left: 31.25rpx;
    height: 42.5rpx;
    padding-bottom: 12.5rpx;
    line-height: 30rpx;
    font-size: 30rpx;
    color: #666;
}

.item-b{
    padding-left: 31.25rpx;
    height: 29rpx;
    line-height: 29rpx;
    margin-top: 12.5rpx;
    margin-bottom: 41.5rpx;
    font-size: 30rpx;
    color: #666;
}

.item-c{
    margin-left: 31.25rpx;
    border-top: 1px solid #f4f4f4;
    height: 103rpx;
    line-height: 103rpx;
}

.item-c .l{
    float: left;
}

.item-c .r{
    height: 103rpx;
    float: right;
    display: flex;
    align-items: center;
    padding-right: 16rpx;
}

.item-c .r .btn{
    float: right;
}

.item-c .cost{
    color: #b4282d;
}

.item-c .btn{
    line-height: 66rpx;
    border-radius: 5rpx;
    text-align: center;
    margin: 0 15rpx;
    padding: 0 20rpx;
    height: 66rpx;
}

.item-c .btn.active{
    background: #b4282d;
    color: #fff;
}

.order-goods{
    margin-top: 20rpx;
    background: #fff;
    width: 100%;
}

.order-goods .h{
    height: 93.75rpx;
    line-height: 93.75rpx;
    margin-left: 31.25rpx;
    border-bottom: 1px solid #f4f4f4;
    padding-right: 31.25rpx;
}

.order-goods .h .label{
    float: left;
    font-size: 30rpx;
    color: #333;
}

.order-goods .h .status{
    float: right;
    font-size: 30rpx;
    color: #b4282d;
}

.order-goods .item{
    display: flex;
    align-items: center;
    height: 192rpx;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    border-bottom: 1px solid #f4f4f4;
}

.order-goods .item:last-child{
    border-bottom: none;
}

.order-goods .item .img{
    height: 145.83rpx;
    width: 145.83rpx;
    background: #f4f4f4;
}

.order-goods .item .img image{
    height: 145.83rpx;
    width: 145.83rpx;
}

.order-goods .item .info{
    flex: 1;
    height: 145.83rpx;
    margin-left: 20rpx;
}

.order-goods .item .t{
    margin-top: 8rpx;
    height: 33rpx;
    line-height: 33rpx;
    margin-bottom: 10.5rpx;
}

.order-goods .item .t .name{
    display: block;
    float: left;
    height: 33rpx;
    line-height: 33rpx;
    color: #333;
    font-size: 30rpx;
}

.order-goods .item .t .number{
    display: block;
    float: right;
    height: 33rpx;
    text-align: right;
    line-height: 33rpx;
    color: #333;
    font-size: 30rpx;
}

.order-goods .item .attr{
    height: 29rpx;
    line-height: 29rpx;
    color: #666;
    margin-bottom: 25rpx;
    font-size: 25rpx;
}

.order-goods .item .price{
    height: 30rpx;
    line-height: 30rpx;
    color: #333;
    font-size: 30rpx;
}

.order-bottom{
    margin-top: 20rpx;
    padding-left: 31.25rpx;
    height: auto;
    overflow: hidden;
    background: #fff;
    width: 100%;
}

.order-bottom .address{
    height: 128rpx;
    padding-top: 25rpx;
    border-bottom: 1px solid #f4f4f4;
}

.order-bottom .address .t{
    height: 35rpx;
    line-height: 35rpx;
    margin-bottom: 7.5rpx;
}

.order-bottom .address .name{
    display: inline-block;
    height: 35rpx;
    width: 140rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .address .mobile{
    display: inline-block;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .address .b{
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .total{
    height: 106rpx;
    padding-top: 20rpx;
    border-bottom: 1px solid #f4f4f4;
}

.order-bottom .total .t{
    height: 25rpx;
    line-height: 25rpx;
    margin-bottom: 7.5rpx;
    display: flex;
}

.order-bottom .total .label{
    width: 140rpx;
    display: inline-block;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .total .txt{
    flex: 1;
    display: inline-block;
    height: 35rpx;
    line-height: 35rpx;
    font-size: 25rpx;
}

.order-bottom .pay-fee{
    height: 81rpx;
    line-height: 81rpx;
}

.order-bottom .pay-fee .label{
    display: inline-block;
    width: 140rpx;
    color: #b4282d;
}

.order-bottom .pay-fee .txt{
    display: inline-block;
    width: 140rpx;
    color: #b4282d;
}
</style>
