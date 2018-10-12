<template>
    <view class="nav a-section a-topic">
      <view class="b">
        <scroll-view scroll-x="true" class="list">
          <view class="item" v-for="item of content.goodslist" :key="item.item_id">
            <navigator :url="'../topic/topicDetail?id=' + item.item_id" class="nav">
              <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
              <view class="np">
                <text class="name">{{item.title}}</text>
                <view class="btom clear">
                <text class="price">￥{{item.price}}</text>
                <img class="add" src="/static/images/add.png"  background-size="cover" />
              </view>       
              </view>
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
  height: 355rpx;
  width: 750rpx;
  padding: 0;
  background-color: #f1f1f1;
}

.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.a-topic .b .list {
  height: 355rpx;
  width: 750rpx;
  white-space: nowrap;
}
.a-topic .b .item {
  display: inline-block;
  height: 330rpx;
  width: 245rpx;
  margin-left: 20rpx;
  overflow: hidden;
  background-color: #fff;
  border-radius: 5rpx;
}
.a-topic .b .item:last-child {
  margin-right: 20rpx;
}

.a-topic .b .img {
  height: 245rpx;
  width: 245rpx;
  display: block;
  background-color: #666666;
}

.a-topic .b .np {
  height: 80rpx;
  color: #333;
  font-size: 30rpx;
  padding: 10rpx;
  box-sizing: border-box;
}
.a-topic .b .np .name {
  display: block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 24rpx;
  color: #555555;
  width: 240rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;

}
.a-topic .item .btom{
  height: 30rpx;
  line-height: 30rpx;
  font-size: 22rpx;
  color: #dc2121;
}
.a-topic .item .btom .price{
  width: 60%;
  float: left;
}
.a-topic .item .btom img{
  width: 25rpx;
  height: 25rpx;
  margin-top: 2.5rpx;
  float: right;
}
</style>


