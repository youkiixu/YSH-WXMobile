<template >
<scroll-view class="container" style="height: 100%;">
  
  <view class="search-header">
    <view class="input-box">
      <img class="icon" @click="getSeach" />
      <!-- @input="inputChange" @focus="inputFocus" @confirm="onKeywordConfirm" -->
      <input name="input" class="keywrod" focus="true" v-model="keyword" confirm-type="search" @confirm="onKeywordConfirm"  placeholder="商品搜索" />
      <!-- <img class="del" v-if="keyword" @click="clearKeyword" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png"/> -->
    </view>
    <!-- <view class="right" @click="closeSearch">取消</view> -->
  </view>
 

  <view class="sort" v-if="searchStatus">
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
  </view>

  <view class="search-result" v-if="searchStatus && goodsList.length">
    <sortGoods :goodsList = goodsList></sortGoods>
  </view> 
  

  <searchResultEmpty v-if="!goodsList.length && searchStatus && !loading"></searchResultEmpty>
  <loadingComponent v-if="loading"></loadingComponent>
</scroll-view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import sortGoods from '@/components/sortGoods'
import searchBar from '@/components/indexSearchBar'
import searchResultEmpty from '@/components/searchResultEmpty'
import loadingComponent from '@/components/loadingComponent'

export default {
  components: {
    sortGoods,
    searchBar,
    searchResultEmpty,
    loadingComponent
  },
  data () {
    return {
      keyword: '',
      searchStatus: false,
      goodsList: [],
      categoryFilter: false,
      currentSortType: 'default',
      filterCategory: [],
      defaultKeyword: {},
      page: 1,
      size: 20,
      currentSortOrder: 'desc',
      timer: null,
      orderKey: 1,    
      scrollTop: 0,
      floorstatus: false,
      loading: false
      
    }
  },
  async mounted () {
    this.goodsList = []
    this.keyword = ''
    this.searchStatus = false
    this.currentSortOrder = 'desc';
    if(this.$route.query.keyword) {
      this.keyword = this.$route.query.keyword
      this.loading = true
      await Promise.all([
        this.getGoodsList()
      ])
    }
    
  },
  methods: {
    // 点击“取消”
    closeSearch () {
      this.$router.back()
    },
     //回到顶部
    toTop: function () {         
        this.scrollTop = 0   
    },
    // 输入框获得焦点
    inputFocus () {
      this.searchStatus = false;
      this.goodsList = [];
    },
    // 获得搜索结果的商品列表
    async getGoodsList () {
      this.historyKeyword = [];
      const res = await api.search({keywords: this.keyword , pageNo: this.page , pageSize: this.size , orderKey: this.orderKey , orderByKey:this.currentSortOrder == 'desc' ? 0 : 1})
      if (res.success) {
        this.searchStatus = true;
        this.categoryFilter = false;
        var dataTable = JSON.parse(res.data)
        this.goodsList = this.goodsList.concat(dataTable.Table);
        this.loading = false
      }
    },
    // 关键词被点击
    onKeywordTap () {
      this.getSearchResult();
    },
    // 上一个方法调用
    getSearchResult () {
      this.loading = true
      this.page = 1;
      this.goodsList = [];
      this.getGoodsList();
    },
    // 三个排序条件的点击事件
    openSortFilter: function (event) {
      
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
          this.getSearchResult();
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
          this.getSearchResult();
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
          this.getSearchResult();
          break;

        default:
          // 综合排序
          this.categoryFilter = false;
          this.currentSortType = 'default';
          this.currentSortOrder = 'desc';
          this.orderKey = 1
          this.getSearchResult();
      }
    },
    // 键盘回车进行搜索
    onKeywordConfirm: function (event) {
      this.getSearchResult();
    },
    // 键盘搜索图标进行搜索
    getSeach: function (event) {
      this.getSearchResult();
    }
    
  },

    // 获取滚动条当前位置
    onPageScroll : function(e){
      console.log('滚动位置：',e.scrollTop)
      if (e.scrollTop > 5) {     
          this.floorstatus = true  
          this.scrollTop = e.scrollTop    
      } else {
       this.floorstatus = false
       this.scrollTop = e.scrollTop 
      }  
    },
  // 小程序原生上拉加载
  onReachBottom () {
    this.page++
    this.getGoodsList()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.getSearchResult()
    wx.stopPullDownRefresh()
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活',
      path: '/pages/search/search'
    }
  }
}
</script>


