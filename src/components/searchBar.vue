<template>
    <div class="search">
        <navigator url="/pages/search/search" class="input">
            <img class="icon"/>
            <text class="txt">商品搜索</text>
        </navigator>
    </div>
</template>

<script>
//搜索：6
export default {
    name: 'searchBar'
}
</script>
<style scoped>
.search {
  height: 88rpx;
  width: 100%;
  padding: 0 30rpx;
  background: #fff; 
  display: flex;
  align-items: center;
}

.search .input {
  width: 690rpx;
  height: 56rpx;
  background: #ededed;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 24rpx;
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
  color: #666;
  padding-left: 10rpx;
  font-size: 30rpx;
}
</style>


