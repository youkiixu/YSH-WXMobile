<template>
  <view class="good-grid">
    <view class="b">
      <block v-for="(item,iindex) of content.goodslist" :key="item.item_id" :data-id="index">
        <view :class="  iindex % 2 == 0 ? 'item' : 'item item-b'">
          <navigator :url="'../goods/goods?id=' + item.item_id" class="a">
            <img class="img" :src="'http://192.168.0.91:8008/'+ item.pic" background-size="cover" />
            <text class="name">{{item.title}}</text>
            <text class="price">￥{{item.price}}</text>
          </navigator>
        </view>
      </block>
      <!-- <view class="item item-b item-more">
          <navigator :url="'/pages/category/category?id=' + item.price" class="more-a">
            <view class="txt">{{'更多'+item.title+'好物'}}</view>
            <image class="icon" src="../../static/images/icon_go_more.png" background-size="cover"/>
          </navigator>
      </view> -->
    </view>
  </view>
</template>
<script>
export default {
    name: 'good-grid',
    props: {
        content: Object
    },
    mounted () {
      // console.log(this.content)
    }
}
</script>
<style scoped>
.good-grid {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.good-grid .h {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 130rpx;
  font-size: 33rpx;
  color: #333;
}

.good-grid .b {
  width: 750rpx;
  padding: 0 6.25rpx;
  height: auto;
  overflow: hidden;
}

.good-grid .b .item {
  float: left;
  background: #fff;
  width: 365rpx;
  margin-bottom: 6.25rpx;
  height: 452rpx;
  overflow: hidden;
  text-align: center;
}

.good-grid .b .item .a{
  height: 452rpx;
  width: 100%;
}

.good-grid .b .item-b {
  margin-left: 6.25rpx;
}

.good-grid .item .img {
  margin-top: 20rpx;
  width: 302rpx;
  height: 302rpx;
}

.good-grid .item .name {
  display: block;
  width: 320rpx;
  padding: 0 20rpx;
  overflow: hidden;
  height: 35rpx;
  margin: 11.5rpx 0 22rpx 0;
  text-align: center;
  font-size: 30rpx;
  color: #333;
}

.good-grid .item .price {
  display: block;
  width: 365.625rpx;
  height: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #b4282d;
}

.good-grid .more-item{
  height: 100%;
  width: 100%;
}
</style>

