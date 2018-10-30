<template >
<view class="container">
  <view class="no-cart" v-if="cartGoods.length <= 0 && !loading">
    <view class="c">
      <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" />
      <text>购物车空空如也,快去逛逛吧</text>
    </view>
  </view>


  <view class="cart-view"  >
    <view class="cart-address clear" v-if="cartGoods.length != 0 && !loading">
      <!-- <view class="posi-img">
        <img src="/static/images/icon_cart_position.png" background-size="cover"/>
      </view> -->
       <view class="from">此购物车价格仅供参考</view>
       <view class="to">请以下单的价格为标准</view>
       <view class="edit" @click="editCart">{{!isEditCart ? '编辑商品' : '完成'}}</view>       
    </view>

     <view class="list" v-if="cartGoods.length != 0 && !loading">
      <view class="group-item">
        <view class="goods">
          <view :class="isEditCart ? 'edit item' : 'item'" v-for="(item, index) of cartGoods" :key="item.Id" @click="checkedItem(index)">
            <view :class="item.checked == true ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></view>
            <view class="cart-goods" @click.stop="toDetail(item)">
              <img class="img" :src="baseUrl + item.ImagePath + '/1_350.png'"/>
              <view class="info">
                <view class="t">
                  <text class="name">{{item.ProductName}}</text>
                  <text class="num">{{item.IsCustom ? '非标品' : 'x' + item.Quantity}}</text>
                </view>
                <view class="attr" v-if="item.IsCustom">已选：{{ item.ParaStr }}</view>
                <view class="attr" v-else>已选：{{item.Color}} {{item.Size}} {{item.Version}} {{item.Material}} {{item.Fashion}} {{item.Grams}} {{item.Ensemble}}</view>
                <view class="b">
                  <view class="price">
                    <text class="icon">￥</text>{{item.IsCustom ? item.fbpPrice : item.bpTotal }}
                  </view>
                  <view class="selnum" v-if="false">
                    <view class="cut" @click.stop="cutNumber" :data-item-index="index">-</view>
                    <input v-model.lazy="item.Quantity" class="number" disabled="true" type="number" />
                    <view class="add" @click.stop="addNumber" :data-item-index="index">+</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <loadingComponent v-if="loading"></loadingComponent>

    
    <view class="cart-bottom" v-if="cartGoods.length != 0 && !loading">
      <view :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选</view>
      <view class="total">总金额：<text class="total-price" v-if="allPrice != undefined">{{'￥'+ allPrice}}</text></view>
      <view class="checkout" @click="checkoutOrder" v-if="!isEditCart">去结算</view>
      <view class="delete" @click="deleteCart" v-if="isEditCart">删除</view>
    </view>
  </view>

</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import util from '@/utils/util'
import loadingComponent from '@/components/loadingComponent'
import { mapState , mapActions } from 'vuex'

