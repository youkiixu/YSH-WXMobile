<template >
<view class="container">
  <view class="sort">
    <view class="sort-box">
      <view :class=" currentSortType == 'default' ? 'active item' : 'item'"  @click="openSortFilter" id="defaultSort">
        <text class="txt">综合</text>
      </view>
      <view :class="['item', 'by-sales by-sort', { active: currentSortType == 'sales', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
         @click="openSortFilter" id="salesSort">
        <text class="txt">销量</text>
      </view>
      <view :class="['item', 'by-price by-sort', { active: currentSortType == 'price', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
         @click="openSortFilter" id="priceSort">
        <text class="txt">价格</text>
      </view>
      <view :class="['item', 'by-comment by-sort', { active: currentSortType == 'comment', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
         @click="openSortFilter" id="commentSort">
        <text class="txt">评论</text>
      </view>
    </view>
    <!-- <view class="sort-box-category" v-if="categoryFilter">
      <view :class="item.checked ? 'active item' : 'item'" v-for="(item, index) of filterCategory" :key="cate-item.id" :data-category-index="index" @click="selectCategory">{{item.name}}</view>
    </view> -->
  </view>


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
                    <img class="img" :src="baseUrl + item.imagePath + '/1_350.png'" mode="scaleToFill" />
                    <view class="b-txt">
                      <view class="price">
                        <text class="icon">￥</text>{{item.MinSalePrice}}
                      </view>
                      <view class="name">{{item.ProductName}}</view>
                    </view>
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
      currentSortType: 'default',
      currentSortOrder: 'desc',
      searchStatus: false,
      goodsList: [],
      categoryFilter: false,
      keyword: '',
      scrollLeft: 0,
      scrollTop: 0,
      scrollHeight: 0,
      page: 1,
      size: 20, // 默认10000尽量大，查到所有符合的数据
      orderKey: 1
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
    ]),
    baseUrl() {
      return this.$wx.baseUrl
    }
  },
  methods: {

    // 获得搜索结果的商品列表
    // async getGoodsList () {
    //   // this.historyKeyword = [];
    //   // const res = await api.getGoodsList({ keyword: this.keyword, page: this.page, size: this.size, sort: this.currentSortType, order: this.currentSortOrder, categoryId: this.categoryId });
    //   const res = await api.search({keywords: this.keyword , pageNo: this.page , pageSize: this.size , orderKey: this.orderKey})
    //   if (res.success) {
    //     this.searchStatus = true;
    //     this.categoryFilter = false;
    //     var dataTable = JSON.parse(res.data)
    //     this.goodsList = dataTable.Table;
    //   }
    // },
     // 三个排序条件的点击事件
    openSortFilter: function (event) {
      // this.goodsList = []
      let currentId = event.currentTarget.id;
      switch (currentId) {        
        case 'salesSort':
          let tmpSortOrderSales = 'asc';
          if (this.currentSortOrder === 'asc') {
            tmpSortOrderSales = 'desc';
          }
          this.categoryFilter = false;
          this.currentSortType = 'sales';
          this.currentSortOrder = tmpSortOrderSales;
          this.orderKey = 2
          this.refresh();
          break;

          case 'priceSort':
          let tmpSortOrderPrice = 'asc';
          if (this.currentSortOrder === 'asc') {
            tmpSortOrderPrice = 'desc';
          }
          this.categoryFilter = false;
          this.currentSortType = 'price';
          this.currentSortOrder = tmpSortOrderPrice;
          this.orderKey = 3
          this.refresh();
          break;

          case 'commentSort':
          let tmpSortOrderComment = 'asc';
          if (this.currentSortOrder === 'asc') {
            tmpSortOrderComment = 'desc';
          }
          this.categoryFilter = false;
          this.currentSortType = 'comment';
          this.currentSortOrder = tmpSortOrderComment;
          this.orderKey = 4
          this.refresh();
          break;

        default:
          // 综合排序
          this.categoryFilter = false;
          this.currentSortType = 'default';
          this.currentSortOrder = 'desc';
          this.orderKey = 1
          this.refresh();
      }
    },


    async searchGoods() {
      const res = await api.search({ cid: this.Id , pageNo: this.page , pageSize : this.size , orderKey: this.orderKey });
      if(res.success) {
        var tableData = JSON.parse(res.data)
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
    background: #f1f1f1;
}
.sort{
    background: #fff;
    width: 100%;
    height: 78rpx;
    position: fixed;
    left:0;
    z-index: 1000;
}

.sort-box{
    background: #fff;
    width: 690rpx;
    height: 78rpx;
    overflow: hidden;
    padding: 0 30rpx;
    display: flex;
    border-bottom: 1px solid #d9d9d9;
}

.sort-box .item{
    height: 78rpx;
    line-height: 78rpx;
    text-align: center;
    flex:1;
    color: #333;
    font-size: 30rpx;
}

.sort-box .item .txt{
    display: block;
    width: 100%;
    height: 100%;
    color: #282828;
    font-size: 28rpx;
}

.sort-box .item.active .txt{
    color: #009e96;
}

.sort-box .item.by-sort{
    background: url(//yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/no-3127092a69.png) 130rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-sort.active.asc{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/up-636b92c0a5.png) 130rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-sort.active.desc{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/down-95e035f3e5.png) 130rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box-category{
    background: #fff;
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 40rpx 40rpx 0 0;
    border-bottom: 1px solid #d9d9d9;
}

.sort-box-category .item{
    height: 54rpx;
    line-height: 54rpx;
    text-align: center;
    float: left;
    padding: 0 16rpx;
    margin: 0 0 40rpx 40rpx;
    border: 1px solid #666;
    color: #333;
    font-size: 24rpx;
}

.sort-box-category .item.active{
    color: #b4282d;
    border: 1px solid #b4282d;
}
.cate-nav{
    position: fixed;
    left:0;
    top:78rpx;
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
  padding: 7rpx 13rpx;
  box-sizing: border-box;
  height: auto;
  overflow: hidden;
  background-color: #f1f1f1;
}
.cate-item .b .item{
  float: left;
  background: #fff;
  width: 357rpx;
  height: 540rpx;
  overflow: hidden;
}
.cate-item .b .item{
  margin-top: 13rpx;
}
.cate-item .b .item:nth-child(2n){
    margin-left: 13rpx;
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
  overflow: hidden;
  font-size: 24rpx;
  color: #282828;
}
</style>
