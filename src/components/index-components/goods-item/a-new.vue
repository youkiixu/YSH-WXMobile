<template>
  <view class="nav a-section a-new">
    <view class="b">
      <view class="item" v-for="item of content.goodslist" :key="item.item_id">
        <navigator :url="'../goods/goods?id='+ item.item_id">
          <img class="img" :src="'http://192.168.0.91:8008/'+ item.pic" background-size="cover" />
          <text class="name">{{item.title}}</text>
          <text class="price">￥{{item.price}}</text>
        </navigator>
      </view>
    </view>
  </view>
</template>
<script>
export default {
    name: 'a-new',
    props: {
        content: Object
    }
}
</script>
<style scoped>
.a-new .b {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  padding: 0 31rpx 45rpx 31rpx;
}

.a-new .b .item {
  float: left;
  width: 302rpx;
  margin-top: 10rpx;
  margin-left: 21rpx;
  margin-right: 21rpx;
}

.a-new .b .item-b {
  margin-left: 42rpx;
}

.a-new .b .img {
  width: 302rpx;
  height: 302rpx;
}

.a-new .b .name {
  text-align: center;
  display: block;
  width: 302rpx;
  height: 35rpx;
  margin-bottom: 14rpx;
  overflow: hidden;
  font-size: 30rpx;
  color: #333;
}

.a-new .b .price {
  display: block;
  text-align: center;
  line-height: 30rpx;
  font-size: 30rpx;
  color: #b4282d;
}
</style>

