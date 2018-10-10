<template >
 <view class="container">
    <view class="order-info" >
        <view class="info-item">订单状态：<text class="t">{{orderInfo.OrderStatus}}</text></view>
        <view class="info-item">订单编号：{{orderInfo.Id}}</view>
        <view class="info-item">下单时间：{{orderInfo.OrderDate}}</view>
        <!-- <view class="item-c">
            <view class="l">实付：<text class="cost">￥{{orderInfo.ProductTotalAmount}}</text></view>
            <view class="r">
                <view class="btn" @click="cancelOrder" v-if="canCancel">取消订单</view>
                <view class="btn active" @click="payOrder" v-if="canPay">去付款</view>
            </view>
        </view> -->
    </view>
    <view class="address-info">
        <view class="address-item">收货人：<text class="t">{{orderInfo.ShipTo}} {{orderInfo.CellPhone}}</text></view>
        <view class="address-item">收货地址：<text class="t">{{orderInfo.RegionFullName + orderInfo.Address}}</text></view>
        <view class="address-item">配送方式：<text class="t">{{orderInfo.RemindtypeStr}}</text></view>
    </view>

    <view class="goods-info">
        <view class="info-t clear">
        <view class="img">
            <image :src="orderInfo.ThumbnailsUrl"/>
        </view>
        <view class="txt">
            <view class="txt-t">
                <view class="txt-title">{{orderInfo.ProductName}}</view>
                <view class="txt-num">共{{orderInfo.Quantity}}件商品</view>
            </view>
            <view class="txt-price">价格：￥<text class="t">{{orderInfo.ProductTotalAmount}}</text></view>
        </view>
    </view>
        <!-- <view class="info-bottom">
            <view class="m" v-if="orderInfo.products.Color">颜色：{{orderInfo.products.Color}}</view>
            <view class="m" v-if="orderInfo.products.Size">尺寸：{{orderInfo.products.Size}}</view>
            <view class="m" v-if="orderInfo.products.Version">规格：{{orderInfo.products.Version}}</view>
            <view class="m" v-if="orderInfo.products.Material">材料：{{orderInfo.products.Material}}</view>
            <view class="m" v-if="orderInfo.products.Fashion">款式：{{orderInfo.products.Fashion}}</view>
            <view class="m" v-if="orderInfo.products.Grams">克重：{{orderInfo.products.Grams}}</view>
            <view class="m" v-if="orderInfo.products.Ensemble">套餐：{{orderInfo.products.Ensemble}}</view>
        </view> -->
    </view>
    

    <view class="message-info clear">
        <view class="l">留言:</view>
        <view class="r"></view>
    </view>

    <view class="price-total">
        <view class="product-price clear">
            <view class="l">商品金额</view>
            <view class="r">￥{{orderInfo.ProductTotalAmount}}</view>
        </view>
        <view class="express-price clear">
            <view class="l">运费</view>
            <view class="r">￥{{orderInfo.ReceivedAmount}}</view>
        </view>
        <view class="actual-pay">
            实际支付：<text class="t">￥ {{orderInfo.ProductTotalAmount + orderInfo.ReceivedAmount}}</text>
        </view>
    </view>

    <view class="order-bottom clear">
        <view class="total">
            合计：<text class="icon">￥</text><text class="t">{{orderInfo.ProductTotalAmount + orderInfo.ReceivedAmount}}</text>
        </view>
        <view class="btn">
            <button class="cancel">取消订单</button>
            <button class="confirm" @click="payOrder">确认支付</button> 
        </view>
    </view>




    <!-- <view class="order-goods">
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
                    
                </view>
            </view>
        </view>
    </view> -->

