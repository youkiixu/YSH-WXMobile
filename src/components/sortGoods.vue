<template>
<view>
  <scroll-view scroll-y="true" scroll-top="scrollTop" :style="{'height': '100%'}" @bindscroll="onReachBottom">
        <view class="cate-item">           
            <view class="b">               
                  <navigator v-for="(item, index) of goodsList" :key="index" :class="index % 2 == 0 ? 'item-b item' : 'item'" @click="toDetail(item)">
                    <img class="img" :src="baseUrl + item.imagePath + '/1_350.png'" mode="scaleToFill"/>
                      <view class="b-txt">
                        <view class="price">
                          <text class="icon">￥</text>{{item.MinSalePrice}}
                        </view>
                        <view class="name">{{item.ProductName}}</view>
                        <view class="ShopName">{{item.ShopName}}</view>
                      </view>
                  </navigator>                                  
            </view>
        </view>
    </scroll-view>

</view>
</template>

<script>
export default {
  methods: {
    toDetail (item) {
      this.$wx.toGoodsDetail(item , this)
    }
  },
  computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    },
  props: {
    goodsList: {
      type: Array,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped>
.cate-item{
    height: auto;
    overflow: hidden;
}

.cate-item .h{
    height: 145rpx;
    width: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.cate-item .h .name{
    display: block;
    height: 35rpx;
    margin-bottom: 18rpx;
    font-size: 30rpx;
    color: #333;
}

.cate-item .h .desc{
    display: block;
    height: 24rpx;
    font-size: 24rpx;
    color: #999;
}

.cate-item .b{
  width: 750rpx;
  padding: 7rpx 13rpx;
  box-sizing: border-box;
  height: auto;
  overflow: hidden;
  background-color: #f1f1f1;
}
.cate-item .b .item{
  float: left;
  background: #fff;
  width: 350rpx;
  height: 540rpx;
  overflow: hidden;
}
.cate-item .b .item{
  margin-top: 15rpx;
}
.cate-item .b .item:nth-child(2n){
    margin-left: 15rpx;
}
.cate-item .item .img{
  display: block;
  width: 100%;
  height: 400rpx;
  background: #666666;
}
.cate-item .b-txt{
  width: 100%;
  height: 140rpx;
  padding: 15rpx 10rpx;
  box-sizing: border-box;
}
.cate-item .b-txt .price{
  width: 100%;
  font-size: 32rpx;
  color: #dc2121;
}
.cate-item .b-txt .icon{ 
  font-size: 28rpx;
}
.cate-item .b-txt .name{
  width: 100%;
  font-size: 24rpx;
  color: #282828;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}
.cate-item .b-txt .ShopName{
  width: 100%;
  font-size: 22rpx;
  color: #666666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

/*
.cate-item .b{
  width: 750rpx;
  height: auto;
  overflow: hidden;
  border-top: 1rpx solid #f4f4f4;
  margin-top: 20rpx;
}

.cate-item .b .item{
  float: left;
  background: #fff;
  width: 374rpx;
  padding-bottom: 33.333rpx;
  border-bottom: 1rpx solid #f4f4f4;
  height: auto;
  overflow: hidden;
  text-align: center;
}

.cate-item .b .item-b{
 border-right: 1rpx solid #f4f4f4;
}

.cate-item .item .img{
    margin-top: 10rpx;
  width: 302rpx;
  height: 302rpx;
}

.cate-item .item .name{
  display: block;
  width: 325rpx;
  height: 35rpx;
  padding: 0 20rpx;
  overflow: hidden;
  margin: 11.5rpx 0 22rpx 0;
  text-align: center;
  font-size: 30rpx;
  color: #333;
}

.cate-item .item .price{
  display: block;
  width: 365.625rpx;
  height: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #b4282d;
}*/
</style>
