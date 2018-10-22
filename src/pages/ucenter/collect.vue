<template >
<view class="container">

<view class="collect-head">
   <view class="sort">  
      <view class="item" @click="GoodsCollect">商品收藏</view>  
      <view class="item" @click="shopCollect">厂家收藏</view>  
      <view class="item">我的足迹</view>   
  </view>
  <view class="classifi">  
      <view class="inner">全部</view>  
      <view class="inner">降价</view>  
      <view class="inner">特卖</view> 
      <view class="inner manage" @click="editGoodsCollect">管理</view>   
  </view>
</view>


<!-- 商品收藏 -->
<view class="goodsCollect" v-if="isgoodsCollect">
  <view class="goodslist">
      <view class="group-item">
        <view class="goods">
          <view class="item clear"    @touchstart="touchStart" @touchend="touchEnd"
      v-for="(item, index) of collectList" :key="item.Id" :data-index="index">
      <!-- <view :class="selectGoods.Id == item.Id ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></view> -->
            <view :class="item.checked == true ? 'checked checkbox' : 'checkbox'" @click.stop="checkedItem(index)" :data-item-index="index" v-if="iseditGoodsCollect"></view>
            <view class="cart-goods clear">
              <img class="img" :src="baseUrl + item.imagePath + '/1_350.png'"/>
              <view class="info" @click="openGoods(item)">
                <view class="t">
                  <text class="name">{{item.ProductName}}</text>                 
                </view>
                <view class="b">
                  <view class="price">
                    <text class="icon">￥</text>{{item.MinSalePrice}}
                  </view>                
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

      <view class="cart-bottom clear" v-if="iseditGoodsCollect">
      <!-- <view :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选({{cartTotal.checkedGoodsCount}})</view> -->
      <!-- <view class="delete" @click="deleteCart" v-if="isEditCart">删除</view> -->
      <view :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选</view>
      <view class="delete" @click="deleteGoods">删除</view>
      
    </view>


</view>
 

<!-- 厂家收藏 -->
 <view class="shopCollect" v-if="isshopCollect">
   <view class="shoplist">
      <view class="shop-item">
        <view class="shop">
          <view class="item clear" @click="openShop"  @touchstart="touchStart" @touchend="touchEnd">
      <!-- <view :class="selectGoods.Id == item.Id ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></view> -->
            <!-- <view class="checkbox"></view> -->
            <view class="cart-shop clear">
              <img class="img"/>
              <view class="info">广州市艺彩印务有限公司</view>
            </view>
          </view>        
        </view>
      </view>
   </view>
 </view>



</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'

