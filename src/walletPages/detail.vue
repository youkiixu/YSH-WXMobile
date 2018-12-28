<template>
    <div class="page">
        <div class="list-item clearfix">
            <div class="item-left">
                <div class="item-left-name">退款</div>
                <div class="item-left-time">2018/12/26 9:01:02</div>
            </div>
            <div class="item-right">+42.1</div>
        </div>
        <div class="list-item clearfix">
            <div class="item-left">
                <div class="item-left-name">退款</div>
                <div class="item-left-time">2018/12/26 9:01:02</div>
            </div>
            <div class="item-right">+42.1</div>
        </div>
        <div class="list-item clearfix">
            <div class="item-left">
                <div class="item-left-name">退款</div>
                <div class="item-left-time">2018/12/26 9:01:02</div>
            </div>
            <div class="item-right">+42.1</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {};
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