export default {
  components: {
    loadingComponent
  },
  data () {
    return {
      cartGoods: [],
      cartTotal: {
        'goodsCount': 0,
        'goodsAmount': 0.00,
        'checkedGoodsCount': 0,
        'checkedGoodsAmount': 0.00
      },
      isEditCart: false,
      checkedAllStatus: false,
      selectGoods: {
        Price: 0
      },
      pageNo: 1,
      pageSize: 15,
      loading: true
    }
  },
  // 每次打开触发，更新数据
  async mounted () {
    this.cartGoods = []
    this.pageNo = 1
    this.checkedAllStatus = false
    this.isEditCart = false
    this.loading = true
    await Promise.all([
      this.getCartList()
    ])
    this.loading = false
    
  },
  computed: {
    ...mapState([
      'userInfo',
      'shoppingCartCount'
    ]),
    baseUrl () {
      return this.$wx.baseUrl
    },
    allPrice () {
      var num = 0
      this.cartGoods.map(function (v) {
          if(v.checked && v.IsCustom) {
            num = util.addNum(num , v.fbpPrice)
          }
          if(v.checked && !v.IsCustom) {
            let toTal = util.accMul(v.bpPrice , v.Quantity)
            num = util.addNum(num , toTal)
          }
      })
      return Number(num.toString().match(/^\d+(?:\.\d{0,2})?/))
    }
  },
  methods: {
    ...mapActions([
      'submitByShoppingCart'
    ]),
    // 请求购物车数据
    async getCartList () {
      const openId = wx.getStorageSync('openId')
      var par = {
        openId : openId,
        pageNo : this.pageNo,
        pageSize : this.pageSize
      }
      const res = await api.getShoppingCartList(par);
      if(res.success) {
        var resData = JSON.parse(res.data)
        let resArr = []
        resData.Table.map(item => {
          item.bpTotal = util.accMul(item.bpPrice , item.Quantity)
          resArr.push(item)
        })
        this.cartGoods = this.cartGoods.concat(resArr)
      }
      // this.checkedAllStatus = this.isCheckedAll();
    },
    // 判断购物车是否全选
    isCheckedAll () {
      return this.cartGoods.every(function (element, index, array) {
        if (element.checked === 1) {
          return true;
        } else {
          return false;
        }
      });
    },
    // checkbox的点击事件
    async checkedItem (index) {
      // this.selectGoods = item
      var cartList = this.cartGoods
      this.cartGoods = []
      if(cartList[index].checked == undefined) {
        cartList[index].checked = false
      }
      cartList[index].checked = !cartList[index].checked
      this.cartGoods = cartList
    },
    // 计算选中的商品数量
    getCheckedGoodsCount () {
      let checkedGoodsCount = 0;
      this.cartGoods.forEach(function (v) {
        if (v.checked === true) {
          checkedGoodsCount += v.number;
        }
      });
      return checkedGoodsCount;
    },
    // 点击底部的“全选”
    checkedAll () {
      var _this = this
      let tmpCartList = this.cartGoods.map(function (v) {
          v.checked = !_this.checkedAllStatus;
          return v;
      });
      this.cartGoods = tmpCartList
    },
    // 点击“编辑/完成”按钮
    editCart () {
      // 编辑状态
      if (this.isEditCart) {
        this.isEditCart = !this.isEditCart;
      } else {
        this.isEditCart = !this.isEditCart;
      }
    },
    // 减少数量
    cutNumber (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
      const saleNumber =  cartItem.SaleNumber;//最低销售量
      let number = cartItem.Quantity - 1
      if(number < saleNumber) {
        this.$wx.showErrorToast('不能低于最低销售量')
        number = saleNumber
      }
      cartItem.number = number;
      this.cartGoods[itemIndex].Quantity = number;
    },
    // 增加数量
    addNumber (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
      const stock = cartItem.Stock
      let number = cartItem.Quantity + 1;
      if(number <= stock) {
        this.cartGoods[itemIndex].Quantity = number;
      } else {
        this.$wx.showErrorToast('超出库存')
      }
    },
    // 点击“下单”，跳转到下单页
    checkoutOrder () {
      // 获取已选择的商品
      const openId = wx.getStorageSync('openId')
      let shopCartIds = ''
      this.cartGoods.map(function (element) {
        if (element.checked) {
          shopCartIds += `${element.Id},`
        }
      });
      if (shopCartIds == '') {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '未选择任何商品',
          mask: true
        });
        return false;
      }
      shopCartIds = shopCartIds.substring(0,shopCartIds.length-1)
      let par = {
        shopCartIds: shopCartIds
      }
      
      this.submitByShoppingCart(par)

    },
    // 点击“删除所选”
    deleteCart () {
      this.cartGoods.map(item => {
        if(item.checked) {
          this.deleteCartApi(item.Id)
        }
      })  
    },
    async deleteCartApi (id) {
      const openId = wx.getStorageSync('openId')
      var par = {
        openId: openId,
        Id: id,
        rowState: 'D'
      }
      this.$wx.showLoading()
      const res = await api.modifyShoppingCart(par)
      this.$wx.hideLoading()
      if(res.success) {
        this.cartGoods = this.cartGoods.filter(function (element, index, array) {
        if (element.Id === par.Id) {
            return false;
          } else {
            return true;
          }
        })
        this.$wx.showSuccessToast('移除成功!')
      } else {
        this.$wx.showErrorToast(res.msg)
      }
    },
    async refresh() {
      this.pageNo = 1
      this.cartGoods = []
      this.checkedAllStatus = false
      this.loading = true
      await Promise.all([
        this.getCartList()
      ])
      this.loading = false
    },
    toDetail(item) {
      const goodsUrl = util.getGoodsUrl({
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            code: item.QitemCode,
            IsCustom: item.IsCustom , 
            dataStr: item.DataStr,
            skuId: item.SkuId
          })
      this.$router.push(goodsUrl)
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
    },
    shoppingCartCount () {
      this.refresh()
    },
    userInfo () {
      this.refresh()
    }
  },
    // 小程序原生上拉加载
  onReachBottom () {
    this.pageNo++
    this.getCartList()
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
      path: '/pages/cart/cart'
    }
  }
}
</script>

