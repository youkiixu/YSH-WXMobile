<template>
    <view class="search">
        <navigator url="/pages/search/search" class="input">
            <img class="icon"/>
            <text class="txt">商品搜索</text>
        </navigator>
    </view>
</template>

<script>
export default {
    name: 'indexSearchBar'
}
</script>
<style scoped>
.search {
  height: 60rpx;
  width: 100%;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
}

.search .input {
  width: 606rpx;
  height: 60rpx;
  background: #ededed;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  padding-left: 40rpx;
  margin-left: 24rpx;
  background-color: rgba(255,255,255,0.8);
  box-shadow: 0 0 20rpx rgba(0,0,0,0.10);
}

.search .icon {
  background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/search2-2fb94833aa.png) center no-repeat;
  background-size: 100%;
  width: 28rpx;
  height: 28rpx;
}

.search .txt {
  height: 42rpx;
  line-height: 42rpx;
  color: rgb(108, 106, 105);
  padding-left: 10rpx;
  font-size: 30rpx;
}
</style>