<!-- <view class="price">￥{{item.ReceivedAmount}}</view> -->

    <!-- <view class="order-bottom">
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
    </view> -->
  
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
        console.log(orderInfoStatus)
        // 判断是否可以取消
        if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitPay || m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitDelivery && m.PaymentType == orderInfoStatus.PaymentTypes.CashOnDelivery) {
            if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.Audited || m.Production == 1) {

            } else {
                this.canCancel = true
            }
        }

        if (!m.IsCleared && m.ReceivedAmount == 0 && !m.IsReprint || (m.IsReprint && m.OrderTotalAmount > 0))
        {
            this.canPay = true
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
.container{
    background: #f1f1f1;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
}

.order-info{
    padding: 20rpx;
    box-sizing: border-box;
    background: #fff;
    height: auto;
    overflow: hidden;
    width: 100%;
}

.info-item{
    height: 40rpx;
    line-height: 40rpx;
    font-size: 24rpx;
    color: #666;
}
.info-item .t{
    color: #009e96;
    font-size: 28rpx;
}
.address-info{
    background-color: #fff;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.address-info .address-item{
    font-size: 24rpx;
    color: #666;
    line-height: 35rpx;
}
.address-info .address-item .t{
    color: #282828;
}
.goods-info{
    background-color: #fff;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.info-bottom{
    height: 72.25rpx;
    color: #999;
}
.info-t{
    height: 188rpx;
    border-bottom: 2rpx solid #f1f1f1;
}
.goods-info .img{
    width: 160rpx;
    height: 160rpx;
    background: #009e96;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    margin: 14rpx 20rpx 14rpx 0;
}
.goods-info .img image{
   width: 160rpx;
   height: 160rpx;
}
.goods-info .txt{
    width: 520rpx;
    height: 160rpx;
    margin: 14rpx 0 14rpx 0;
    float: left;
}
.goods-info .txt .txt-t{
    height: 130rpx;
}
.goods-info .txt .txt-title{  
    color: #282828;
    font-size: 24rpx;
    line-height: 35rpx;
}
.goods-info .txt .txt-num{
    color: #666666;
    font-size: 24rpx;
    line-height: 30rpx;
    margin-top: 10rpx;
}
.goods-info .txt .txt-price{
    height: 30rpx;
    color: #666666;
    font-size: 24rpx;
    line-height: 30rpx;
    text-align: right;
}
.goods-info .txt .txt-price .t{
    font-size: 28rpx;
}
.message-info{
    background-color: #fff;
    width: 100%;
    margin-top: 20rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 24rpx;
    color: #666;
    padding: 0 20rpx;
    box-sizing: border-box;
}
.message-info .l{
    width: 10%;
    float: left;
}
.message-info .r{
    width: 80%;
    float: right;
}
.price-total{
    background-color: #fff;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.price-total .l{
    width: 25%;
    height: 60rpx;
    float: left;
    line-height: 65rpx;
    font-size: 24rpx;
    color: #666666;
}
.price-total .r{
    width: 75%;
    height: 60rpx;
    float: right;
    line-height: 65rpx;
    text-align: right;
    font-size: 24rpx;
    color: #282828;
}
.price-total .actual-pay{
    font-size: 24rpx;
    color: #666;
    text-align: right;
}
.price-total .actual-pay .t{
    font-size: 28rpx;
    color: #dc2121;
}
.order-bottom {
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    position: fixed;
    z-index: 100;
    bottom: 0;
    background-color: #fff;
    padding: 20rpx 20rpx;
    box-sizing: border-box;
    box-shadow: 0 -2px 0 #f5f5f5;
}
.order-bottom .total{
    width: 48%;
    font-size: 24rpx;
    color: #282828;
    float: left;
    border: 1rpx solid red;
}
.order-bottom .btn{
    width: 50%;
    float: right;
}
.order-bottom .total .icon{
    color: #dc2121;
}
.order-bottom .total .t{
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
.order-bottom .btn .cancel{
  width: 140rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
  color: #666;
  border: 2rpx solid #666;
  margin: 25rpx 0;
  float: left;
  border-radius: 8rpx;
  margin-left: 40rpx;
}
.order-bottom .btn .confirm{
  width: 140rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
  color: #fff;
  background: #009e96;
  float: right;
  margin: 25rpx 0;
  border-radius: 8rpx;
}



</style>