<style>
page{
    height: 100%;
    min-height: 100%;
    background: #f4f4f4;
}
.container{
    background: #f4f4f4;
    width: 100%;
    height: auto;
    min-height: 100%;
    overflow: hidden;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.no-cart{
  width: 280rpx;
  height: 230rpx;
  margin: 100rpx auto;
  text-align: center
}
.no-cart .c{
  width: 100%;
  line-height: 50rpx;
  color: #333333;
  font-size: 28rpx;
}
.no-cart .g{
  width: 100%;
  line-height: 50rpx;
  color: #666666;
  font-size: 24rpx;
}
.no-cart .k{
  width: 150rpx;
  height: 58rpx;
  line-height: 58rpx;
  color: #009e96;
  font-size: 24rpx;
  border: 3rpx solid #009e96;
  background-color: #fff;
  margin: 30rpx auto;
}

.no-cart{
    width: 100%;
    height: auto;
    margin: 0 auto;
}

.no-cart .c{
    width: 100%;
    height: auto;
    margin-top: 200rpx;
}

.no-cart .c image{
    margin: 0 auto;
    display: block;
    text-align: center;
    width: 258rpx;
    height: 258rpx;
}

.no-cart .c text{
    margin: 0 auto;
    display: block;
    width: 258rpx;
    height: 29rpx;
    line-height: 29rpx;
    text-align: center;
    font-size: 29rpx;
    color: #999;
}


.cart-address{
  width: 750rpx;
  height: 80rpx;
  line-height: 80rpx;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.cart-address .posi-img{
  width: 30rpx;
  height: 30rpx;
  float: left;
  align-items: center;
  justify-content: center;
}
.posi-img img{
  width: 100%;
  height: 100%;
}
.cart-address .from,.cart-address .to{
  float: left;
  color: #acacac;
  font-size: 20rpx;
  margin-left: 10rpx;
}
.cart-address .edit{
  float: right;
  font-size: 24rpx;
  color: #333;
}
.service-policy{
    width: 720rpx;
    height: 73rpx;
    background: #f4f4f4;
    padding: 0 31.25rpx;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
}

.service-policy .item{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png) 0 center no-repeat;
    background-size: 10rpx;
    padding-left: 15rpx;
    display: flex;
    align-items: center;
    font-size: 25rpx;
    color: #666;
}


.cart-view{
    width: 100%;
    height: auto;
    overflow: hidden;

}

.cart-view .list{
    height: auto;
    width: 100%;
    overflow: hidden;
    margin-top: 100rpx;
    margin-bottom: 120rpx;
}

.cart-view .group-item{
    height: auto;
    width: 100%;
    background: #fff;
    margin-bottom: 18rpx;
}

.cart-view .item{
    height: 228rpx;
    width: 100%;
    overflow: hidden;
    border-bottom: 2rpx solid #f1f1f1;
}
.cart-view .item .checkbox{
    float: left;
    height: 34rpx;
    width: 34rpx;
    margin: 90rpx 18rpx 90rpx 26rpx;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-0e09baa37e.png) no-repeat;
    background-size: 34rpx;
}

.cart-view .item .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}

.cart-view .item .cart-goods{
    float: left;
    height: 228rpx;
    width: 672rpx;
    border-bottom: 1px solid #f4f4f4;
}

.cart-view .item .img{
    float: left;
    height:190rpx;
    width: 190rpx;
    background: #f4f4f4;
    margin: 19.5rpx 18rpx 19.5rpx 0;
}

.cart-view .item .info{
    float: left;
    width: 435rpx;
    margin: 19.5rpx 26rpx 19.5rpx 0;
    height: 190rpx;
    position: relative;
}

