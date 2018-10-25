<template>
  <view class="good-grid">
    <view class="b clear">
      <block v-for="item of content.goodslist" :key="item.item_id" :data-id="index">
        <view class="item">
          <view  @click="toDetail(item)" class="a">
            <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
            <view class="txt">
              <text class="name">{{item.title}}</text>
              <!-- <text class="desc"></text> -->
              <text class="price">￥{{item.price}}</text>             
            </view>
            
          </view>
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
    },
    methods: {
      toDetail(item) {
        this.$emit('onClick' , item);
      }
    }
}
</script>
<style scoped>
.good-grid {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 20rpx;
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
  padding: 15rpx 20rpx;
  box-sizing: border-box;
  height: auto;
  overflow: hidden;
}

.good-grid .b .item {
  float: left;
  background: #fff;
  width: 32%;
  height: 365rpx;
  margin-top: 15rpx;
  margin-left: 15rpx;
  border-radius: 7rpx;
  box-shadow: 2px 2px 2px #f3f3f3;
}
.good-grid .b .item:nth-child(1) ,.good-grid .b .item:nth-child(2),.good-grid .b .item:nth-child(3){
  margin-top: 0;
}
.good-grid .b .item:nth-child(3n+1) {
  margin-left: 0;
}
.good-grid .b .item .a{
  height: 365rpx;
  width: 100%;
  overflow: hidden;
}

.good-grid .item .img {
  display: block;
  width: 100%;
  height: 226rpx; 
  overflow: hidden;
  box-sizing:border-box;
}
.good-grid .item .txt{
  height: 134rpx;
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  overflow: hidden;
  border: none;
  border-bottom-left-radius:10rpx;
  border-bottom-right-radius:10rpx;
}
.good-grid .item .txt .name {
  display: block;
  height: 60rpx;
  line-height: 30rpx;
  font-size: 20rpx;
  color: #282828;
  width: 190rpx;
  overflow: hidden;
  /* white-space: nowrap; */
  text-overflow:ellipsis;
}
.good-grid .item .txt .desc {
  display: block;
  height: 30rpx;
  line-height: 30rpx;
  font-size: 20rpx;
  color: #666666;
  width: 190rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.good-grid .item .txt .price{
  display: block;
  height: 40rpx;
  line-height: 50rpx;
  font-size: 20rpx;
  color: #dc2121;
}

.good-grid .more-item{
  height: 100%;
  width: 100%;
}
</style>

