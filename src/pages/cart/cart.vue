<template >
<div>
  <div class="container">
  <div class="no-cart" v-if="cartGoods.length <= 0 && !loading">
    <div class="c">
      <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" />
      <text>购物车空空如也,快去逛逛吧</text>
    </div>
  </div>


  <div class="cart-view"  >
    <div class="cart-address clear" v-if="cartGoods.length != 0 && !loading">
       <div class="from">此购物车价格仅供参考</div>
       <div class="to">请以下单的价格为标准</div>
       <div class="edit" @click="editCart">{{!isEditCart ? '编辑商品' : '完成'}}</div>       
    </div>

     <div class="list" v-if="cartGoods.length != 0 && !loading">
      <div class="group-item">
        <div class="goods">
          <div :class="isEditCart ? 'edit item' : 'item'" v-for="(item, index) of cartGoods" :key="item.Id" @click="checkedItem(index)">
            <div :class="item.checked == true ? 'checked checkbox' : 'checkbox'"  :data-item-index="index"></div>
            <div class="cart-goods" @click.stop="toDetail(item)">
              <img class="img" :src="baseUrl + item.ImagePath + '/1_350.png'"/>
              <div class="info">
                <div class="t">
                  <text class="name">{{item.ProductName}}</text>
                  <text class="num">{{item.IsCustom ? '非标品' : 'x' + item.Quantity}}</text>
                </div>
                <div class="attr" v-if="item.IsCustom">已选：{{ item.ParaStr }}</div>
                <div class="attr attr-select" v-else @click.stop="openSelect(item)">{{item.SaleNumber&&item.Stock ? '已选：' + item.Color + item.Size + item.Version + item.Material + item.Fashion + item.Grams + item.Ensemble : '原商品已更换参数,不能下单,请重新选择参数'}}<text class="select-span">></text></div>
                <div class="b">
                  <div class="price">
                    <text class="icon">￥</text>{{ item.IsCustom ? (item.SaleNumber&&item.Stock ?  '已下架'  : item.fbpPrice)  : item.bpTotal}}
                  </div>
                  <div class="selnum" v-if="false">
                    <div class="cut" @click.stop="cutNumber" :data-item-index="index">-</div>
                    <input v-model.lazy="item.Quantity" class="number" disabled="true" type="number" />
                    <div class="add" @click.stop="addNumber" :data-item-index="index">+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <loadingMore v-if="more"></loadingMore>
        </div>
      </div>
    </div>
    <loadingComponent v-if="loading"></loadingComponent>

     
    <div class="cart-bottom" v-if="cartGoods.length != 0 && !loading">
      <div :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll">全选</div>
      <div class="total" ><text v-if="!isEditCart">总金额：</text><text class="total-price" v-if="allPrice != undefined && !isEditCart">{{'￥'+ allPrice}}</text></div>
      <div class="checkout" @click="checkoutOrder" v-if="!isEditCart">去结算</div>
      <div class="delete" @click="deleteCart" v-if="isEditCart">删除</div>
    </div>
  </div>

      <!-- 模态浮层 -->
    <div class="attr-pop-box" v-if="openAttr"  @click="closeAttr" catchtouchmove="stopPageScroll">
      <div class="attr-pop"  v-if="openAttr" @click.stop="closeAttr('no')">
        <selectComponent
          v-if="openAttr"
          :baseUrl="baseUrl"
          :detailInfo="edit.detailInfo"
          :ListPriceInfo="edit.ListPriceInfo"
          :selectSkuStr="edit.selectSkuStr"
          :selectSku="edit.selectSku"
          :strYjtype="edit.strYjtype"
          :SubmitByProductType="edit.SubmitByProductType"
          :number="edit.number"
          :Stock="edit.Stock"
          btnText="确认"
          @closeAttr="closeAttr"
          @toBaojia="toBaojia"
          @clickSkuValue="clickSkuValue"
          @addNumber="addNumber"
          @cutNumber="cutNumber"
          @addToCart="addToCart"
          @SubmitByProduct="upDateCart"
          @numberChange="numberChange"
        >
        </selectComponent>
      </div>
    </div>
    
</div>
</div>

</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import util from '@/utils/util'
import loadingComponent from '@/components/loadingComponent'
import loadingMore from '@/components/loadingMore'
import selectComponent from '@/components/selectComponent'
import { mapState , mapActions } from 'vuex'
function newEditInfo() {
  const editInfo = {
        detailInfo: {
          Material: [],
          Size: [],
          Version: [],
          Color: [],
          Grams: [],
          Fashion: [],
          Ensemble: []
        },
        ListPriceInfo :{
          sprice : 1,
          paraArr: []
        },
        selectSkuStr: {
          Color: '',
          Size: '',
          Version: '',
          Material: '',
          Fashion: '',
          Grams: '',
          Ensemble: ''
        },
        selectSku: {
          Color: 0,
          Size: 0, 
          Version: 0,
          Material: 0,
          Fashion: 0,
          Grams: 0,
          Ensemble: 0
        },
        strYjtype : '',
        SubmitByProductType: true,
        number: 0,
        Stock: 0,
        skuId: '',
        skuPrice: 0,
        saleNumber: 0,
        cartId: 0,
        id: 0
      }
    return editInfo
}