<style>
page{
  min-height: 100%;
  background-color: #f4f4f4;
  
}
.cate-out{
  height: 100vh;
}
 .search-header{
    position: fixed;
    top: 0;
    width: 700rpx;
    height: 91rpx;
    display: flex;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,.15);
    padding: 0 31.25rpx;
    font-size: 29rpx;
    color: #333;
    z-index: 99;
}

.search-header .input-box{
    width:606rpx;
    height:60rpx;
    background-color:#f7f7f7;
    color:#9b9b9b;
    border-radius:30rpx;
    display:flex;
    align-items:center;
    padding-left:40rpx;
    margin-left:24rpx;
}
.search-header .icon{
  background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/search2-2fb94833aa.png) left center no-repeat;
  background-size: 50%;
  width: 28rpx;
  height: 28rpx;
  flex: 1;
}
.search-header .input-box .keywrod{
  width: 600rpx;
  height: 100%;
  color: #000;
  font-size: 30rpx;
  flex: 10;
}



/* .search-header .del{
    position: absolute;
    top: 3rpx;
    right: 10rpx;
    width: 53rpx;
    height: 53rpx;
    z-index: 10;
}

.search-header .keywrod{
    position: absolute;
    top: 0;
    left: 40rpx;
    width: 506rpx;
    height: 59rpx;
    padding-left: 30rpx;
}

.search-header .right{
    margin-top: 24rpx;
    margin-left: 31rpx;
    margin-right: 6rpx;
    width: 58rpx;
    height: 43rpx;
    line-height: 43rpx;
    float: right;
} 
.search-header{
 height: 88rpx;
  width: 100%;
  padding: 0 30rpx;
  background: #fff; 
  display: flex;
  align-items: center;
}
.input-box{
  width: 690rpx;
  height: 56rpx;
  background: #ededed;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 24rpx;
 
} */
/* .index-searchbar {
  position: fixed;
  z-index: 99;
  left: 0rpx;
  width:750rpx;
  overflow: hidden;
  padding:10rpx 0;
  height:74rpx;
  background: #fff;
} */



.sort{
    position: fixed;
    height: 78rpx;
    left:0;
    top: 91rpx;
    z-index: 1000;
    background: #fff;
    /* width: 100%;
    height: 78rpx;
    margin-top: 91rpx; */
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
    color: #333;
}

.sort-box .item.active .txt{
    color: #009e96;
}

.sort-box .item.by-price , .sort-box .item.by-sales , .sort-box .item.by-comment{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/icon-none.png) 135rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.asc , .sort-box .item.by-sales.active.asc , .sort-box .item.by-comment.active.asc{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/icon-asc.png) 135rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.desc , .sort-box .item.by-sales.active.desc , .sort-box .item.by-comment.active.desc{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/icon-desc.png) 135rpx center no-repeat;
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
.container{
  min-height: 100%;
  background-color: #f4f4f4;
}



.no-search{
    height: auto;
    overflow: hidden;
    margin-top: 91rpx;
}

.serach-keywords{
    background: #fff;
    width: 750rpx;
    height: auto;
    overflow: hidden;
    margin-bottom: 20rpx;
}

.serach-keywords .h{
    padding: 0 31.25rpx;
    height: 93rpx;
    line-height: 93rpx;
    width: 95%;
    color: #999;
    font-size: 29rpx;
}

.serach-keywords .title{
    display: block;
    width: 120rpx;
    float: left;
}

.serach-keywords .icon{
    margin-top: 19rpx;
    float: right;
    display: block;
    margin-left: 511rpx;
    height: 55rpx;
    width: 55rpx;
}

.serach-keywords .b{
    width: 750rpx;
    height: auto;
    overflow: hidden;
    padding-left: 31.25rpx;
}

.serach-keywords .item{
    display: inline-block;
    width: auto;
    height: 48rpx;
    line-height: 48rpx;
    padding:0 15rpx;
    border: 1px solid #999;
    margin: 0 31.25rpx 31.25rpx 0;
    font-size: 24rpx;
    color: #333;
}

.serach-keywords .item.active{
    color: #b4282d;
    border: 1px solid #b4282d;
}

.shelper-list{
    width: 750rpx;
    height: auto;
    overflow: hidden;
    background: #fff;
    padding: 0 31.25rpx;
}

.shelper-list .item{
    height: 93rpx;
    width: 687.5rpx;
    line-height: 93rpx;
    font-size: 24rpx;
    color: #333;
    border-bottom: 1px solid #f4f4f4;
}
.search-result {
  padding-top: 172rpx;
}

</style>
