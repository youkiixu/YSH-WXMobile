<template >
<div class="container">
  <div class="pay-result" v-if="show">
    <div class="success" v-if="status == true">
      <div class="msg">{{isShopping ? '下单成功' : '付款成功'}}</div>
      <div class="btns">
        <navigator class="btn" url="../../orderPages/order" open-type="redirect">查看订单</navigator>
        <navigator class="btn" url="../index/index" open-type="switchTab">继续逛</navigator>
      </div>
    </div>
    <div class="error" v-if="status != true">
      <div class="msg">付款失败</div>
      <div class="tips">
        <div class="p">请在在个人订单内完成付款</div>
        <!-- <div class="p">否则订单将会被系统取消</div> -->
      </div>
      <div class="btns">
        <navigator class="btn" url="../../orderPages/order" open-type="redirect">查看订单</navigator>
        <navigator class="btn" url="../index/index" open-type="switchTab">继续逛</navigator>
      </div>
    </div>
  </div>
</div>
</template>

<script>
// import api from '@/utils/api'
import wx from 'wx'
import pay from '@/services/pay'
import util from '@/utils/util'

export default {
  data () {
    return {
      status: false,
      orderId: 0,
      isShopping: false,
      show: false
    }
  },
  async mounted () {
    if (this.$route.query.status) {
      this.status = this.$route.query.status;
    }
    // 如果是下单页跳转过来
    if(this.$route.query.isShopping) {
      this.isShopping = this.$route.query.isShopping
    }
    this.orderId = this.$route.query.Id
    this.show = true
  },
  methods: {
    // 返回订单详情页
    redirectToOrderDetail () {
      wx.redirectTo({
        url: '../ucenter/orderDetail?Id=' + this.orderId
      })
    },
    // 重新付款
    payOrder () {
      pay.payOrder(parseInt(this.orderId)).then(res => {
        this.status = true;
      }).catch(res => {
        util.showErrorToast('支付失败');
      });
    }
  }
}
</script>

<style scoped>
page {
  min-height: 100%;
  width: 100%;
  background: #fff;
}

.container {
  height: 100%;
  background: #fff;
}

.pay-result {
  background: #fff;
}

.pay-result .msg {
  text-align: center;
  margin: 100rpx auto;
  color: #2bab25;
  font-size: 36rpx;
}

.pay-result .btns {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pay-result .btn {
  text-align: center;
  height: 80rpx;
  margin: 0 20rpx;
  width: 200rpx;
  line-height: 78rpx;
  border: 1px solid #868686;
  color: #000000;
  border-radius: 5rpx;
}

.pay-result .error .msg {
  color: #b4282d;
  margin-bottom: 60rpx;
}

.pay-result .error .tips {
  color: #7f7f7f;
  margin-bottom: 70rpx;
}

.pay-result .error .tips .p {
  font-size: 24rpx;
  line-height: 42rpx;
  text-align: center;
}

.pay-result .error .tips .p {
  line-height: 42rpx;
  text-align: center;
}
</style>
