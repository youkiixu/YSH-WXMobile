<template>
    <div>
        <div class="showMoney">
            <div class="showMoney_money">￥<text>{{activityBalance}}</text></div>
            <div class="showMoney_trips">耗材预存余额</div>
        </div>
        <div class="line"></div>
        <div class="input_region">
            <div class="input_regionTitle">充值金额：</div>
            <div class="input_regionMoney">
                <input placeholder="请输入充值金额（最低为200元的整数）"
                       type="digit"
                       v-model="chargeAmount" />
            </div>
        </div>
        <div class="input_trips">
            <text>充值提示：</text>
            <text>1.首次充值满200元即送实物礼包，</text>
            <text>2.本次活动充值预存只能用于支付广告物料直营店的订单，其他店铺订单无法使用；</text>
            <text>3.活动的预存款不能发起提现。</text>
        </div>
        <div class="pay_bottom">
            <div class="pay_bottomMoney">支付金额：<text>{{chargeAmount ? chargeAmount : 0}}</text></div>
            <div class="pay_bottomBtn"
                 @click="payMoney">确认支付</div>
        </div>
    </div>
</template>
<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState , mapActions } from "vuex";

export default {
    data() {
        return {
            amount: 0,
            chargeAmount: ""
        };
    },
    computed: {
        ...mapState(["userInfo" , "activityBalance"])
    },
    mounted() {
        this.checkLogin();

        // this.getdata()
    },
    methods: {
        ...mapActions([
            'getActivityBalance'
        ]),
        async payMoney() {
            const _this = this;
            const openId = wx.getStorageSync("openId");
            this.checkLogin();
            if (this.chargeAmount == "") {
                this.$wx.showErrorToast("请输入充值金额");
                return;
            } 
            // else if (this.chargeAmount < 200) {
            //     this.$wx.showErrorToast("不能低于200");
            //     return;
            // }

            this.$wx.showLoading();
            const res = await api.shopChargeSubmitYSH({
                openid: openId,
                intScanner: this.userInfo.Id,
                ChargeAmount: this.chargeAmount,
                PayOrderType : 11,
                EventId: 24,
                PackageId: 26
            });
            this.$wx.hideLoading();
            if (res.success) {
                const data = JSON.parse(res.paySign);
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success: function(res) {
                        _this.$wx.showSuccessToast("充值成功！");
                        _this.refresh();
                    },
                    fail: function(res) {
                        _this.$wx.showErrorToast("充值失败！");
                        _this.refresh();
                    }
                });
            } else {
                this.$wx.showErrorToast(res.msg);
            }
        },
        refresh() {
            this.chargeAmount = "";
            this.getActivityBalance();
        },
        checkLogin() {
            const openId = wx.getStorageSync("openId");
            if (!openId) {
                this.$wx
                    .showModal({
                        title: "请先登录",
                        content: "需要登录才能充值",
                        showCancel: true
                    })
                    .then(res => {
                        this.$router.push({
                            path: "../pages/ucenter/login"
                        });
                    })
                    .catch(ex => {
                        this.$router.back();
                    });
            }
        },
        setTitle(text) {
            wx.setNavigationBarTitle({
                title: text
            });
        }
    },
    onPullDownRefresh: function() {
        this.refresh();
        wx.stopPullDownRefresh();
    },
    watch: {
        userInfo() {
            // 检测用户登陆状态，是否读取新数据
            console.log(
                "检测用户登陆状态，是否读取新数据:",
                util.getCurrentPageUrl()
            );
            const currentUrl = util.getCurrentPageUrl();
            if (currentUrl == "pages/ucenter/login") {
                this.refresh();
            }
        }
    }
};
</script>
<style scoped>
page {
    width: 750rpx;
    height: 100%;
    background: #fff;
}
.showMoney {
    height: 240rpx;
    width: 750rpx;
    padding-top: 70rpx;
    box-sizing: border-box;
    border-top: 2rpx solid #f1f1f1;
}
.showMoney_money {
    height: 80rpx;
    line-height: 80rpx;
    font-size: 48rpx;
    color: #fb9e15;
    text-align: center;
    font-weight: bold;
}
.showMoney_money text {
    font-size: 72rpx;
}
.showMoney_trips {
    font-size: 30rpx;
    color: #bdbfbf;
    text-align: center;
    height: 50rpx;
    line-height: 50rpx;
}
.line {
    width: 750rpx;
    height: 18rpx;
    background: #f1f1f1;
}
.input_region {
    width: 750rpx;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
}
.input_regionTitle {
    font-size: 30rpx;
    color: #434343;
    font-weight: bold;
}
.input_regionMoney {
    width: 100%;
    height: 145rpx;
    margin-top: 35rpx;
}
.input_regionMoney input {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    font-size: 30rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    line-height: 145rpx;
    border-radius: 7rpx;
}
.input_trips {
    width: 750rpx;
    padding: 50rpx 30rpx;
    box-sizing: border-box;
}
.input_trips text {
    font-size: 24rpx;
    color: #b3b2b2;
    display: block;
    line-height: 40rpx;
}
.pay_bottom {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 750rpx;
    height: 190rpx;
    padding: 20rpx 35rpx;
    box-sizing: border-box;
    z-index: 99;
}
.pay_bottomMoney {
    height: 70rpx;
    width: 100%;
    text-align: center;
    line-height: 70rpx;
    color: #434343;
    font-size: 30rpx;
    font-weight: bold;
}
.pay_bottomMoney text {
    font-size: 48rpx;
    color: #ff9800;
}
.pay_bottomBtn {
    height: 78rpx;
    width: 100%;
    text-align: center;
    line-height: 78rpx;
    color: #fff;
    font-size: 36rpx;
    margin: 0 auto;
    border-radius: 40rpx;
    background: #ff9800;
}
</style>


