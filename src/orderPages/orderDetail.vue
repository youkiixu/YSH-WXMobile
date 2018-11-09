<template >
 <view class="container">
    <scroll-view scroll-y class="order-content" v-if="!loading">
        <view class="order-info" >
            <view class="info-item">订单状态：<text class="t">{{orderInfo.OrderStatusStr}}</text><text v-if="orderInfo.CloseReason"> ({{orderInfo.CloseReason}})</text></view>
            <view class="info-item">订单编号：{{orderInfo.Id}}</view>
            <view class="info-item">下单时间：{{orderInfo.OrderDate}}</view>
        </view>
        <view class="address-info">
            <view class="address-item">收货人：<text class="t ShipTo">{{orderInfo.ShipTo}} {{orderInfo.CellPhone}}</text></view>
            <view class="address-item clear"><view class="address-item-l">收货地址：</view><view class="address-item-r"><text class="t">{{orderInfo.RegionFullName + orderInfo.Address}}</text></view></view>
            <view class="address-item">配送方式：<text class="t">{{orderInfo.RemindtypeStr}}</text></view>
        </view>

        <view class="goods-info">
            <view class="info-t clear">
                <view class="img">
                    <image :src="baseUrl + orderInfo.ThumbnailsUrl + '/1_350.png'"/>
                </view>
                <view class="txt">
                    <view class="txt-t">
                        <view class="txt-title">{{orderInfo.ProductName}}</view>
                        <view class="txt-num">共{{orderInfo.Quantity}}件商品</view>
                    </view>
                    <view class="txt-price">价格：￥<text class="t">{{orderInfo.ProductTotalAmount}}</text></view>
                </view>
            </view>
            <view class="info-bottom">
                <view class="m" v-if="orderInfo.Color">颜色：<text class="t">{{orderInfo.Color}}</text></view>
                <view class="m" v-if="orderInfo.Size">尺寸：<text class="t">{{orderInfo.Size}}</text></view>
                <view class="m" v-if="orderInfo.Version">规格：<text class="t">{{orderInfo.Version}}</text></view>
                <view class="m" v-if="orderInfo.Material">材料：<text class="t">{{orderInfo.Material}}</text></view>
                <view class="m" v-if="orderInfo.Fashion">款式：<text class="t">{{orderInfo.Fashion}}</text></view>
                <view class="m" v-if="orderInfo.Grams">克重：<text class="t">{{orderInfo.Grams}}</text></view>
                <view class="m" v-if="orderInfo.Ensemble">套餐：<text class="t">{{orderInfo.Ensemble}}</text></view>      
                <view class="m" v-if="item.ParaStr" v-for="(item , index) in orderGoods" :key="index" >
                    <text class="t" >{{item.ParaStr}}</text>
                </view>        
            </view>
        </view>
    

        <view class="message-info clear">
            <view class="l">留言:</view>
            <view class="r">{{orderInfo.OrderRemarks ? orderInfo.OrderRemarks : ''}}</view>
        </view>

        <view class="price-total">
            <view class="product-price clear">
                <view class="l">商品金额</view>
                <view class="r">￥{{orderInfo.ProductTotalAmount}}</view>
            </view>
            <view class="product-price clear">
                <view class="l">已付金额</view>
                <view class="r">￥{{orderInfo.ReceivedAmount}}</view>
            </view>
            <view class="express-price clear">
                <view class="l">运费</view>
                <view class="r">￥{{orderInfo.Freight}}</view>
            </view>
            <view class="actual-pay">
                实际支付：<text class="t">￥ {{orderInfo.ProductTotalAmount + orderInfo.Freight}}</text>
            </view>
        </view>

    </scroll-view>

    <view class="order-bottom clear" v-if="!loading">
        <view class="total">
            合计：<text class="icon">￥</text><text class="t">{{orderInfo.ProductTotalAmount + orderInfo.Freight - orderInfo.ReceivedAmount}}</text>
        </view>
        <view class="btn">
            <button class="cancel" v-if="canCancel" @click="cancelOrder">取消订单</button>
            <button class="confirm" v-if="canPay" @click="payOrder">确认支付</button> 
        </view>
    </view>
    <loadingComponent v-if="loading"></loadingComponent>

</view> 

</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import { mapState } from 'vuex'
import orderInfoStatus from '@/utils/orderInfoStatus'
import loadingComponent from '@/components/loadingComponent'
import express from '@/utils/express'

