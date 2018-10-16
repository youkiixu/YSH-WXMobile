<template >
<view class="container">
  <!-- <view class="service-policy">
    <view class="item">30天无忧退货</view>
    <view class="item">48小时快速退款</view>
    <view class="item">满88元免邮费</view>
  </view> -->
  <view class="no-cart" v-if="cartGoods.length <= 0">
    <view class="c">
      <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" />
      <text>购物车空空如也,快去逛逛吧</text>
    </view>
  </view>

  <!-- <view class="no-cart" v-if="cartGoods.length <= 0">
    <view class="c">购物车空空如也</view>
    <view class="g">快去逛逛吧</view>
    <view class="k">去逛逛</view>
  </view> -->

  <view class="cart-view" v-if="cartGoods.length">
    <view class="cart-address clear">
      <view class="posi-img">
        <img src="/static/images/icon_cart_position.png" background-size="cover"/>
      </view>
       <view class="from">配送广东省 佛山市 南海区</view>
       <view class="to">至广东省 佛山市 南海区</view>
       <view class="edit" @click="editCart">{{!isEditCart ? '编辑商品' : '完成'}}</view>       
    </view>

     <view class="list">
      <view class="group-item">
        <view class="goods">
          <view :class="isEditCart ? 'edit item' : 'item'" v-for="(item, index) of cartGoods" :key="item.Id" @click="checkedItem(index)">
            <view :class="item.checked == true ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></view>
            <view class="cart-goods">
              <img class="img" :src="baseUrl + item.ImagePath + '/1_350.png'"/>
              <view class="info">
                <view class="t">
                  <text class="name">{{item.ProductName}}</text>
                  <text class="num">x{{item.Quantity}}</text>
                </view>
                <view class="attr">已选：{{item.Color}} {{item.Size}} {{item.Version}} {{item.Material}} {{item.Fashion}} {{item.Grams}} {{item.Ensemble}}</view>
                <view class="b">
                  <view class="price">
                    <text class="icon">￥</text>{{item.Price}}
                  </view>
                  <!-- <view class="selnum">
                    <view class="cut" @click="cutNumber" :data-item-index="index">-</view>
                    <input :value="item.number" class="number" disabled="true" type="number" />
                    <view class="add" @click="addNumber" :data-item-index="index">+</view>
                  </view> -->
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

   <view class="cart-bottom">
      <view :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选</view>
      <view class="total">总金额：<text class="total-price">{{!isEditCart ? '￥'+ selectGoods.Price : ''}}</text></view>
      <view class="checkout" @click="checkoutOrder" v-if="!isEditCart">去结算</view>
      <view class="delete" @click="deleteCart" v-if="isEditCart">删除</view>
    </view>

  </view>

</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import { mapState , mapActions } from 'vuex'

export default {
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
      pageSize: 15
    }
  },
  // 每次打开触发，更新数据
  onShow () {
    this.cartGoods = []
    this.pageNo = 1
    this.getCartList()
    
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    baseUrl () {
      return this.$wx.baseUrl
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
        this.cartGoods = this.cartGoods.concat(resData.Table)
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
        // this.getCartList();
        this.isEditCart = !this.isEditCart;
      } else {
        // 非编辑状态
        // let tmpCartList = this.cartGoods.map(function (v) {
        //   v.checked = false;
        //   return v;
        // });
        // this.editCartList = this.cartGoods;
        // this.cartGoods = tmpCartList;
        this.isEditCart = !this.isEditCart;
        
        // this.checkedAllStatus = this.isCheckedAll();
        // this.cartTotal.checkedGoodsCount = this.getCheckedGoodsCount();
      }
    },
    // 更新购物车数据，点击+或—触发
    async updateCart (productId, goodsId, number, id) {
      const res = await api.CartUpdate({
        productId: productId,
        goodsId: goodsId,
        number: number,
        id: id
      });
      if (res.errno === 0) {
        // this.cartGoods = res.data.cartList;
        // this.cartTotal = res.data.cartTotal;
      }
      // this.checkedAllStatus = this.isCheckedAll();
    },
    // 减少数量
    cutNumber (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
      let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
      cartItem.number = number;
      this.cartGoods = this.cartGoods;
      this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },
    // 增加数量
    addNumber (event) {
      let itemIndex = event.target.dataset.itemIndex;
      let cartItem = this.cartGoods[itemIndex];
      let number = cartItem.number + 1;
      cartItem.number = number;
      this.cartGoods = this.cartGoods;
      this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
    },
    // 点击“下单”，跳转到下单页
    checkoutOrder () {
      // 获取已选择的商品
      const openId = wx.getStorageSync('openId')
      let shopCartIds = ''
      console.log(this.cartGoods)
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
    this.getCartList()
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.pageNo = 1
    this.cartGoods = []
    this.getCartList()
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
    width: 420rpx;
    margin: 19.5rpx 26rpx 19.5rpx 0;
}

.cart-view .item .t{
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
    width: 360rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.cart-view .item .num{
    width: 60rpx;
    height: 28rpx;
    line-height: 28rpx;
    float: right;
}

.cart-view .item .attr{
    width: 400rpx;
    height: 50rpx;
    margin-top: 10rpx;
    margin-bottom: 17rpx;
    line-height: 25rpx;
    font-size: 20rpx;
    color: #666;
    overflow: hidden;/*超出部分隐藏*/
    /* white-space: nowrap; */
    text-overflow:ellipsis;/*超出部分文字以...显示*/  
}

.cart-view .item .b{   
    line-height: 30rpx;
    font-size: 32rpx;
    color: #dc2121;
    overflow: hidden;
    margin-top: 30rpx;
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

.cart-view .item.edit .t{
    /* display: none; */
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
    flex: 1;
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
    text-align: left;
    padding-left: 20rpx;
    box-sizing: border-box;
}
.cart-bottom .total .total-price{
  color: #009e96;
  font-size: 32rpx;
}
.cart-bottom .delete{
    height: 34rpx;
    width: auto;
    margin: 33rpx 18rpx;
    font-size: 29rpx;
}

.cart-bottom .checkout{
    height: 88rpx;
    width: 180rpx;
    text-align: center;
    line-height: 88rpx;
    font-size: 28rpx;
    background: #009e96;
    color: #fff;
}
</style>