export default {
  data () {
    return {
      typeId: 0,
      collectList: [],
      pageNo:0,
      pageSize: 20,
      isgoodsCollect:true,
      isshopCollect:false,
      iseditGoodsCollect:false,
      checkedAllStatus: false,
      selectGoods:0,
      ProductIds:0
    }
  },
   // 每次打开触发，更新数据
  async mounted () {
    await Promise.all([
      this.GetFavoriteProductList()
    ])
  },
  computed: {
    baseUrl () {
      return this.$wx.baseUrl
    },
  },
  methods: {
    // 获取我的收藏信息
    async GetFavoriteProductList () {
      const openId = wx.getStorageSync('openId')
      this.pageNo++
      const res = await api.GetFavoriteProductList({ openId: openId , pageNo: this.pageNo , pageSize: this.pageSize });
      if (res.success) {
        var tableData = JSON.parse(res.data)
        this.collectList = this.collectList.concat(tableData.Table)
      }
    },
    // 商品管理
    editGoodsCollect () {
      // 编辑状态
      if (this.iseditGoodsCollect) {
        this.GetFavoriteProductList()
        this.iseditGoodsCollect = !this.iseditGoodsCollect;
      } else {
        // 非编辑状态
        this.iseditGoodsCollect = !this.iseditGoodsCollect;
      
      }
    },
    // checkbox的点击事件
    async checkedItem (index) {
      var goodsList = this.collectList
      this.collectList = []
      if(goodsList[index].checked == undefined) {
        goodsList[index].checked = false
      }
      goodsList[index].checked = !goodsList[index].checked
      this.collectList = goodsList
    },
    // 点击底部的“全选”
    checkedAll () {
      var _this = this
      let tmpGoodsList = this.collectList.map(function (v) {
          v.checked = !_this.checkedAllStatus;
          return v;
      });
      this.collectList = tmpGoodsList
      this.checkedAllStatus = this.isCheckedAll();
    },
    // 判断购物车是否全选
    isCheckedAll () {
      return this.collectList.every(function (element, index, array) {
        if (element.checked === true) {
          return true;
        } else {
          return false;
        }
      });
    },

     // 点击“删除所选”
     async deleteGoods () {
      const openId = wx.getStorageSync('openId')
      var idStr = ''
      var ids = ''
      this.collectList.map((item , index) => {//循环
          if(item.checked){
            idStr += item.ProductId + ','
            ids += item.Id + ','
          }
      })
      var par = {
        openId: openId,
        Ids: ids,    
        ProductIds: idStr 
      }
      this.$wx.showLoading()
      
      const res = await api.CancelConcernProducts(par)
      this.$wx.hideLoading() 
      if(res.success) {
        // this.collectList = this.collectList.filter(function (element, index, array) {
        // if (element.Id === par.Ids) {        
        //     return false;           
        //   } else {
        //     return true;            
        //   }         
        // })    
        this.pageNo = 0
        this.collectList = []
        this. GetFavoriteProductList()    
        this.$wx.showSuccessToast('移除成功!')
      } else {
        this.$wx.showErrorToast(res.msg)
      }
    },
    //点击进入商品详情
    async openGoods (event) {
      console.log(event)
            const ProductId = event.ProductId
            const res = await api.getProductQitemCode({Id : ProductId})
            if(res.success) {
                const pid = res.data
                if( pid != 0 ) {
                this.$wx.toBaoJia({ pid: pid , title: ProductName , isDetail: true , ProductId: ProductId } , this)
                } else {
                this.$wx.toDetail({id : ProductId , title: event.ProductName} , this)
                }
            } else {
                this.$wx.showErrorToast(res.msg)
            }

    },
    // 按下事件开始
    touchStart (e) {
      this.touch_start = e.timeStamp;
    },
    // 按下事件结束
    touchEnd (e) {
      this.touch_end = e.timeStamp;
    }
  },
   watch: {
    cartGoods (oldval , newval) {
      if(oldval.length == 0 || newval.length == 0) {
        return
      }
      const len = newval.length 
      let num = 0
      newval.map((item) => {
        if(item.checked) {
          num++
        }
      })
      if(num == len) {
        this.checkedAllStatus = true
      } else {
        this.checkedAllStatus = false
      }
    }
  },
    // 小程序原生上拉加载
  onReachBottom () {
    this.pageNo++
    this.GetFavoriteProductList()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.pageNo = 1
    this.collectList = []
    this.GetFavoriteProductList()
    wx.stopPullDownRefresh()
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活',
      path: '/pages/ucenter/collect'
    }
  }
}
</script>

<style scoped>
page{
    background: #f1f1f1;
    height: 100%;
}

