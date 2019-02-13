<template>
    <div class="page">
        <div class="list-item clearfix"
             v-for="(item , index) in list"
             :key="index">
            <div class="item-left">
                <div class="item-left-name">余额：{{item.LastAmount}}</div>
                <div class="item-left-time">{{item.CreateTime}}</div>
            </div>
            <div class="item-right">{{item.Amount}}</div>
        </div>
    </div>
</template>

<script>
import api from "@/utils/api";
import { mapState } from "vuex";
export default {
    data() {
        return {
            EventId: undefined,
            list: [],
            rowIndex: 0
        };
    },
    computed: {
        ...mapState(["userInfo"])
    },
    beforeMount() {
        
    },
    mounted() {
        this.refresh();
    },
    methods: {
        async getRechargeEventYSHList() {
            if (this.$route.query.EventId) {
                this.EventId = this.$route.query.EventId;
            } else {
                this.EventId = undefined;
            }
            this.rowIndex++;
            let par = {
                "@UserId": this.userInfo.Id,
                "@rowIndex": this.rowIndex
            };
            if (this.EventId) {
                par = Object.assign(par, {
                    "@EventId": this.EventId
                });
            }
            this.$wx.showLoading();
            const res = await api.getUserFinancingList(par);
            this.$wx.hideLoading();
            if (res.success) {
                this.list = this.list.concat(res.data);
            }
        },
        refresh() {
            this.list = [];
            this.rowIndex = 0;
            this.getRechargeEventYSHList();
        }
    },
    // 小程序原生上拉加载
    async onReachBottom() {
        this.getRechargeEventYSHList();
    },
    // 小程序原生下拉刷新
    onPullDownRefresh: function() {
        this.refresh();
        wx.stopPullDownRefresh();
    }
};
</script>

<style scoped>
.page {
    border: none;
}
.weui-form-preview {
    margin-top: 20rpx;
}
.list-item {
    position: relative;
    width: 690rpx;
    margin: 0 auto;
    border-bottom: 1rpx solid #e5e5e5;
    /* background: red; */
    height: 115rpx;
}
.item-left {
    float: left;
    padding-top: 15rpx;
}
.item-left-name {
    font-size: 30rpx;
    color: #333333;
    font-weight: 600;
}
.item-left-time {
    font-size: 24rpx;
    color: #bdbfbf;
}
.item-right {
    float: right;
    height: 115rpx;
    line-height: 115rpx;
    font-size: #bdbfbf;
}
</style>