.cart-view .item .t{
    /* height: 65rpx; */
    margin: 8rpx 0;
    font-size: 24rpx;
    color: #282828;
    overflow: hidden;
}
.cart-view .item .name{
    float: left;
    line-height: 30rpx;
    font-size: 24rpx;
    color: #282828;
    width: 350rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.cart-view .item .num{
    width: 70rpx;
    height: 28rpx;
    line-height: 28rpx;
    float: right;
}

.cart-view .item .attr{
    width: 400rpx;
    /* height: 55rpx;  */
    margin-top: 10rpx;
    margin-bottom: 15rpx;
    line-height: 25rpx;
    font-size: 20rpx;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.cart-view .item .b{   
    line-height: 30rpx;
    font-size: 32rpx;
    color: #dc2121;
    overflow: hidden;
    position: absolute;
    bottom: 4rpx;
}
.cart-view .item .b .icon{
  font-size: 28rpx;
}
.cart-view .item .price{
    float: left;
}

.cart-view .item .open{
    height: 28rpx;
    width: 150rpx;
    display: block;
    float: right;
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/arrowDown-d48093db25.png) right center no-repeat;
    background-size: 25rpx;
    font-size: 25rpx;
    color: #333;
}

.cart-view .item.edit .attr{
    text-align: right;
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/arrow-right1-e9828c5b35.png) right center no-repeat;
    padding-right: 25rpx;
    background-size: 12rpx 20rpx;
    margin-bottom: 24rpx;
    height: 39rpx;
    line-height: 39rpx;
    font-size: 24rpx;
    color: #999;
    overflow: hidden;
}

.cart-view .item.edit .b{
    display: flex;
    height: 52rpx;
    overflow: hidden;
}

.cart-view .item.edit .price{
    line-height: 52rpx;
    height: 52rpx;
    flex: 1;
}

.cart-view .item .selnum{
    display: none;
}

.cart-view .item.edit .selnum{
    width: 235rpx;
    height: 48rpx;
    border: 1rpx solid #ccc;
    display: flex;
}

.selnum .cut{
    width: 70rpx;
    height: 100%;
    text-align: center;
    line-height: 48rpx;
}

.selnum .number{
    flex: 1;
    height: 100%;
    text-align: center;
    line-height: 68.75rpx;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    float: left;
}

.selnum .add{
    width: 80rpx;
    height: 100%;
    text-align: center;
    line-height: 48rpx;
}


.cart-view .group-item .header{
    width: 92%;
    height: 94rpx;
    line-height: 94rpx;
    padding: 0 26rpx;
    border-bottom: 1px solid #f4f4f4;
}

.cart-view .promotion .icon{
    display: inline-block;
    height: 24rpx;
    width: 15rpx;
}

.cart-view .promotion{
    margin-top: 25.5rpx;
    float: left;
    height: 43rpx;
    width: 480rpx;
    /*margin-right: 84rpx;*/
    line-height: 43rpx;
    font-size: 0;
}

.cart-view .promotion .tag{
    border: 1px solid #f48f18;
    height: 37rpx;
    line-height: 31rpx;
    padding: 0 9rpx;
    margin-right: 10rpx;
    color: #f48f18;
    font-size: 24.5rpx;
}

.cart-view .promotion .txt{
    height: 43rpx;
    line-height: 43rpx;
    padding-right: 10rpx;
    color: #333;
    font-size: 29rpx;
    overflow: hidden;
}

.cart-view .get{
    margin-top: 18rpx;
    float: right;
    height: 58rpx;
    padding-left: 14rpx;
    border-left: 1px solid #d9d9d9;
    line-height: 58rpx;
    font-size: 29rpx;
    color: #333;
}

.cart-bottom{
    position: fixed;
    bottom:0;
    left:0;
    height: 88rpx;
    width: 100%;
    background: #fff;
    display: flex;
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
}

.cart-bottom .checkbox.checked{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/checkbox-checked-822e54472a.png) no-repeat;
    background-size: 34rpx;
}

.cart-bottom .total{
    height: 88rpx;
    line-height: 88rpx;
    flex: 1;
    font-size: 24rpx;
    color: #666666;
    text-align: right;
    padding-right: 20rpx;
    box-sizing: border-box;

}
.cart-bottom .total .total-price{
  color: #009e96;
  font-size: 32rpx;
}
/* .cart-bottom .delete{
    height: 34rpx;
    width: auto;
    margin: 33rpx 18rpx;
    font-size: 29rpx;
} */

.cart-bottom .checkout{
    height: 88rpx;
    width: 180rpx;
    text-align: center;
    line-height: 88rpx;
    font-size: 28rpx;
    background: #009e96;
    color: #fff;
}
.cart-bottom .delete{
    height: 88rpx;
    width: 180rpx;
    text-align: center;
    line-height: 88rpx;
    font-size: 28rpx;
    background: #009e96;
    color: #fff;
}
</style>