.container{
    background: #f1f1f1;
    height: 100%;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.collect-head{
  position: fixed;
  left: 0;
  z-index: 10;
  background-color: #fff;
}
.collect-head .sort{
  height: 80rpx;
  width: 750rpx;
  display: flex;
  border-bottom: 2rpx solid #f1f1f1;
}
.collect-head .sort .item{
    line-height: 80rpx;
    text-align: center;
    flex:1;
    color: #282828;
    font-size: 28rpx;
    margin-left: 60rpx;
}
.collect-head .sort .item:last-child{
  margin-right: 60rpx;
}
.collect-head .classifi{
  height: 70rpx;
  width: 750rpx;
  display: flex;
  background-color: #fff;
}
.collect-head .classifi .inner{
    line-height: 70rpx;
    text-align: center;
    flex:2;
    color: #282828;
    font-size: 24rpx;
    margin-left: 60rpx;
}
.collect-head .classifi .manage{
  flex:1.5;
  border-left: 2rpx solid #f1f1f1;
}

 .goodslist{
    height: auto;
    width: 750rpx;
    overflow: hidden;
    margin-top: 170rpx;
    margin-bottom: 120rpx;
}
 .group-item{
    height: auto;
    width: 100%;
    background: #fff;
    margin-bottom: 18rpx;
}

.group-item .item{
    height: 228rpx;
    width: 100%;
    overflow: hidden;
    border-bottom: 2rpx solid #f1f1f1;
}
.group-item .item .checkbox{
    float: left;
    height: 34rpx;
    width: 34rpx;
    margin: 100rpx 15rpx 100rpx 20rpx;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
    background-size: 34rpx;
}

.group-item .item .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}
.group-item .item .cart-goods{
    float: left;
    height: 228rpx;
    width: 630rpx;
    border-bottom: 1px solid #f4f4f4;
}

.group-item .item .img{
    float: left;
    display: block;
    height:190rpx;
    width: 190rpx;
    background: #f4f4f4;
    margin: 19.5rpx 20rpx 19.5rpx 20rpx;
}

.group-item .item .info{
    float: left;
    width: 360rpx;
    margin: 19.5rpx 26rpx 19.5rpx 0;
}

.group-item .item .t{
    margin: 8rpx 0;
    font-size: 24rpx;
    color: #282828;
    overflow: hidden;
}
.group-item .item .name{
    line-height: 30rpx;
    font-size: 24rpx;
    color: #282828;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.group-item .item .b{   
    line-height: 30rpx;
    font-size: 32rpx;
    color: #dc2121;
    overflow: hidden;
    margin-top: 30rpx;
}
.group-item .item .b .icon{
  font-size: 28rpx;
}


.cart-bottom{
    position: fixed;
    bottom:0;
    left:0;
    height: 88rpx;
    width: 100%;
    background: #fff;
    display: flex;
    z-index: 10;
    border-bottom: 3rpx solid #e8e8e8;
    box-shadow: 1px 1px 3px 3px #e8e8e8;
}

.cart-bottom .checkbox{
    height: 34rpx;
    padding-left: 60rpx;
    line-height: 34rpx;
    margin: 33rpx 18rpx 33rpx 26rpx;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
    background-size: 34rpx;
    font-size: 24rpx;
    color: #666666;
    flex: 1;
}

.cart-bottom .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}

.cart-bottom .delete{
    width: 180rpx;
    height: 88rpx;
    font-size: 28rpx;
    float: right;
    color: #fff;
    text-align: center;
    line-height: 88rpx;
    background-color: #dc2121;

}

.shoplist{
    height: auto;
    width: 750rpx;
    overflow: hidden;
    margin-top: 170rpx;
    margin-bottom: 120rpx;
}
.shop-item{
    height: auto;
    width: 100%;
    background: #fff;
    margin-bottom: 18rpx;
}

.shop-item .item{
    height: 135rpx;
    width: 100%;
    overflow: hidden;
    border-bottom: 2rpx solid #f1f1f1;
}
.shop-item .item .checkbox{
    float: left;
    height: 34rpx;
    width: 34rpx;
    margin: 100rpx 15rpx 100rpx 20rpx;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
    background-size: 34rpx;
}

.shop-item .item .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}
.shop-item .item .cart-goods{
    float: left;
    height: 135rpx;
    width: 630rpx;
    border-bottom: 1px solid #f4f4f4;
}

.shop-item .item .img{
    float: left;
    display: block;
    height:110rpx;
    width: 110rpx;
    background: #f4f4f4;
    margin: 15rpx 20rpx 15rpx 20rpx;
}

.shop-item .item .info{
    float: left;
    width: 530rpx;
    line-height: 110rpx;
    vertical-align: middle;
    margin: 15rpx 26rpx 15rpx 0;
    color: #282828;
    font-size: 28rpx;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}


</style>
