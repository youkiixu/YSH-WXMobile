<template >
<view class="container">
  <view class="cate-head">
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
    </view>

    <view class="cate-nav" v-if="navList.length != 0">
        <scroll-view scroll-x="true" scroll-with-animation class="cate-nav-body" style="width: 100%;"  :scroll-left="scrollLeft">
            <view  v-for="(item , index) of navList" :class="Id == item.Id ? 'active item' : 'item'" :key="item.Id"
            @click="switchCate" :data-Id="item.Id" :data-index="index">
                <view class="name">{{item.Name}}</view>
            </view>
        </scroll-view>
    </view>    
  </view>

  <view :class="[navList.length != 0 ? 'search-result' : 'search-result-nopadding']">
      <sortGoods :goodsList="goodsList" v-if="goodsList && !loading"></sortGoods>
      <searchResultEmpty v-if="!goodsList.length && !loading"></searchResultEmpty>
      <loadingComponent v-if="loading"></loadingComponent>
  </view>

  <view class="scollTop"  @click="toTop" :hidden="!floorstatus">顶部</view> 
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import { mapState } from 'vuex'
import util from '@/utils/util'
import sortGoods from '@/components/sortGoods'
import searchResultEmpty from '@/components/searchResultEmpty'
import loadingComponent from '@/components/loadingComponent'

export default {
  components: {
    sortGoods,
    searchResultEmpty,
    loadingComponent
  },
  data () {
    return {
      navList: [],
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
      floorstatus: false,
      page: 1,
      size: 20, // 默认10000尽量大，查到所有符合的数据
      orderKey: 1,
      loading: true,
      title: ''
    }
  }, 
  onLoad () {
    this.goodsList = []
  },
  async mounted () {
    this.currentSortOrder = 'desc';
    Object.assign(this.$data, this.$options.data())
    if (this.$route.query.cid) {
      if(this.$route.query.categoryChild) {
        this.navList = JSON.parse(this.$route.query.categoryChild)
      }
      this.Id = parseInt(this.$route.query.cid);
      this.setTitle(this.$route.query.title)
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
    //回到顶部
    toTop() {       
        //this.scrollTop = 0     
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })          
    },
    async searchGoods() {
      
      const res = await api.search({ cid: this.Id , pageNo: this.page , pageSize : this.size , orderKey: this.orderKey , orderType:this.currentSortOrder == 'desc' ? 2 : 1});
      
      if(res.success) {
        var tableData = JSON.parse(res.data)
        this.goodsList = this.goodsList.concat(tableData.Table)
        this.loading = false
      }
    },
    // 切换商品类别
    switchCate (event) {
      if (this.Id === event.currentTarget.dataset.id) {
        return false;
      }

      var clientX = event.clientX;
      var currentTarget = event.currentTarget;
      // if (clientX < 60) {
      //   this.scrollLeft = 0 
      // } else if (clientX > 330) {
        this.scrollLeft = currentTarget.offsetLeft - 130
      // }
      // console.log(event.clientX)
      // console.log(this.scrollLeft)  
      
      this.Id = event.currentTarget.dataset.id
      // 重新请求数据
      this.refresh();
    },
    // 刷新
    refresh () {
      this.loading = true
      this.page = 1
      this.goodsList = []
      this.searchGoods()  
    },
    setTitle (text) {
        wx.setNavigationBarTitle({
            title: text ? text : '分类'
        })
    }
  },
      // 小程序原生获取滚动条当前位置
    onPageScroll : function(e){
      // console.log('e的值：',e)
      // console.log('滚动位置：',e.scrollTop)
      if (e.scrollTop > 100) {     
          this.floorstatus = true   
      } else {
       this.floorstatus = false     
      }  
     
    },

  //小程序原生上拉加载
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
    const urlPath = util.getCateGoryUrl(this.Id)
    console.log(urlPath)
    return {
      title: this.$route.query.title ? this.$route.query.title : '分类',
      desc: '印生活',
      path: urlPath
    }
  }
}
</script>

<style scoped>
@import "../../css/sortGoods.css";
.container{
    width: 100%;   
    background: #f1f1f1; 
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.cate-head{
    background: #fff;
    width: 100%;
    position: fixed;
    left:0;
    z-index: 1000;
}
.sort{
    width: 100%;
    height: 78rpx;
}

.sort-box{
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
.cate-nav{
    width: 100%;
}  

.cate-nav-body{
    width: 100%;
    height: 84rpx;
    white-space: nowrap;
    background: #fff;
    border-top: 1px solid rgba(0,0,0,.15);
    overflow-x: auto;    
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
    color: #009e96;
    border-bottom: 2px solid #009e96;
}

.search-result{
    padding-top: 172rpx;
}
.search-result-nopadding {
  padding-top: 70rpx;
}

.scollTop{
  width: 86rpx;
  height: 86rpx;
  color: #585c63;
  font-size: 20rpx;
  text-align: center;
  line-height: 120rpx;
  border-radius: 50%;
  box-shadow: 0px 0px 2px 2px #f1f1f1;
  position: fixed;
  bottom: 55rpx;
  right: 20rpx;
  z-index: 1000;
  background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/up-arrow.png) center 25% no-repeat;
  background-size: 38rpx; 
  background-color: #fff;
}
</style>
