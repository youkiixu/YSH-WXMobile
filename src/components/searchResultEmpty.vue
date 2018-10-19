<template>
    <view class="search-result-empty" >
        <img class="icon"
             src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noSearchResult-7572a94f32.png" />
        <text class="text">您寻找的商品还未上架</text>
    </view>
</template>
<script>
export default {};
</script>
<style scoped>
.search-result-empty {
  width: 100%;
  height: 100%;
  padding-top: 300rpx;
}

.search-result-empty .icon {
  margin: 0 auto;
  display: block;
  width: 240rpx;
  height: 240rpx;
}

.search-result-empty .text {
  display: block;
  width: 100%;
  height: 40rpx;
  font-size: 28rpx;
  text-align: center;
  color: #999;
}
</style>

