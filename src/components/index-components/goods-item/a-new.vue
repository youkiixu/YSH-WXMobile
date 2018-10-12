<template>
  <view class="nav a-section a-new">
    <view class="b clear">
      <view class="item" v-for="item of content.goodslist" :key="item.item_id">
        <navigator :url="'../goods/goods?id='+ item.item_id">
          <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
          <view class="txt">
              <text class="name">{{item.title}}</text>
              <text class="desc">商品简介</text>
              <view class="btom clear">
                <text class="price">￥{{item.price}}</text>
                <img class="more" src="/static/images/more.png"  background-size="cover" />
              </view>              
            </view>
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
    },
    computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    }
}
</script>
<style scoped>
.a-new .b {
  width: 750rpx;
  height: auto;
  padding: 0 20rpx;
  box-sizing: border-box;
  overflow: hidden;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.a-new .b .item {
  float: left;
  width: 350rpx;
  height: 500rpx;
  margin-top: 10rpx;
  margin-left: 10rpx;
  border-radius: 5rpx;
}
.a-new .b .item:nth-child(1),.a-new .b .item:nth-child(2){
  margin-top: 0;
}
.a-new .b .item:nth-child(2n+1){
  margin-left: 0;
}
.a-new .b .item-b {
  margin-left: 42rpx;
}

.a-new .b .img {
  width: 350rpx;
  height: 350rpx;
  display: block;
  background-color: #e5e5e5;
}

.a-new .item .txt{
  height: 150rpx;
  width: 350rpx;
  padding: 20rpx 10rpx;
  box-sizing: border-box;
}
.a-new .item .txt .name {
  display: block;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  color: #464646;
  width: 340rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;

}
.a-new .item .txt .desc {
  display: block;
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  color: #555555;
  width: 340rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.a-new .item .btom{
  height: 40rpx;
  line-height: 40rpx;
  font-size: 22rpx;
  color: #dc2121;
}
.a-new .item .btom .price{
  width: 80%;
  float: left;
}
.a-new .item .btom img{
  width: 8%;
  height: 32rpx;
  float: right;
}
</style>

