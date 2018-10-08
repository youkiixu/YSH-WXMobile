<template>
    <view class="nav a-section a-topic">
      <view class="b">
        <scroll-view scroll-x="true" class="list">
          <view class="item" v-for="item of content.goodslist" :key="item.item_id">
            <navigator :url="'../topic/topicDetail?id=' + item.item_id">
              <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
              <view class="np">
                <text class="name">{{item.title}}</text>
                <text class="price">￥{{item.price}}元起</text>
              </view>
              <text class="desc">{{item.original_price}}</text>
            </navigator>
          </view>
        </scroll-view>
      </view>  
    </view>
</template>
<script>
export default {
    name: 'a-topic',
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
.a-topic .b {
  height: 533rpx;
  width: 750rpx;
  padding: 0;
}

.a-topic .b .list {
  height: 533rpx;
  width: 750rpx;
  white-space: nowrap;
}

.a-topic .b .item {
  display: inline-block;
  height: 533rpx;
  width: 680.5rpx;
  margin-left: 30rpx;
  overflow: hidden;
}

.a-topic .b .item:last-child {
  margin-right: 30rpx;
}

.a-topic .b .img {
  height: 387.5rpx;
  width: 680.5rpx;
  margin-bottom: 30rpx;
}

.a-topic .b .np {
  height: 35rpx;
  margin-bottom: 13.5rpx;
  color: #333;
  font-size: 30rpx;
}

.a-topic .b .np .price {
  margin-left: 20.8rpx;
  color: #b4282d;
}

.a-topic .b .desc {
  display: block;
  height: 30rpx;
  color: #999;
  font-size: 24rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
</style>


