<template >
<view class="container">
  <view class="cate-head" :style="position">
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


    <view class="cate-nav">
        <scroll-view scroll-x="true" class="cate-nav-body" style="width: 750rpx;" :scroll-left="scrollLeft">
            <view  v-for="(item , index) of navList" :class="Id == item.Id ? 'active item' : 'item'" :key="item.Id"
            @click="switchCate" :data-Id="item.Id" :data-index="index">
                <view class="name">{{item.Name}}</view>
            </view>
        </scroll-view>
    </view>
  </view>
  
  <!-- <view class="search-result">
    <scroll-view scroll-y="true" id="loupanList" :scroll-top="scrollTop" class="cate-out"  lower-threshold="0"  @scroll="onPageScroll">
      <sortGoods :goodsList="goodsList"></sortGoods>
      <searchResultEmpty v-if="!goodsList.length"></searchResultEmpty>
    </scroll-view>   
  </view> -->

  <view class="search-result">
      <sortGoods :goodsList="goodsList"></sortGoods>
      <searchResultEmpty v-if="!goodsList.length"></searchResultEmpty>    
  </view>
    <!-- <view class="scollTop"  @click="toTop" :hidden="!floorstatus">顶部</view> -->
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import { mapState } from 'vuex'
import sortGoods from '@/components/sortGoods'
import searchResultEmpty from '@/components/searchResultEmpty'

export default {
  components: {
    sortGoods,
    searchResultEmpty
  },
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
      floorstatus: false,
      page: 1,
      size: 20, // 默认10000尽量大，查到所有符合的数据
      orderKey: 1,
      position:''
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
    toTop: function (e) {      
        console.log('点击事件')       
        this.scrollTop = 0   
        console.log('返回位置：',this.scrollTop)       
        
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
      // 标准品false
      if(item.IsCustom) {
        this.$wx.toBaoJia({ pid: item.QitemCode , title: item.ProductName , isDetail: true , ProductId: item.ProductId } , this)
      } else {
        this.$wx.toDetail({id : item.ProductId , title: item.ProductName} , this)
      }
    }
  },

    //  // 获取滚动条当前位置
    // onPageScroll : function(e){
    
    //   if (e.scrollTop > 5) {     
    //       this.floorstatus = true  
    //        //this.scrollTop = e.scrollTop    
    //   } else {
    //    this.floorstatus = false
    //    //this.scrollTop = e.scrollTop 
    //   }

    //   // if(e.scrollTop != 0) {
    //   //   position:'fixed'
    //   // } 
    // },
  //小程序原生上拉加载
  onReachBottom () {
    this.page++
    this.searchGoods()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.refresh()
    wx.stopPullDownRefresh()
  }
}
</script>

<style scoped>
@import "../../css/sortGoods.css";
/* page {
height: 100vh;
width: 100vw;
overflow: hidden;
} */
.container{
    background: #f1f1f1;
}
/* .cate-out{
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
} */
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
/* .cate-nav{
    position: fixed;
    left:0;
    top:78rpx;
    z-index: 1000;
} */

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
    color: #009e96;
    border-bottom: 2px solid #009e96;
}

.search-result{
    padding-top: 172rpx;
    /* z-index: 10; */
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
