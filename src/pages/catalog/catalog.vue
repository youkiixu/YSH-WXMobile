<template >
<view class="container">
    <view class="index-searchbar" v-if="categoryList">
      <searchBar></searchBar>
    </view>
    

    <view class="catalog" :style="{'height' : '100%'}"  v-if="!loading">
        <scroll-view class="nav" scroll-y="true"  :style="{'height' : '100%'}">
            <view :class="currentCategory.Id == item.Id ? 'active item' : 'item'" v-for="(item, index) of navList" :key="item.Id" :data-id="item.Id"
                :data-index="index" @click="switchCateLog(index)">{{item.Name}}</view>
        </scroll-view>
        <scroll-view class="cate" scroll-y="true"  :style="{'height' : '100%'}">
            <view class="cate_item" v-for="( categoryChild , index1 ) of categoryList" :key="index1" v-if="!loading2">
              <view class="hd">
                  <text class="txt">{{categoryChild.Name}}分类</text>
              </view>
              <view class="bd">
                  <view @click="toPage(item.Id , categoryChild.SubCategories)"  :class="(index2+1) % 3 == 0 ? 'last item' : 'item'" v-for="(item, index2) of categoryChild.SubCategories"
                      :key="item.Id">
                      <img class="icon" :src="item.Image ?  baseUrl + item.Image : 'http://www.kiy.cn/Areas/wxMobile/Content/img/defalutimg.png'"/>
                      <text class="txt">{{item.Name}}</text>
                  </view>
              </view>
            </view>
        </scroll-view>
    </view>
    <loadingComponent  v-if="loading"></loadingComponent>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import searchBar from '@/components/indexSearchBar'
import loadingComponent from '@/components/loadingComponent'

export default {
  components: {
    searchBar,
    loadingComponent
  },
  data () {
    return {
      navList: [],
      currentCategory: {},
      scrollLeft: 0,
      scrollTop: 0,
      goodsCount: 0,
      scrollHeight: 0,
      loading: true,
      categoryList: [],
      loading2: false
    }
  },
  async mounted () {
    await Promise.all([
      this.getSassCateGory()
    ])
  },
  computed: {
    baseUrl() {
        return this.$wx.baseUrl
    }
    
  },
  methods: {
      // 获取SASS分类星系
      async getSassCateGory() {
        const res = await api.getSassCategory({});
        if(res.success) {
          this.navList = res.data
          this.switchCateLog(0)
        }
      }, 
      // 选择不同分分类
      switchCateLog(index) {
          this.currentCategory = this.navList[index]
          this.categoryList = this.currentCategory.SubCategories
          this.loading = false
      },
      toPage(id , SubCategories) {
        this.$router.push(
          { 
            path: '/pages/category/category', 
            query: { 
              cid : id ,
              categoryChild: JSON.stringify(SubCategories) 
            } 
          }
        )
      }
    },
    // 小程序原生下拉刷新
    async onPullDownRefresh() {
      await Promise.all([
        this.getSassCateGory()
      ])
      this.loading = false
      wx.stopPullDownRefresh()
    },
    // 原生的分享功能？？
    onShareAppMessage: function () {
      return {
        title: '印生活商城',
        desc: '印生活',
        path: '/pages/catalog/catalog'
      }
    }
  }
</script>

<style scoped>
  /*父组件在当前页改变子组件的背景色*/
  .index-searchbar /deep/ .search .input{
  background-color: #f7f7f7;
  box-shadow: none;
  color: #9b9b9b;
}
 .index-searchbar /deep/ .search .txt{
  color: #9b9b9b;
}
</style>

<style>
page {
  height: 100%;
}

.container {
  background: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.index-searchbar {
  position: absolute;
  z-index: 99;
  left: 0rpx;
  width:750rpx;
  overflow: hidden;
  padding:10rpx 0;
  height:74rpx;

}
.catalog {
  flex: 1;
  width: 100%;
  background: #fff;
  display: flex;
  border-top: 1px solid #fafafa;
  margin-top: 80rpx;
}

.catalog .nav {
  width: 180rpx;
  height: 92%;
  
}

.catalog .nav .item {
  text-align: center;
  line-height: 100rpx;
  width: 180rpx;
  height: 100rpx;
  color: #282828;
  font-size: 24rpx;
  border-left: 6rpx solid #f1f1f1;
  overflow: hidden;
  margin-top: 3rpx;
  background: #f1f1f1;
}

.catalog .nav .item.active {
  color: #20b2aa;
  font-size: 24rpx;
  background: #fff;
}

.catalog .cate {
  /* border-left: 1px solid #fafafa; */
  flex: 1;
  padding: 0 40rpx 0 40rpx;
}

.banner {
  display: block;
  height: 222rpx;
  width: 100%;
  position: relative;
}

.banner .image {
  position: absolute;
  top: 30rpx;
  left: 0;
  border-radius: 4rpx;
  height: 192rpx;
  width: 100%;
}

.banner .txt {
  position: absolute;
  top: 30rpx;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  left: 0;
  height: 192rpx;
  line-height: 192rpx;
  width: 100%;
}
.catalog .cate_item{
  padding: 10rpx 0;
  box-sizing: border-box;
  border-bottom: 3rpx solid #f1f1f1;
}

.catalog .hd {
  height: 65rpx;
  line-height: 65rpx;
  width: 100%;
  margin-top: 10rpx;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.catalog .hd .txt {
  font-size: 22rpx;
  text-align: left;
  color: #282828;
  width: auto;
}

.catalog .hd .line {
  width: 40rpx;
  height: 1px;
  background: #d9d9d9;
}

.catalog .bd {
  height: auto;
  width: 100%;
  overflow: hidden;
}

.catalog .bd .item {
  display: block;
  float: left;
  height: 210rpx;
  width: 136rpx;
  margin-left: 30rpx;
  margin-top: 20rpx;
}
.catalog .bd .item:nth-child(3n+1){
  margin-left: 0;
}

.catalog .bd .item.last {
  margin-right: 0;
}

.catalog .bd .item .icon {
  height: 136rpx;
  width: 136rpx;
  overflow: hidden;
}

.catalog .bd .item .txt {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #282828;
  height: 74rpx;
  line-height: 30rpx;
  width: 100%;
}

</style>
