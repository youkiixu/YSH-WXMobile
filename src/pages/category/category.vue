<template >
<view class="container">
    <view class="cate-nav">
        <scroll-view scroll-x="true" class="cate-nav-body" style="width: 750rpx;" :scroll-left="scrollLeft">
            <view  v-for="(item , index) of navList" :class="Id == item.Id ? 'active item' : 'item'" :key="item.Id"
            @click="switchCate" :data-Id="item.Id" :data-index="index">
                <view class="name">{{item.Name}}</view>
            </view>
        </scroll-view>
    </view>

    <scroll-view scroll-y="true" scroll-top="scrollTop" :style="{'height': '100%'}" @bindscroll="onReachBottom">
        <view class="cate-item">
            <!-- <view class="h">
                <text class="name">{{currentCategory.name}}</text>
                <text class="desc">{{currentCategory.front_name}}</text>
            </view> -->
            <view class="b">
                <view v-for="item of goodsList" :key="item.ProductId" :class="(index + 1) % 2 === 0 ? 'item-b item' : 'item'"
                   @click="toGoods(item)" >
                    <img class="img" :src=" 'http://192.168.0.91:8008/'+ item.imagePath" background-size="cover" />
                    <text class="name">{{item.ProductName}}</text>
                    <text class="price">￥{{item.MinSalePrice}}</text>
                </view>
            </view>
        </view>
    </scroll-view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      navList: [],
      goodsList: [],
      Id: 0,
      currentCategory: {},
      scrollLeft: 0,
      scrollTop: 0,
      scrollHeight: 0,
      page: 1,
      size: 20 // 默认10000尽量大，查到所有符合的数据
    }
  }, 
  async mounted () {
    Object.assign(this.$data, this.$options.data())
    if (this.$route.query.Id) {
      this.navList = JSON.parse(this.$route.query.categoryChild)
      this.Id = parseInt(this.$route.query.Id);
    }
    let that = this;
    // 获得系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.scrollHeight = res.windowHeight;
      }
    });
    await Promise.all([
      this.searchGoods()
    ])
  },
  computed: {
    ...mapState([
      'categoryList'
    ])
  },
  methods: {
    async searchGoods() {
      const res = await api.search({ cid: this.Id , pageNo: this.page , pageSize : this.size });
      if(res.success) {
        var tableData = JSON.parse(res.data)
        console.log(tableData)
        this.goodsList = this.goodsList.concat(tableData.Table)
        
      }
    },
    // 切换商品类别
    switchCate (event) {
      // console.log('触发了点击事件，event为：', event);
      if (this.Id === event.currentTarget.dataset.id) {
        return false;
      }

      var clientX = event.clientX;
      var currentTarget = event.currentTarget;
      if (clientX < 60) {
        this.scrollLeft = currentTarget.offsetLeft - 60
      } else if (clientX > 330) {
        this.scrollLeft = currentTarget.offsetLeft
      }
      this.Id = event.currentTarget.dataset.id
      // 重新请求数据
      this.refresh();
    },
    // 刷新
    refresh () {
      this.page = 1
      this.goodsList = []
      this.searchGoods()
    },
    // 跳转到商品下单页面
    toGoods(item) {
      this.$wx.toGoodsDetail(item , this)
      // // 标准品false
      // if(item.IsCustom) {
      //   this.$router.push({ path: '/pages/auto/queryquote', query: { pid: item.QitemCode } })
      // } else {
      //   this.$router.push({ path: '/pages/goods/goods', query: { data: JSON.stringify(item) } })
      // }
    }
  },
  // 小程序原生上拉加载
  onReachBottom () {
    this.page++
    this.searchGoods()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.refresh()
    wx.stopPullDownRefresh()
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/category/category'
    }
  }
}
</script>

<style scoped>
.container{
    background: #f9f9f9;
}
.cate-nav{
    position: fixed;
    left:0;
    top:0;
    z-index: 1000;
}

.cate-nav-body{
    height: 84rpx;
    white-space: nowrap;
    background: #fff;
    border-top: 1px solid rgba(0,0,0,.15);
    overflow: hidden;
}

.cate-nav .item{
    display: inline-block;
    height: 84rpx;
    min-width: 130rpx;
    padding: 0 15rpx;
}

.cate-nav .item .name{
    display: block;
    height: 84rpx;
    padding: 0 20rpx;
    line-height: 84rpx;
    color: #333;
    font-size: 30rpx;
    width: auto;
}

.cate-nav .item.active .name{
    color: #ab2b2b;
    border-bottom: 2px solid #ab2b2b;
}

.cate-item{
    margin-top: 94rpx;
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
  padding: 0 6.25rpx;
  height: auto;
  overflow: hidden;
}

.cate-item .b .item{
  float: left;
  background: #fff;
  width: 365rpx;
  margin-bottom: 6.25rpx;
  padding-bottom: 33.333rpx;
  height: auto;
  overflow: hidden;
  text-align: center;
}

.cate-item .b .item-b{
  margin-left: 6.25rpx;
}

.cate-item .item .img{
  width: 302rpx;
  height: 302rpx;
}

.cate-item .item .name{
  display: block;
  width: 320rpx;
  height: 40rpx;
  margin: 11.5rpx 0 22rpx 0;
  text-align: center;
  overflow: hidden;
  padding: 0 20rpx;
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