export default {
  components: {
    loadingComponent,
    selectComponent
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
      loading: true,
      openAttr: false,
      edit : {

      },
      intByPageIndex: 0,
      more: false
    }
  },
  async mounted () {
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
    // 统计选中的总价
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
      return Number(num.toFixed(2))
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
          // if(v.Stock && v.SaleNumber) {
            v.checked = !_this.checkedAllStatus;
          // }
          
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
    // 点击“下单”，跳转到下单页
    checkoutOrder () {
      // 获取已选择的商品
      const openId = wx.getStorageSync('openId')
      let shopCartIds = ''
      let downGoods = 0;
      this.cartGoods.map(function (element) {
        //11.12添加检查库存和最低销售数量不为Null的检测，判断这个skuId是否还存在
        if (element.checked) {
          // 判断库存和当前产品数量
          // 标品
          if(element.Stock && element.SaleNumber && !element.IsCustom){
            if(element.Quantity <= element.Stock) {
              shopCartIds += `${element.Id},`
            }
          }
          // 非标品直接通过
          if(element.IsCustom) {
            shopCartIds += `${element.Id},`
          }
          
        }
        if(!element.Stock && !element.SaleNumber) {
          downGoods++
        }
      });
      if (shopCartIds == '') {
        this.$wx.showErrorToast('未选择任何商品')
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
      this.isEditCart = false
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
        skuId: item.Stock && item.SaleNumber ? item.SkuId : null //增加库存和最低销售量判断
      })
      this.$router.push(goodsUrl)
    },
    async openSelect (item) {
      this.edit = newEditInfo()
      this.edit.cartId = item.Id
      this.edit.productId = item.ProductId
      this.$wx.showLoading('正在加载商品')
      await Promise.all([
        this.getGoodsSkuInfo(),
        this.getGoodsDetail(),
      ]);
      // 如果是已经下架的产品,库存和最低销售数量是null
      if(item.Stock && item.SaleNumber) {
        this.getRouteSku(item.SkuId)
        // 设置当前购物车里商品的数量,获取价格
        this.edit.number = item.Quantity
      } else {
        const skuInfo = this.edit.skuInfo
        skuInfo.sort(function(a , b){
          var a1 = a.Price
          var b1 = b.Price
          if(a1<b1){  
            return -1;  
          }else if(a1>b1){  
            return 1;  
          }  
          return 0; 
        })
        this.setSkuInfo(skuInfo[0])
      }
      
      this.getSkuPrice()
      this.$wx.hideLoading()

      this.openAttr = true

    },
    // 关闭规格弹窗
    closeAttr (e) {     
      if(e != 'no') {
        this.openAttr = false;
      }
    },
    // 获取商品SKu详情
    async getGoodsSkuInfo () {
      var par = {
        ProductId : this.edit.productId
      }
      const res = await api.getGetSKUInfo(par)
      if(res.success) {
        this.edit.skuInfo = res.data
      }
    },
    // 获取商品详情
    async getGoodsDetail () {
      const openId = wx.getStorageSync('openId')
      var par = {
        ProductId : this.edit.productId,
      }
      if(openId) {
        par = Object.assign(par ,{openId : openId})
      }
      const res = await api.getGoodsDetail(par)
      if(res.success){
        this.edit.detailInfo = res.data
      } else {
        this.$wx.showErrorToast(res.msg)
      }
    },
    // 根据路由信息进来
    getRouteSku (skuId) {
      const skuInfo = this.edit.skuInfo
      let skuItem = {}
      skuInfo.map(item => {
        if(item.SkuId == skuId) {
          skuItem = item
        }
      })
      this.setSkuInfo(skuItem)
    },
    // 设置skuid , SaleNumber , number , detailInfo.Price
    setSkuInfo (skuItem) {
      this.edit.skuId = skuItem.SkuId
      this.edit.Stock = skuItem.Stock
      // 默认数量和最低销售数量
      this.edit.number = skuItem.SaleNumber != 0 ? skuItem.SaleNumber : 1
      this.edit.saleNumber = skuItem.SaleNumber != 0 ? skuItem.SaleNumber : 1
      // 1031性能调优
      this.edit.skuPrice = skuItem.Price 
      this.edit.detailInfo.Price = skuItem.Price * this.edit.number
      this.getDefalutSelect()
    },
    getSkuPrice() {
      this.getSkuInfoPirce()
    },
    // 选择skuInfo的价格
    getSkuInfoPirce() {
      const skuInfo = this.edit.skuInfo
      const skuId = this.edit.skuId
      // 将数量转为纯数字
      this.edit.number = Number(this.edit.number)
      // 1031性能优化
      if(this.edit.number < this.edit.saleNumber) {
        this.edit.number = this.edit.saleNumber
      }
      this.edit.detailInfo.Price = util.accMul(this.edit.skuPrice , this.edit.number)
    },
    // 规格弹窗中，每个规则项的点击事件
    clickSkuValue (skuName , skuId , skuValue) {
      this.edit.selectSku[skuName] = skuId
      this.edit.selectSkuStr[skuName] = skuValue
      this.setSkuId()
    },
    setSkuId () {
      var skuStr = this.edit.productId + ''
      const selectSku = this.edit.selectSku
      for(var key in selectSku) {
        skuStr += `_${selectSku[key]}`
      }
      const skuInfo = this.edit.skuInfo
      // 1031性能调优
      let skuItem = {}
      skuInfo.map(item => {
        if(item.SkuId == skuStr) {
          skuItem = item
        }
      })
      this.setSkuInfo(skuItem)
    },
    // 获取默认选项
    getDefalutSelect() {
      const skuId = this.edit.skuId
      const skuIdArr = skuId.split('_')
      const selectSkuStr = this.edit.selectSkuStr
      const detailInfo = this.edit.detailInfo
      this.edit.selectSku.Color = Number(skuIdArr[1])
      this.edit.selectSku.Size = Number(skuIdArr[2])
      this.edit.selectSku.Version = Number(skuIdArr[3])
      this.edit.selectSku.Material = Number(skuIdArr[4])
      this.edit.selectSku.Fashion = Number(skuIdArr[5])
      this.edit.selectSku.Grams = Number(skuIdArr[6])
      this.edit.selectSku.Ensemble = Number(skuIdArr[7])
      //文字
      for(var key in selectSkuStr) {
        if(detailInfo[key].length != 0) {
          detailInfo[key].map(item => {
            if(item.SkuId === this.edit.selectSku[key]) {
              this.edit.selectSkuStr[key] = item.Value
            }
          })
        }
      }
    },
    // 减少数量
    cutNumber () {
      this.edit.number = this.edit.number - 1 
      this.getSkuInfoPirce()
    },
    // 增加数量
    addNumber () {
      this.edit.number = this.edit.number + 1;
      this.getSkuInfoPirce()
    },
    // 数量变化
    numberChange (number) {
      this.edit.number = number != '' ? Number(number) : this.edit.number
      this.getSkuInfoPirce()
    },
    // 更新购物车
    async upDateCart () {
      const openId = wx.getStorageSync('openId')
      var par = {
        Id: this.edit.cartId,
        openId: openId,
        productId: this.edit.productId,
        isCustom: this.edit.detailInfo.IsCustom,//标准品
        skuId: this.edit.skuId,
        quantity: this.edit.number,
        price: this.edit.detailInfo.Price,
        rowState: 'M'
      }
      // 标准品检查库存
      if(this.checkStock()) return
      this.$wx.showLoading('正在修改')
      const res = await api.modifyShoppingCart(par)
      this.$wx.hideLoading()
      if(res.success) {
        this.closeAttr()
        this.refresh()
        this.$wx.showSuccessToast('修改成功')
      } else {
        this.$wx.showErrorToast(res.msg)
      }
    },
    // 检查库存
    checkStock() {
      let check = false
      if(this.edit.number > this.edit.Stock) {
        this.$wx.showErrorToast('超出库存') 
        check = true
      }
      return check
    },
    //catchtouchmove阻止弹窗后滚动穿透
    stopPageScroll(){
      return
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
  async onReachBottom () {
    this.pageNo++
    this.more = true
    await Promise.all([
      this.getCartList()
    ])
    this.more = false
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
  z-index: 5;
  padding: 0 20rpx;
  box-sizing: border-box;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.2);
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
    max-height: 60rpx;
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
    max-height: 72rpx; 
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

.cart-view .item .selnum{
    display: none;
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
    box-shadow: 2rpx 0rpx 10rpx rgba(0,0,0,0.2);
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
    background: #b4282d;
    color: #fff;
}
.attr-pop-box {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, .5);
  z-index: 8;
  bottom: 0;
  
}

.attr-pop {
  width: 100%;
  max-height: 780rpx;
  padding: 31.25rpx 0  0 30.25rpx;
  background: #fff;
  position: fixed;
  z-index: 9;
  bottom: 100rpx;
}

.attr-select {
  position: relative;
  border: 1rpx solid #e5e5e5;
  padding: 10rpx 30rpx 10rpx 10rpx;
  border-radius: 4rpx;
  background: #f1f1f1;
  /* box-shadow: 0 0 2rpx rgba(0,0,0,0.05); */
}
.select-span {
  position: absolute;
  right: 5rpx;
  top: 50%;
  font-size: 30rpx;
  transform: translateY(-50%) rotate(90deg) scaleX(.5);
}
</style>
