<template>
  <view class="good-grid">
    <view class="b clear">
      <block v-for="item of content.goodslist" :key="item.item_id" :data-id="index">
        <view class="item">
          <navigator :url="'../goods/goods?id=' + item.item_id" class="a">
            <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
            <view class="txt">
              <text class="name">{{item.title}}</text>
              <text class="desc">商品介绍</text>
              <view class="btom clear">
                <text class="price">￥{{item.price}}</text>
                <img class="more" src="/static/images/more.png"  background-size="cover" />
              </view>
              
            </view>
            
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
    computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    }
}
</script>
<style scoped>
.good-grid {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
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
  padding: 0 20rpx;
  box-sizing: border-box;
  height: auto;
  overflow: hidden;
}

.good-grid .b .item {
  float: left;
  background: #fff;
  width: 227rpx;
  height: 370rpx;
  overflow: hidden;
  margin-top: 15rpx;
  margin-left: 15rpx;
  border-radius: 5rpx;
}
.good-grid .b .item:nth-child(3n+1) {
  margin-left: 0;
}
.good-grid .b .item .a{
  height: 370rpx;
  width: 100%;
}

.good-grid .item .img {
  width: 227rpx;
  height: 230rpx;
  display: block;
}
.good-grid .item .txt{
  height: 140rpx;
  width: 100%;
  padding: 20rpx 10rpx;
  box-sizing: border-box;
}
.good-grid .item .txt .name {
  display: block;
  height: 35rpx;
  line-height: 35rpx;
  font-size: 24rpx;
  color: #464646;
  width: 217rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;

}
.good-grid .item .txt .desc {
  display: block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 20rpx;
  color: #555555;
  width: 217rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.good-grid .item .btom{
  height: 35rpx;
  line-height: 35rpx;
  font-size: 22rpx;
  color: #dc2121;
}
.good-grid .item .btom .price{
  width: 80%;
  float: left;
}
.good-grid .item .btom img{
  width: 8%;
  height: 22rpx;
  float: right;
}

.good-grid .more-item{
  height: 100%;
  width: 100%;
}
</style>

