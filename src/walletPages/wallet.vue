<template>
    <div class="page">
        <div class="main">
            <div class="main-money">
                <span class="money-size">￥</span>{{balance}}
            </div>
            <div class="main-text">
                账户余额
            </div>
        </div>
        <div class="main-detail">
            <div class="weui-cells weui-cells_after-title main-detial-item">
                <div class="weui-cell weui-cell_access main-detial-item" @click="toDetail">
                    <div class="weui-cell__hd">
                        <image src="/static/images/moneydetail.png"
                               style="margin-right: 5px;vertical-align: middle;width:20px; height: 20px;"></image>
                    </div>
                    <div class="weui-cell__bd">账户明细</div>
                    <div class="weui-cell__ft weui-cell__ft_in-access"></div>
                </div>
            </div>
        </div>
        <div class="deposit-btn"
             @click="toDeposit">充值</div>
    </div>
</template>


<script>
import api from "@/utils/api";
import util from "@/utils/util";
import { mapState, mapActions } from "vuex";
export default {
    data() {
        return {};
    },
    computed: {
        ...mapState(["userInfo", "balance"])
    },
    mounted() {
        this.getbalance()
    },
    methods: {
        ...mapActions(["getbalance"]),
        toDeposit() {
            this.$router.push("/walletPages/deposit");
        },
        toDetail () {
            this.$router.push("/walletPages/detail");
        },
        refresh() {
            this.getbalance();
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
.page {
    height: 100vh;
    width: 100vw;
    background: #f1f1f1;
    border: none;
}
.main {
    position: relative;
    height: 215rpx;
    background: #fff;
    text-align: center;
    padding-top: 30rpx;
}
.main-money {
    font-size: 72rpx;
    color: #009e96;
}
.money-size {
    font-size: 48rpx;
}
.main-text {
    display: block;
    font-size: 30rpx;
    color: #bdbfbf;
}
.main-detail {
    margin-top: 24rpx;
}
.main-detial-item {
    border: none;
}
.deposit-btn {
    position: fixed;
    bottom: 40rpx;
    left: 25rpx;
    width: 700rpx;
    height: 85rpx;
    background: #009e96;
    line-height: 85rpx;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    border-radius: 6rpx;
    box-shadow: 4rpx 4rpx 16rpx rgba(0, 150, 158, 0.6);
}
</style>