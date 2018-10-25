<template>
  <view class="nav a-section a-brand">
    <view class="b clear">
      <view class="item item-1" v-for="item of content.goodslist" :key="item.item_id">
        <view @click="toDetail(item)">
              <text class="name">{{item.title}}</text>
              <img class="img" :src="baseUrl+ item.pic" mode="aspectFill" background-size="cover" />
        </view>
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
    },
    methods: {
      toDetail(item) {
        this.$emit('onClick' , item);
      }
    }
}
</script>
<style scoped>
.a-brand{
  margin-bottom: 20rpx;
  background-color: #fff;
}
.a-brand .b {
  width: 750rpx;
  height: auto;
  padding: 0 20rpx 20rpx 20rpx;
  overflow: hidden;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.a-brand .b .item {
  float: left;
  width: 30.5%;
  height: 226rpx;
  margin-top: 15rpx;
  margin-left: 15rpx;
  border-radius: 7rpx;
  background-color: #666;
  position: relative;
}
.a-brand .b .item:nth-child(1),.a-brand .b .item:nth-child(2),.a-brand .b .item:nth-child(3) {
  margin-top: 0;
}
.a-brand .b .item:nth-child(3n+1) {
  margin-left: 0;
}
.a-brand .b .item .name{
  display: block;
  width: 226rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 24rpx;
  color: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.2);
}
.a-brand .b .item .img{
  display: block;
  width: 100%;
  height: 226rpx;
  overflow: hidden;
}

</style>

