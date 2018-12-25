<template>
    <div>
        <div class="showMoney">
            <div class="showMoney_money">￥<text>200.00</text></div>
            <div class="showMoney_trips">耗材预存余额</div>
        </div>
        <div class="line"></div>
        <div class="input_region">
            <div class="input_regionTitle">充值金额：</div>
            <div class="input_regionMoney">
                <input placeholder="请输入充值金额（最低为200元的整数）" />
            </div>
        </div>
        <div class="input_trips">
            <text>充值提示：</text>
            <text>1.首次充值满200元即送实物礼包，</text>
            <text>2.本次活动充值预存只能用于支付广告物料直营店的订单，其他店铺订单无法使用；</text>
            <text>3.活动的预存款不能发起提现。</text>
        </div>
        <div class="pay_bottom">
            <div class="pay_bottomMoney">支付金额：<text>200.00</text></div>
            <div class="pay_bottomBtn">确认支付</div>
        </div>
    </div>    
</template>
<script>
export default {
    
}
</script>
<style scoped>
page{
width: 750rpx;
height: 100%;  
background: #fff;
}
.showMoney{
    height: 240rpx;
    width: 750rpx;
    padding-top: 70rpx;
    box-sizing: border-box;
    border-top: 2rpx solid #f1f1f1;
}
.showMoney_money{
    height: 80rpx;
    line-height: 80rpx;
    font-size: 48rpx;
    color: #fb9e15;
    text-align: center;
    font-weight: bold;
}
.showMoney_money text{
    font-size: 72rpx;
}
.showMoney_trips{
    font-size: 30rpx;
    color: #bdbfbf;
    text-align: center;
    height: 50rpx;
    line-height: 50rpx;
}
.line{
    width: 750rpx;
    height: 18rpx;
    background: #f1f1f1;
}
.input_region{
    width: 750rpx;
    padding: 20rpx 30rpx;
    box-sizing: border-box;
}
.input_regionTitle{
    font-size: 30rpx;
    color: #434343;
    font-weight: bold;
}
.input_regionMoney{
    width: 100%;
    height: 145rpx;
    margin-top: 35rpx;
}
.input_regionMoney input{
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    font-size: 30rpx;
    padding:  0 30rpx;
    box-sizing: border-box;
    line-height: 145rpx;
    border-radius: 7rpx;
}
.input_trips{
    width: 750rpx;
    padding: 50rpx 30rpx;
    box-sizing: border-box;
}
.input_trips text{
    font-size: 24rpx;
    color: #b3b2b2;
    display: block;
    line-height: 40rpx;
}
.pay_bottom{
    position:fixed;
    left:0;
    bottom:0;
    width: 750rpx;
    height: 190rpx;
    padding: 20rpx 35rpx;
    box-sizing:border-box;
    z-index:99;
}
.pay_bottomMoney{
    height: 70rpx;
    width: 100%;
    text-align: center;
    line-height: 70rpx;
    color: #434343;
    font-size: 30rpx;
    font-weight: bold;
}
.pay_bottomMoney text{
    font-size: 48rpx;
    color: #ff9800;  
}
.pay_bottomBtn{
    height: 78rpx;
    width: 100%;
    text-align: center;
    line-height: 78rpx;
    color: #fff;
    font-size:36rpx;
    margin:0 auto;
    border-radius:40rpx;
    background: #ff9800;
}
</style>


