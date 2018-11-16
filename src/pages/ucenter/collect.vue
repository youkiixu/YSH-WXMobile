<template >
<div class="container">

<div class="manage-head clear">
   <div  :class="iseditGoodsCollect ? 'edit management ' : 'management '" @click="editGoodsCollect">管理</div>   
</div>
  
<!-- <div class="collect-head">
   <div class="sort">  
      <div :class="isCollectSelect ? 'item' : 'select item'" @click="SelectCollect()">商品收藏</div>  
      <div :class="isCollectSelect ? 'select item' : 'item'" @click="SelectCollect()">厂家收藏</div>  
      <div :class="isCollectSelect ? 'select item' : 'item'" @click="SelectCollect()">我的足迹</div>   
  </div>
  <div class="classifi">  
      <div class="inner">全部</div>  
      <div class="inner">降价</div>  
      <div class="inner">特卖</div> 
      <div :class="iseditGoodsCollect ? 'edit inner manage' : 'inner manage'" @click="editGoodsCollect">管理</div>   
  </div>
</div> -->

<!-- 商品收藏 -->
<div class="goodsCollect" v-if="isgoodsCollect">
  <div class="goodslist">
      <div class="group-item">
        <div class="goods">
          <div class="item clear"    @touchstart="touchStart" @touchend="touchEnd"
      v-for="(item, index) of collectList" :key="item.Id" :data-index="index">
      <!-- <div :class="selectGoods.Id == item.Id ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></div> -->
            <div :class="item.checked == true ? 'checked checkbox' : 'checkbox'" @click.stop="checkedItem(index)" :data-item-index="index" v-if="iseditGoodsCollect"></div>
            <div class="cart-goods clear">
              <img class="img" :src="baseUrl + item.imagePath + '/1_350.png'"/>
              <div class="info" @click="openGoods(item)">
                <div class="t">
                  <text class="name">{{item.ProductName}}</text>                 
                </div>
                <div class="b">
                  <div class="price">
                    <text class="icon"></text>{{item.IsCustom ? '定制报价' : '￥' + item.MinSalePrice}}
                  </div>                
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="cart-bottom clear" v-if="iseditGoodsCollect">
      <!-- <div :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选({{cartTotal.checkedGoodsCount}})</div> -->
      <!-- <div class="delete" @click="deleteCart" v-if="isEditCart">删除</div> -->
      <div :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选</div>
      <div class="delete" @click="deleteGoods">删除</div>
      
    </div>


</div>
 

<!-- 厂家收藏 -->
 <div class="shopCollect" v-if="isshopCollect">
   <div class="shoplist">
      <div class="shop-item">
        <div class="shop">
          <div class="item clear" @click="openShop"  @touchstart="touchStart" @touchend="touchEnd">
      <!-- <div :class="selectGoods.Id == item.Id ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></div> -->
            <!-- <div class="checkbox"></div> -->
            <div class="cart-shop clear">
              <img class="img"/>
              <div class="info">广州市艺彩印务有限公司</div>
            </div>
          </div>        
        </div>
      </div>
   </div>
 </div>

<loadingComponent v-if="loading"></loadingComponent>
</div>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import loadingComponent from '@/components/loadingComponent'


export default {
   components: {
    loadingComponent
  },
  data () {
    return {
      typeId: 0,
      collectList: [],
      pageNo:0,
      pageSize: 20,
      isCollectSelect:false,
      isgoodsCollect:true,
      isshopCollect:false,
      iseditGoodsCollect:false,
      checkedAllStatus: false,
      selectGoods:0,
      ProductIds:0,
      loading: true
    }
  },
   // 每次打开触发，更新数据
  async mounted () {
    await Promise.all([
      this.GetFavoriteProductList()
    ])
    this.loading = false
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
                const fid = res.ShopMapId
                if( pid != 0 ) {
                this.$wx.toBaoJia({ pid: pid , title: event.ProductName , isDetail: true , ProductId: ProductId , fid : fid } , this)
                } else {
                this.$wx.toDetail({id : ProductId , title: event.ProductName} , this)
                }
            } else {
                this.$wx.showErrorToast(res.msg)
            }

    },
    async refresh() {
      this.pageNo = 1
      this.collectList = []
      this.loading = true
      await Promise.all([
        this.GetFavoriteProductList()
      ])
      this.loading = false
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
    //this.GetFavoriteProductList()
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

.manage-head{
  width: 750rpx;
  height: 60rpx;
  position: fixed;
  z-index: 10;
  background-color: #fff;
}
.manage-head .management{
    width: 85rpx;
    height: 60rpx;
    text-align: center;
    line-height: 60rpx;
    color: #282828;
    font-size: 24rpx;
    float: right;
}
.manage-head .edit {
  color: #009e96;
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
.collect-head .sort .select{
  color: #009e96;
  border-bottom: 2rpx solid #009e96;
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
.collect-head .classifi .edit {
  color: #009e96;
}
.collect-head .classifi .manage{
  flex:1.5;
  border-left: 2rpx solid #f1f1f1;
}

 .goodslist{
    height: auto;
    width: 750rpx;
    overflow: hidden;
    /* margin-top: 170rpx; */
    margin-top: 80rpx;
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
