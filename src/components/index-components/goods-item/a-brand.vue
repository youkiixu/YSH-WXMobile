<template>
  <view class="nav a-section a-brand">
    <view class="b">
      <view class="item item-1" v-for="item of content.goodslist" :key="item.item_id">
        <navigator :url="'/pages/brand/brandDetail?id='+item.item_id">
          <view class="wrap">
            <img class="img" :src="baseUrl+ item.pic" mode="aspectFill" />
            <view class="mt">
              <text class="brand">{{item.title}}</text>
              <text class="price">{{item.price}}</text>
              <text class="unit">元起</text>
            </view>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>
<script>
export default {
    name: 'a-brand',
    props: {
        content: Object
    },
    computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    }
}
</script>
<style scoped>
.a-brand .b {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  position: relative;
}

.a-brand .wrap {
  position: relative;
}

.a-brand .img {
  position: absolute;
  left: 0;
  top: 0;
}

.a-brand .mt {
  position: absolute;
  z-index: 2;
  padding: 27rpx 31rpx;
  left: 0;
  top: 0;
}

.a-brand .mt .brand {
  display: block;
  font-size: 33rpx;
  height: 43rpx;
  color: #333;
}

.a-brand .mt .price, .a-brand .mt .unit {
  font-size: 25rpx;
  color: #999;
}

.a-brand .item-1 {
  float: left;
  width: 375rpx;
  height: 252rpx;
  overflow: hidden;
  border-top: 1rpx solid #fff;
  margin-left: 1rpx;
}

.a-brand .item-1:nth-child(2n+1){
  margin-left: 0;
  width: 374rpx;
}

.a-brand .item-1 .img {
  width: 375rpx;
  height: 253rpx;
}
</style>