export default {
    components: {
      loadingComponent  
    },
  data () {
    return {
      OrderId:'',
      orderInfo: {},
      canCancel: false,
      canPay: false,
      orderGoods: [],
      loading: true
    }
  },
  computed: {
    ...mapState(['userInfo']) ,
    baseUrl () {
        return this.$wx.baseUrl
    } 
  },
  // 每次打开触发，更新数据
  async mounted () {
    this.OrderId = this.$route.query.Id 
    await Promise.all([
      this.getUserOrderDetail()
    ])
    this.loading = false
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
            this.orderInfo = data[0]; 
            this.orderGoods = data[1].QuoteRecord;   
            this.orderInfo.OrderStatusStr = this.$wx.orderStatus(this.orderInfo.OrderStatus)
            this.orderInfo.RemindtypeStr = express.wuliuStr(this.orderInfo.Remindtype)
            // 判断按钮可不可以用
            this.init()
        } else {
            this.$router.back()
        }
    },
    init () { 
        const m = this.orderInfo
        this.canCancel = false
        this.canPay = false
        // 判断是否可以取消
        if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitPay || m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitDelivery && m.PaymentType == orderInfoStatus.PaymentTypes.CashOnDelivery) {
            if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.Audited || m.Production == 1) {

            } else {
                this.canCancel = true
            }
        } 

        if(!m.IsCleared && m.OrderStatus != orderInfoStatus.OrderOperateStatus.Close && !m.IsReprint ) {
            this.canPay = true
        }
        // if(m.OrderStatus == orderInfoStatus.OrderOperateStatus.WaitPay || (!m.IsCleared && m.OrderStatus != orderInfoStatus.OrderOperateStatus.Close && m.ReceivedAmount == 0)) {
        //     if (!m.IsCleared && m.ReceivedAmount == 0 && !m.IsReprint || (m.IsReprint && m.OrderTotalAmount > 0))
        //     {
        //         this.canPay = true
        //     }
        // }
        
        
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
                        url: '../pages/pay/payResult?status=1&Id=' + that.OrderId
                    })
                },
                'fail': function (res) {
                    wx.redirectTo({
                        url: '../pages/pay/payResult?status=0&Id=' + that.OrderId
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
            showCancel: true
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
        this.$wx.showLoading()
        const res = await api.setOrderClose(par)
        this.$wx.hideLoading()
        if(res.success){
            this.$wx.showSuccessToast(res.msg)
            this.getUserOrderDetail()
        } else {
            this.$wx.showErrorToast(res.msg)
        }

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
.order-content{
    margin-bottom: 100rpx;
}
.order-info{
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    background: #fff;
    height: auto;
    overflow: hidden;
    width: 100%;
    border-top: 2rpx solid #f1f1f1;
}

.info-item{
    height: 40rpx;
    line-height: 40rpx;
    font-size: 26rpx;
    color: #666;
}
.info-item .t{
    color: #009e96;
    font-size: 28rpx;
}
.address-info{
    background-color: #fff;
    width: 100%;
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.address-info .address-item{
    font-size: 26rpx;
    color: #666;
    line-height: 40rpx;
}
.address-info .address-item .t{
    color: #282828;
    padding-left: 6rpx;
}
.address-info .address-item .address-item-l{
    width: 19%;
    float: left;
}
.address-info .address-item .address-item-r{
    width: 78%;
    float: left;
}
.address-info .address-item .address-item-r .t{
    padding-left: 0;
}
.address-info .address-item .ShipTo{
    padding-left: 34rpx;
}
.goods-info{
    background-color: #fff;
    width: 100%;
    padding: 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.info-bottom{
    padding-top: 10rpx;
    box-sizing: border-box;  
}
.info-bottom .m{
     line-height: 40rpx;
     color: #666666;
     font-size: 26rpx;
}
.info-bottom .m .t{
     color: #282828;
}
.info-t{
    /* height: 188rpx; */
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
    margin: 0 20rpx 20rpx 0;
}
.goods-info .img image{
   width: 160rpx;
   height: 160rpx;
}
.goods-info .txt{
    width: 520rpx;
    height: 160rpx;
    margin: 0 0 20rpx 0;
    float: left;
}
.goods-info .txt .txt-t{
    height: 130rpx;
}
.goods-info .txt .txt-title{  
    color: #282828;
    font-size: 26rpx;
    line-height: 40rpx;
}
.goods-info .txt .txt-num{
    color: #666666;
    font-size: 26rpx;
    line-height: 40rpx;
}
.goods-info .txt .txt-price{
    height: 30rpx;
    color: #666666;
    font-size: 26rpx;
    line-height: 40rpx;
    text-align: right;
}
.goods-info .txt .txt-price .t{
    font-size: 28rpx;
}
.message-info{
    background-color: #fff;
    width: 750rpx;
    margin-top: 20rpx;
    /* height: 60rpx; */
    line-height: 40rpx;
    font-size: 26rpx;
    color: #666;
    padding: 20rpx;
    box-sizing: border-box;
}
.message-info .l{
    width: 10%;
    float: left;
}
.message-info .r{
    width: 88%;
    float: right;
    color: #282828;
}
.price-total{
    background-color: #fff;
    width: 100%;
    padding: 10rpx 20rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
}
.price-total .l{
    width: 25%;
    float: left;
    line-height: 40rpx;
    font-size: 26rpx;
    color: #666666;
}
.price-total .r{
    width: 75%;
    float: right;
    line-height: 40rpx;
    text-align: right;
    font-size: 26rpx;
    color: #282828;
}
.price-total .actual-pay{
    font-size: 26rpx;
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
    padding: 0 20rpx;
    box-sizing: border-box;
    box-shadow: 0 -3px 0 #f1f1f1;
}
.order-bottom .total{
    width: 48%;
    font-size: 26rpx;
    color: #282828;
    float: left;
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
  width: 160rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 26rpx;
  color: #666;
  border: 2rpx solid #666;
  margin: 20rpx 0;
  float: left;
  border-radius: 8rpx;
  margin-left: 20rpx;
}
.order-bottom .btn .confirm{
  width: 160rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 26rpx;
  color: #fff;
  background: #009e96;
  float: right;
  margin: 20rpx 0;
  border-radius: 8rpx;
}



</style>
