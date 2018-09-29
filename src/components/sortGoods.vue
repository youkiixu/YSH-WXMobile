<template>
<view>
  
  <view class="cate-item">
    <view class="b">
      <block v-for="(item, index) of goodsList" :key="index">
        <navigator :class="index % 2 == 0 ? 'item-b item' : 'item'" :url="'../goods/goods?id=' + item.ProductId">
          <img class="img" :src="baseUrl+item.imagePath" background-size="cover"/>
          <text class="name">{{item.ProductName}}</text>
          <text class="price">￥{{item.MinSalePrice}}</text>
        </navigator>
      </block>
    </view>
  </view>
</view>
</template>

<script>
export default {
  computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    },
  props: {
    currentSortType: {
      type: String,
      default () {
        return {}
      }
    },
    currentSortOrder: {
      type: String,
      default () {
        return {}
      }
    },
    openSortFilter: {
      type: Function,
      default () {
        return {}
      }
    },
    categoryFilter: {
      type: Boolean,
      default () {
        return {}
      }
    },
    filterCategory: {
      type: Array,
      default () {
        return {}
      }
    },
    selectCategory: {
      type: Function,
      default () {
        return {}
      }
    },
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
}
</style>
