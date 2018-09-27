<template >
<div>
    <view class="container">
    <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <swiper-item v-for="(item, index) of gallery" :key="item.id" :data-index="index">
        <img :src="item.img_url" background-size="cover"/>
        </swiper-item>
    </swiper>
    <!-- <view class="service-policy">
        <view class="item">30天无忧退货</view>
        <view class="item">48小时快速退款</view>
        <view class="item">满88元免邮费</view>
    </view> -->
    <view class="goods-info">
        <view class="c">
        <text class="name">{{detailInfo.ProductName}}</text>
        <text class="desc">{{detailInfo.ShortDescription}}</text>
        <text class="price">￥{{detailInfo.Price}}</text>
        <!-- <view class="brand" v-if="brand.name">
            <navigator :url="'../brand/brandDetail?id=' + brand.id">
            <text>{{brand.name}}</text>
            </navigator>
        </view> -->
        </view>
    </view>
    <view class="section-nav section-attr" @click="switchAttrPop">
        <view class="t">请选择规格数量</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>
    </view>
    <!-- <view class="section-nav section-act">
        <view class="t">
            <view class="label">1个促销:</view>
            <view class="tag">万圣趴</view>
            <view class="text">全场满499，额外送糖果</view>
        </view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>
    </view> -->
    <!-- <view class="comments" v-if="comment.count > 0">
        <view class="h">
        <navigator :url="'../comment/comment?valueId=' + goods.id + '&typeId=0'">
            <text class="t">评价({{comment.count > 999 ? '999+' : comment.count}})</text>
            <text class="i">查看全部</text>
        </navigator>
        </view>
        <view class="b">
        <view class="item">
            <view class="info">
            <view class="user">
                <img :src="comment.data.avatar"/>
                <text>{{comment.data.nickname}}</text>
            </view>
            <view class="time">{{comment.data.add_time}}</view>
            </view>
            <view class="content">
            {{comment.data.content}}
            </view>
            <view class="imgs" v-if="comment.data.pic_list.length">
            <image class="img" v-for="(item, index) of comment.data.pic_list" :key="item.id" :data-index="index" :src="item.pic_url"/>
            </view>
            <view class="spec">白色 2件</view>
        </view>
        </view>
    </view> -->
    <!-- <view class="goods-attr">
        <view class="t">商品参数</view>
        <view class="l">
        <view class="item" v-for="(item, index) of attribute" :key="item.name" :data-index="index">
            <text class="left">{{item.name}}</text>
            <text class="right">{{item.value}}</text>
        </view>
        </view>
    </view> -->
    <div>
        <wxParse :content="goodDetailHTMLstr" />
    </div>
    <!-- <view class="common-problem">
        <view class="h">
        <view class="line"></view>
        <text class="title">常见问题</text>
        </view>
        <view class="b">
        <view class="item" v-for="(item, index) of issueList" :key="item.id" :data-index="index">
            <view class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
            </view>
            <view class="answer">
            {{item.answer}}
            </view>
        </view>
        </view>
    </view> -->

    <!-- <view class="related-goods" v-if="relatedGoods.length">
        <view class="h">
        <view class="line"></view>
        <text class="title">大家都在看</text>
        </view>
        <view class="b">
        <view class="item" v-for="(item, index) of relatedGoods" :key="item.id" :data-index="index">
            <navigator :url="'/pages/goods/goods?id=' + item.id">
            <img class="img" :src="item.list_pic_url" background-size="cover"/>
            <text class="name">{{item.name}}</text>
            <text class="price">￥{{item.retail_price}}</text>
            </navigator>
        </view>
        </view>
    </view> -->
    </view>
    <view class="attr-pop-box" :hidden="!openAttr">
      <view class="attr-pop" >
          <view class="close" @click="closeAttr">
            <img class="icon" src="/static/images/icon_close.png"/>
          </view>
          <view class="img-info">
            <img class="img" :src="gallery[0].img_url"/>
            <view class="info">
              <view class="c">
                <view class="p">价格：￥{{detailInfo.Price}}</view>
                <view class="a">库存：{{Stock}}</view>
                <view class="a">已选择：<text>{{selectSkuStr.Color}} {{selectSkuStr.Size}} {{selectSkuStr.Version}} {{selectSkuStr.Material}} {{selectSkuStr.Fashion}} {{selectSkuStr.Grams}} {{selectSkuStr.Ensemble}}</text></view>
                <!-- <view class="a" v-if="productList.length">已选择：{{checkedSpecText}}</view> -->
              </view>
          </view>
          </view>
          <view class="spec-con">
          <view class="spec-item" v-if="detailInfo.Color.length != 0">
              <view class="name">选择颜色</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Color ? 'selected value' : 'value'" @click="clickSkuValue('Color' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Color" :key="index" :data-value-id="item.SkuId" :data-index="index" >{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item"  v-if="detailInfo.Size.length != 0">
              <view class="name">选择尺寸</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Size ? 'selected value' : 'value'" @click="clickSkuValue('Size' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Size" :key="item.SkuId" :data-value-id="item.SkuId" :data-index="index" :data-name-id="item.SkuId">{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item"  v-if="detailInfo.Version.length != 0">
              <view class="name">选择规格</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Version? 'selected value' : 'value'" @click="clickSkuValue('Version' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Version" :key="item.SkuId" :data-value-id="item.SkuId" :data-index="index" :data-name-id="item.SkuId">{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item"  v-if="detailInfo.Material.length != 0">
              <view class="name">选择材料</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Material ? 'selected value' : 'value'" @click="clickSkuValue('Material' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Material" :key="item.SkuId" :data-value-id="item.SkuId" :data-index="index" :data-name-id="item.SkuId">{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item"  v-if="detailInfo.Fashion.length != 0">
              <view class="name">选择款式</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Fashion ? 'selected value' : 'value'" @click="clickSkuValue('Fashion' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Fashion" :key="item.SkuId" :data-value-id="item.SkuId" :data-index="index" :data-name-id="item.SkuId">{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item"  v-if="detailInfo.Grams.length != 0">
              <view class="name">选择克重</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Grams ? 'selected value' : 'value'" @click="clickSkuValue('Grams' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Grams" :key="item.SkuId" :data-value-id="item.SkuId" :data-index="index" :data-name-id="item.SkuId">{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item"  v-if="detailInfo.Ensemble.length != 0">
              <view class="name">选择套餐</view>
              <view class="values">
              <view :class="item.SkuId == selectSku.Ensemble ? 'selected value' : 'value'" @click="clickSkuValue('Ensemble' , item.SkuId , item.Value)" v-for="(item, index) of detailInfo.Ensemble" :key="item.SkuId" :data-value-id="item.SkuId" :data-index="index" :data-name-id="item.SkuId">{{item.Value}}</view>
              </view>
          </view>
          <view class="spec-item" >
              <view class="name">点击选择物流方式</view>
              <view class="values">
                <view class="selected value" @click="selectWuliu">{{strYjtype}}<span>></span></view>
              </view>
          </view>
          <view class="number-item">
              <view class="name">数量</view>
              <view class="selnum">
              <view class="cut" @click="cutNumber">-</view>
              <input :value="number" class="number" disabled="true" type="number" />
              <view class="add" @click="addNumber">+</view>
              </view>
          </view>
          </view>
      </view>
    </view>
    <view class="bottom-btn">
    <view class="l l-collect" @click="addCannelCollect">
        <img class="icon" :src="collectBackImage"/>
    </view>
    <view class="l l-cart">
        <view class="box">
        <text class="cart-count">{{cartGoodsCount}}</text>
        <img @click="openCartPage" class="icon" src="/static/images/ic_menu_shoping_nor.png"/>
        </view>
    </view>
    <view class="c" @click="SubmitByProduct">立即购买</view>
    <view class="r" @click="addToCart">加入购物车</view>
    </view>
</div>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx';
import wxParse from 'mpvue-wxparse'
import { mapState, mapActions } from 'vuex'

export default {
  components: {
    wxParse
  },
  data () {
    return {
      detailInfo: {
        Material: [],
        Size: [],
        Version: [],
        Color: [],
        Grams: [],
        Fashion: [],
        Ensemble: []
      },
      id: 0,
      goods: {},
      gallery: [{ img_url: '' }],
      attribute: [],
      issueList: [],
      comment: [],
      brand: {},
      specificationList: [],
      productList: [],
      relatedGoods: [],
      cartGoodsCount: 0,
      userHasCollect: 0,
      number: 1,
      checkedSpecText: '请选择规格数量',
      openAttr: false,
      noCollectImage: '/static/images/icon_collect.png',
      hasCollectImage: '/static/images/icon_collect_checked.png',
      collectBackImage: '/static/images/icon_collect.png',
      goodDetailHTMLstr: '',
      skuInfo: [],
      selectSku: {
        Color: 0,
        Size: 0,
        Version: 0,
        Material: 0,
        Fashion: 0,
        Grams: 0,
        Ensemble: 0
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
      skuId: '',
      strYjtype: '请选择配送方式',
      Yjtype: 0,
      YjUse: 0,
      Stock: 0
    }
  },
  async mounted () {
    this.id = 146
    if (this.$route.query.data) {
          const data = JSON.parse(this.$route.query.data);
          wx.setNavigationBarTitle({
              title: data.ProductName
          })
          this.id = data.ProductId
      }
    this.$wx.showLoading()
    await Promise.all([
      this.getGoodsSkuInfo(),
      this.getGoodsDetail(),
      this.getGoodsDesc()
    ]);
    this.getSkuPrice()
    // 默认选中配送方式
    this.selectWuliu()

    this.$wx.hideLoading()
  },
  computed: {
    selected() {
      return {
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: this.detailInfo.BorderSelectionColor,
        color: '#b4282d'
      }
    }
  },
  methods: {
    ...mapActions(['submitByProductId']),
    // 获取商品SKu详情
    async getGoodsSkuInfo () {
      var par = {
        ProductId : this.id
      }
      const res = await api.getGetSKUInfo(par)
      if(res.success) {
        this.skuInfo = res.data
      }
    },
    async getGoodsDesc() {
      var par = {
        ProductId : this.id
      }
      const res = await api.getProductDesc(par)
      if(res.success) {
        this.goodDetailHTMLstr = res.ProductDescription
      }
    },
    async getGoodsDetail () {
      var par = {
        ProductId : this.id
      }
      const res = await api.getGoodsDetail(par)
      this.detailInfo = res.data
    },
    // 获得“相关商品推荐”信息
    async getGoodsRelated () {
      const res = await api.getGoodsRelated({ id: this.id });
      // console.log('相关商品推荐', res);
      if (res.errno === 0) {
        this.relatedGoods = res.data.goodsList;
      }
    },
    // 规格弹窗中，每个规则项的点击事件
    clickSkuValue (skuName , skuId , skuValue) {
      this.selectSku[skuName] = skuId
      this.selectSkuStr[skuName] = skuValue
      this.setSkuId()
    },
    // 获取skuId
    setSkuId() {
      var skuStr = this.id + ''
      const selectSku = this.selectSku
      for(var key in selectSku) {
        skuStr += `_${selectSku[key]}`
      }
      this.skuId = skuStr
      this.getSkuPrice()
    },
    getSkuPrice() {
      const skuId = this.skuId
      if(skuId == '') {
      // 初次进来skuId是空，需要给skuId取值和默认选项
        this.getLowPrice()
      } else {
        this.getSkuInfoPirce()
      }
    },
    // 选择skuInfo最低价,获取价格和默认选项
    getLowPrice() {
      const skuInfo = this.skuInfo
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
      this.skuId = skuInfo[0].SkuId
      this.Stock = skuInfo[0].Stock
      this.detailInfo.Price = skuInfo[0].Price * this.number
      this.getDefalutSelect()
    },
    // 选择skuInfo的价格
    getSkuInfoPirce() {
      const skuInfo = this.skuInfo
      const skuId = this.skuId
        skuInfo.map(item => {
          if(item.SkuId === skuId) {
              this.Stock = item.Stock
              this.detailInfo.Price = item.Price * this.number
            
          }
        })
    },
    // 获取默认选项
    getDefalutSelect() {
      const skuId = this.skuId
      const skuIdArr = skuId.split('_')
      this.selectSku.Color = Number(skuIdArr[1])
      this.selectSku.Size = Number(skuIdArr[2])
      this.selectSku.Version = Number(skuIdArr[3])
      this.selectSku.Material = Number(skuIdArr[4])
      this.selectSku.Fashion = Number(skuIdArr[5])
      this.selectSku.Grams = Number(skuIdArr[6])
      this.selectSku.Ensemble = Number(skuIdArr[7])
      
    },
    
    // 打开商品规格选择弹窗
    switchAttrPop () {
      if (this.openAttr === false) {
        this.openAttr = !this.openAttr;
      }
    },
    // 关闭规格弹窗
    closeAttr () {
      this.openAttr = false;
    },
    // 购物车的五角星，添加或是取消收藏
    async addCannelCollect () {
      const res = await api.CollectAddOrDelete({ typeId: 0, valueId: this.id });
      // console.log('添加或取消收藏', res);
      if (res.errno === 0) {
        if (res.data.type === 'add') {
          this.collectBackImage = this.hasCollectImage;
        } else {
          this.collectBackImage = this.noCollectImage;
        }
      } else {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: res.errmsg,
          mask: true
        });
      }
    },
    // 跳转到购物车页面
    openCartPage () {
      wx.switchTab({
        url: '/pages/cart/cart'
      });
    },
    // 立即购买
    SubmitByProduct () {
      if (this.openAttr === false) {
        // 打开规格选择弹窗
        this.openAttr = !this.openAttr;
      } else { 
        if(this.number > this.Stock) {
          this.$wx.showErrorToast('当前已选数量已超出商品库存量。') 
          return
        }
        var par = {
          skuIds: this.skuId,
          counts: this.number,
          Yjtype: this.Yjtype
          // YjUse: this.YjUse
        }
        this.submitByProductId(par)
      }
    },
    // 加入购物车，多种判断哦~
    async addToCart () {
      if (this.openAttr === false) {
        // 打开规格选择弹窗
        this.openAttr = !this.openAttr;
      } else {

      }
    },
    selectWuliu(e) {
      const _this = this;
      const detailInfo =  this.detailInfo
      var arr = []
      if(detailInfo.IsYJPeiSong && detailInfo.YjUse) {
        arr.push('印捷配送')
        arr.push('代发快递')
        arr.push('仓库自提')
      }
      if(detailInfo.YjUse && !detailInfo.IsYJPeiSong) {
        if(detailInfo.UseFreightTempalate && detailInfo.ProductId == 2101) {
          arr.push('商家直邮')
        } else {
          arr.push('代发快递')
        }
      }
      if(detailInfo.UseFreightTempalate == 1 && detailInfo.ProductId != 2101) {
          arr.push('商家直邮')
      }
      if(detailInfo.YjUse != 1 && detailInfo.UseFreightTempalate != 1) {
          arr.push('商家直邮')
      }
      // 第一次进来e是undefined
      if(e) {
        this.$wx.showActionSheet(arr).then(res => {
          _this.strYjtype = arr[res.tapIndex]
          _this.Yjtype = _this.wuliuId(_this.strYjtype)
          _this.YjUse = _this.checkYjUse(_this.Yjtype)
        })
      } else {
        _this.strYjtype = arr[0]
        _this.Yjtype = _this.wuliuId(_this.strYjtype)
        _this.YjUse = _this.checkYjUse(_this.Yjtype)
      }
    },
    wuliuId (str) {
      switch (str) {
        case '印捷配送':
            return 3
          break;
        case '代发快递':
            return 1
          break;
        case '仓库自提':
            return 2
          break;
        default://商家直邮
            return 0
          break;
      }
    },
    checkYjUse(num) {
      // 0是商家只有，0以上都是印捷
      if(num == 0) {
        return 0
      } else {
        return 1
      }
    },
    // 减少数量
    cutNumber () {
      this.number = (this.number - 1 > 1) ? this.number - 1 : 1;
    },
    // 增加数量
    addNumber () {
      this.number = this.number + 1;
    }
  },
  watch: {
    number (e , b) {
      this.getSkuInfoPirce()
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/goods/goods'
    }
  }
}
</script>

<style>
@import "../../utils/wxParse/wxParse.wxss";

.container {
  margin-bottom: 100rpx;
}

.goodsimgs {
  width: 750rpx;
  height: 750rpx;
}

.goodsimgs image {
  width: 750rpx;
  height: 750rpx;
  background-color: #eee;
}

.service-policy {
  width: 720rpx;
  height: 73rpx;
  background: #f4f4f4;
  padding: 0 31.25rpx;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

.service-policy .item {
  background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/servicePolicyRed-518d32d74b.png) 0 center no-repeat;
  background-size: 10rpx;
  padding-left: 15rpx;
  display: flex;
  align-items: center;
  font-size: 25rpx;
  color: #666;
}

.goods-info {
  width: 750rpx;
  height: 306rpx;
  overflow: hidden;
  background: #fff;
}

.goods-info .c {
  display: block;
  width: 718.75rpx;
  height: 100%;
  margin-left: 31.25rpx;
  padding: 38rpx 31.25rpx 38rpx 0;
  border-bottom: 1px solid #f4f4f4;
}

.goods-info .c text {
  display: block;
  width: 687.5rpx;
  text-align: center;
}

.goods-info .name {
  height: 41rpx;
  margin-bottom: 5.208rpx;
  font-size: 41rpx;
  line-height: 41rpx;
}

.goods-info .desc {
  height: 43rpx;
  margin-bottom: 110rpx;
  font-size: 24rpx;
  line-height: 36rpx;
  color: #999;
}

.goods-info .price {
  height: 35rpx;
  font-size: 35rpx;
  line-height: 35rpx;
  color: #b4282d;
}

.goods-info .brand {
  margin-top: 23rpx;
  min-height: 40rpx;
  text-align: center;
}

.goods-info .brand text {
  display: inline-block;
  width: auto;
  padding: 2px 30rpx 2px 10.5rpx;
  line-height: 35.5rpx;
  border: 1px solid #f48f18;
  font-size: 25rpx;
  color: #f48f18;
  border-radius: 4px;
  background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/detailTagArrow-18bee52dab.png) 95% center no-repeat;
  background-size: 10.75rpx 18.75rpx;
}

.section-nav {
  width: 750rpx;
  height: 108rpx;
  background: #fff;
  margin-bottom: 20rpx;
}

.section-nav .t {
  float: left;
  width: 600rpx;
  height: 108rpx;
  line-height: 108rpx;
  font-size: 29rpx;
  color: #333;
  margin-left: 31.25rpx;
}

.section-nav .i {
  float: right;
  width: 52rpx;
  height: 52rpx;
  margin-right: 16rpx;
  margin-top: 28rpx;
}

.section-act .t {
  float: left;
  display: flex;
  align-items: center;
  width: 600rpx;
  height: 108rpx;
  overflow: hidden;
  line-height: 108rpx;
  font-size: 29rpx;
  color: #999;
  margin-left: 31.25rpx;
}

.section-act .label {
  color: #999;
}

.section-act .tag {
  display: flex;
  align-items: center;
  padding: 0 10rpx;
  border-radius: 3px;
  height: 37rpx;
  width: auto;
  color: #f48f18;
  overflow: hidden;
  border: 1px solid #f48f18;
  font-size: 25rpx;
  margin: 0 10rpx;
}

.section-act .text {
  display: flex;
  align-items: center;
  height: 37rpx;
  width: auto;
  overflow: hidden;
  color: #f48f18;
  font-size: 29rpx;
}

.comments {
  width: 100%;
  height: auto;
  padding-left: 30rpx;
  background: #fff;
  margin: 20rpx 0;
}

.comments .h {
  height: 102.5rpx;
  line-height: 100.5rpx;
  width: 718.75rpx;
  padding-right: 16rpx;
  border-bottom: 1px solid #d9d9d9;
}

.comments .h .t {
  display: block;
  float: left;
  width: 50%;
  font-size: 38.5rpx;
  color: #333;
}

.comments .h .i {
  display: block;
  float: right;
  width: 164rpx;
  height: 100.5rpx;
  line-height: 100.5rpx;
  background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/address-right-990628faa7.png) right center no-repeat;
  background-size: 52rpx;
}

.comments .b {
  height: auto;
  width: 720rpx;
}

.comments .item {
  height: auto;
  width: 720rpx;
  overflow: hidden;
}

.comments .info {
  height: 127rpx;
  width: 100%;
  padding: 33rpx 0 27rpx 0;
}

.comments .user {
  float: left;
  width: auto;
  height: 67rpx;
  line-height: 67rpx;
  font-size: 0;
}

.comments .user image {
  float: left;
  width: 67rpx;
  height: 67rpx;
  margin-right: 17rpx;
  border-radius: 50%;
}

.comments .user text {
  display: inline-block;
  width: auto;
  height: 66rpx;
  overflow: hidden;
  font-size: 29rpx;
  line-height: 66rpx;
}

.comments .time {
  display: block;
  float: right;
  width: auto;
  height: 67rpx;
  line-height: 67rpx;
  color: #7f7f7f;
  font-size: 25rpx;
  margin-right: 30rpx;
}

.comments .content {
  width: 720rpx;
  padding-right: 30rpx;
  line-height: 45.8rpx;
  font-size: 29rpx;
  margin-bottom: 24rpx;
}

.comments .imgs {
  width: 720rpx;
  height: auto;
  margin-bottom: 25rpx;
}

.comments .imgs .img {
  height: 150rpx;
  width: 150rpx;
  margin-right: 28rpx;
}

.comments .spec {
  width: 720rpx;
  padding-right: 30rpx;
  line-height: 30rpx;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 30rpx;
}

.goods-attr {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  padding: 0 31.25rpx 25rpx 31.25rpx;
  background: #fff;
}

.goods-attr .t {
  width: 687.5rpx;
  height: 104rpx;
  line-height: 104rpx;
  font-size: 38.5rpx;
  margin-left: 10rpx;
}

.goods-attr .item {
  width: 687.5rpx;
  height: 68rpx;
  padding: 11rpx 20rpx;
  margin-bottom: 11rpx;
  background: #f7f7f7;
  font-size: 38.5rpx;
  margin-left: 10rpx;
}

.goods-attr .left {
  float: left;
  font-size: 25rpx;
  width: 134rpx;
  height: 45rpx;
  line-height: 45rpx;
  overflow: hidden;
  color: #999;
}

.goods-attr .right {
  float: left;
  font-size: 36.5rpx;
  margin-left: 20rpx;
  width: 480rpx;
  height: 45rpx;
  line-height: 45rpx;
  overflow: hidden;
  color: #333;
}

.wxParse view {
    margin-bottom: -15rpx;
}

.detail {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.detail image {
  width: 750rpx;
  display: block;
}

.common-problem {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.common-problem .h {
  position: relative;
  height: 145.5rpx;
  width: 750rpx;
  padding: 56.25rpx 0;
  background: #fff;
  text-align: center;
}

.common-problem .h .line {
  display: inline-block;
  position: absolute;
  top: 72rpx;
  left: 0;
  z-index: 2;
  height: 1px;
  margin-left: 225rpx;
  width: 300rpx;
  background: #ccc;
}

.common-problem .h .title {
  display: inline-block;
  position: absolute;
  top: 56.125rpx;
  left: 0;
  z-index: 3;
  height: 33rpx;
  margin-left: 285rpx;
  width: 180rpx;
  background: #fff;
}

.common-problem .b {
  width: 720rpx;
  height: auto;
  overflow: hidden;
  padding: 0rpx 30rpx;
  background: #fff;
}

.common-problem .item {
  height: auto;
  overflow: hidden;
  padding-bottom: 25rpx;
}

.common-problem .question-box .spot {
  float: left;
  display: block;
  height: 8rpx;
  width: 8rpx;
  background: #b4282d;
  border-radius: 50%;
  margin-top: 11rpx;
}

.common-problem .question-box .question {
  /* float: left; */
  line-height: 30rpx;
  padding-left: 20rpx;
  display: block;
  font-size: 26rpx;
  padding-bottom: 15rpx;
  color: #303030;
}

.common-problem .answer {
  line-height: 36rpx;
  padding-left: 16rpx;
  font-size: 26rpx;
  color: #787878;
}

.related-goods {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.related-goods .h {
  position: relative;
  height: 145.5rpx;
  width: 750rpx;
  padding: 56.25rpx 0;
  background: #fff;
  text-align: center;
  border-bottom: 1px solid #f4f4f4;
}

.related-goods .h .line {
  display: inline-block;
  position: absolute;
  top: 72rpx;
  left: 0;
  z-index: 2;
  height: 1px;
  margin-left: 225rpx;
  width: 300rpx;
  background: #ccc;
}

.related-goods .h .title {
  display: inline-block;
  position: absolute;
  top: 56.125rpx;
  left: 0;
  z-index: 3;
  height: 33rpx;
  margin-left: 285rpx;
  width: 200rpx;
  background: #fff;
}

.related-goods .b {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.related-goods .b .item {
  float: left;
  background: #fff;
  width: 312rpx;
  height: auto;
  overflow: hidden;
  text-align: center;
  padding: 15rpx 31.25rpx;
  border-right: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
}

.related-goods .item .img {
  width: 311.45rpx;
  height: 311.45rpx;
}

.related-goods .item .name {
  display: block;
  width: 311.45rpx;
  height: 35rpx;
  margin: 11.5rpx 0 15rpx 0;
  text-align: center;
  overflow: hidden;
  font-size: 30rpx;
  color: #333;
}

.related-goods .item .price {
  display: block;
  width: 311.45rpx;
  height: 30rpx;
  text-align: center;
  font-size: 30rpx;
  color: #b4282d;
}

.bottom-btn {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 750rpx;
  height: 100rpx;
  display: flex;
  background: #fff;
}

.bottom-btn .l {
  float: left;
  height: 100rpx;
  width: 162rpx;
  border: 1px solid #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-btn .l.l-collect {
  border-right: none;
  border-left: none;
  text-align: center;
}

.bottom-btn .l.l-cart .box {
  position: relative;
  height: 60rpx;
  width: 60rpx;
}

.bottom-btn .l.l-cart .cart-count {
  height: 28rpx;
  width: 28rpx;
  z-index: 10;
  position: absolute;
  top: 0;
  right: 0;
  background: #b4282d;
  text-align: center;
  font-size: 18rpx;
  color: #fff;
  line-height: 28rpx;
  border-radius: 50%;
}

.bottom-btn .l.l-cart .icon {
  position: absolute;
  top: 10rpx;
  left: 0;
}

.bottom-btn .l .icon {
  display: block;
  height: 44rpx;
  width: 44rpx;
}

.bottom-btn .c {
  float: left;
  height: 100rpx;
  line-height: 96rpx;
  flex: 1;
  text-align: center;
  color: #333;
  border-top: 1px solid #f4f4f4;
  border-bottom: 1px solid #f4f4f4;
}

.bottom-btn .r {
  border: 1px solid #b4282d;
  background: #b4282d;
  float: left;
  height: 100rpx;
  line-height: 96rpx;
  flex: 1;
  text-align: center;
  color: #fff;
}

.attr-pop-box {
  width: 100%;
  height: 100%;
  position: fixed;
  background: rgba(0, 0, 0, .5);
  z-index: 8;
  bottom: 0;
  /* display: none; */
}

.attr-pop {
  width: 100%;
  height: auto;
  max-height: 780rpx;
  padding: 31.25rpx;
  background: #fff;
  position: fixed;
  z-index: 9;
  bottom: 100rpx;
  overflow-y: auto;
}

.attr-pop .close {
  position: absolute;
  width: 48rpx;
  height: 48rpx;
  right: 80rpx;
  overflow: hidden;
  top: 31.25rpx;
}

.attr-pop .close .icon {
  width: 48rpx;
  height: 48rpx;
}

.attr-pop .img-info {
  width: 687.5rpx;
  /* height: 177rpx; */
  /* overflow: hidden; */
  margin-bottom: 41.5rpx;
}

.attr-pop .img {
  float: left;
  height: 177rpx;
  width: 177rpx;
  background: #f4f4f4;
  margin-right: 31.25rpx;
}

.attr-pop .info {
  float: left;
  height: 177rpx;
  width: 440rpx;
  display: flex;
  align-items: center;
}

.attr-pop .p {
  font-size: 33rpx;
  color: #333;
  height: 33rpx;
  line-height: 33rpx;
  margin-bottom: 10rpx;
}

.attr-pop .a {
  font-size: 29rpx;
  color: #333;
  height: 40rpx;
  line-height: 40rpx;
}

.spec-con {
  width: 100%;
  height: auto;
  overflow: hidden;
}

.spec-con .name {
  height: 32rpx;
  margin-bottom: 22rpx;
  font-size: 29rpx;
  color: #333;
}

.spec-con .values {
  height: auto;
  margin-bottom: 31.25rpx;
  font-size: 0;
}

.spec-con .value {
  display: inline-block;
  height: 62rpx;
  padding: 0 35rpx;
  line-height: 56rpx;
  text-align: center;
  margin-right: 25rpx;
  margin-bottom: 16.5rpx;
  border: 1px solid #333;
  font-size: 25rpx;
  color: #333;
}

.spec-con .value.disable {
  border: 1px solid #ccc;
  color: #ccc;
}

.spec-con .value.selected {
  border: 1px solid #b4282d;
  color: #b4282d;
}

.number-item .selnum {
  width: 322rpx;
  height: 71rpx;
  border: 1px solid #ccc;
  display: flex;
}

.number-item .cut {
  width: 93.75rpx;
  height: 100%;
  text-align: center;
  line-height: 65rpx;
}

.number-item .number {
  flex: 1;
  height: 100%;
  text-align: center;
  line-height: 68.75rpx;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  float: left;
}

.number-item .add {
  width: 93.75rpx;
  height: 100%;
  text-align: center;
  line-height: 65rpx;
}

.webview {
  display: none;
  width: 200rpx !important;
  height: 100rpx !important;
  overflow: hidden;
}
</style>
