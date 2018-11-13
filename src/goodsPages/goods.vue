<template >
<div>
    <!-- 主体容器 -->
    <div class="container" v-if="!loading">
      <!-- 头部导航 -->
      <!-- <div class="goodshead">
        <div class="head-classify">
          <div class="classify-item produ" @click="toNav" data-id="goodshead">
            <img v-if="toView == 'goodshead'" src="/static/images/posi.png"/>
            商品
          </div>
          <div class="classify-item com" @click="toNav" data-id="comments">
            <img v-if="toView == 'comments'" src="/static/images/posi.png"/>
            评论
          </div>
          <div class="classify-item detail"  @click="toNav" data-id="proDetail">
            <img v-if="toView == 'proDetail'" src="/static/images/posi.png"/>
            详情
          </div>
        </div>
      </div> -->

      <scroll-view :scroll-into-view="toView" scroll-y="true" scroll-with-animation="true" class="container-scroll">
        <div class="outside" id="goodshead">
          <!-- 图片轮播 -->
          <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
              <swiper-item v-for="(item, index) of gallery" :key="item.id" :data-index="index">
                <img :src="baseUrl + item" background-size="cover" mode="aspectFit" @error="imgError(item)" @click="previewImage(item)"/>
              </swiper-item>
          </swiper>
          <!-- 商品信息 -->
          <div class="goods-info">
              <div class="c clear">
                <!-- 标准品价格 -->
                <div class="c-price" v-if="!detailInfo.IsCustom"><text class="price-icon" >￥</text>{{detailInfo.Price}}</div>
                <!-- 非标品价格 -->
                <div class="c-price"  v-else><text class="price-icon" >￥</text>{{ListPriceInfo.sprice + detailInfo.RemindPrice}} <text class="original-price" v-if="ListPriceInfo.sprice != ListPriceInfo.OriginalPrice">{{ListPriceInfo.OriginalPrice}}</text></div>
                <div :class="collectStatus ? 'c-collect collected' : 'c-collect'"  @click="addCannelCollect">           
                </div>
              </div>
              <div class="con-text">
                <div class="desc">{{detailInfo.ProductName}}</div>
                <div class="notes">{{detailInfo.ShortDescription}}</div>
              </div>       
          </div>
          <!-- 已选参数 -->
          <div class="section-nav section-attr" @click="switchAttrPop">
            <div class="t">
              <!-- 非标品参数 -->
              <div class="td-content" v-if="detailInfo.IsCustom">
                <text class="td"  ><text v-for="(item , index) in ListPriceInfo.paraArr" :key="index">{{item.paraStr}}</text></text>
              </div>
              <!-- 标准品参数 -->
              <div class="td-content" v-if="!detailInfo.IsCustom">
                <text class="td">规格:{{selectSkuStr.Color}} {{selectSkuStr.Size}} {{selectSkuStr.Version}} {{selectSkuStr.Material}} {{selectSkuStr.Fashion}} {{selectSkuStr.Grams}} {{selectSkuStr.Ensemble}}</text>
              </div>
            </div>
            <img class="i" src="/static/images/address_right.png" background-size="cover"/>
            <div class="clear"></div>
          </div>
          <!-- 商家地址 -->
          <div class="address-nav address-attr clear">
              <div class="t">{{detailInfo.ShopName}} : <text class="td">{{detailInfo.ShopAddress}}</text></div>
              <!-- <img class="i" src="/static/images/address_right.png" background-size="cover"/> -->
              <div class="clear"></div>
          </div>
          <!-- 商品评论 -->
          <div class="comments" id="comments" >
            <div class="h clear">
              <navigator :url="'../commentPages/comment?valueId=' + id + '&typeId=0'">
                  <text class="t">评价</text>
                  <text class="i">查看全部评价</text>
                  <!-- <div class="clear"></div> -->
              </navigator>
            </div>
            <div class="b"  v-if="comment.Id">
              <div class="item">
                <div class="info clear"> 
                  <div class="user">
                      <img :src="defalutHead" />
                      <text>{{comment.UserName}}</text>
                  </div>
                  <div class="star">{{comment.star}}</div>
                </div>
                <div class="content">
                  {{comment.ReviewContent}}
                </div>
              </div>
              <navigator :url="'../commentPages/comment?valueId=' + id + '&typeId=0'" class="seeall">查看全部评价</navigator>
            </div>   
            <div class="b" v-else>
              <div class="seeall">暂无评价</div>
            </div>
          </div> 
          <!-- 产品描述 -->
          <div class="proDetail" id="proDetail">
            <div class="title">商品详情</div>
            <div class="content">
              <wxParse :imageProp="parseUrl" :content="goodDetailHTMLstr"/>
            </div>
          </div>  
        </div> 
      </scroll-view>
    </div>
    <!-- 模态浮层 -->
    <div class="attr-pop-box" v-if="openAttr"  @click="closeAttr" catchtouchmove="stopPageScroll">
        <div class="attr-pop"  v-if="openAttr" @click.stop="closeAttr('no')">
          <selectComponent
            v-if="openAttr"
            :baseUrl="baseUrl"
            :detailInfo="detailInfo"
            :ListPriceInfo="ListPriceInfo"
            :selectSkuStr="selectSkuStr"
            :selectSku="selectSku"
            :strYjtype="strYjtype"
            :SubmitByProductType="SubmitByProductType"
            :number="number"
            :Stock="Stock"
            btnText="立即购买"
            @closeAttr="closeAttr"
            @toBaojia="toBaojia"
            @clickSkuValue="clickSkuValue"
            @addNumber="addNumber"
            @cutNumber="cutNumber"
            @addToCart="addToCart"
            @SubmitByProduct="SubmitByProduct"
            @selectWuliu="selectWuliu"
            @numberChange="numberChange"
          >
          </selectComponent>
       </div>
    </div>
    <!-- tabbar -->
    <div class="bottom-btn" v-if="!loading">
      <div class="l l-collect" @click="toChat" hover-class>
          <img class="icon" src="/static/images/share.png"/>
      </div>
      <div class="l l-cart" @click="openCartPage" hover-class>
          <div class="box">
          <text class="cart-count">{{shoppingCartCount}}</text>
          <img  class="icon" src="/static/images/shopping-car.png"/>
          </div>
      </div>
      <div class="c" @click="addToCart" hover-class>加入购物车</div>
      <div class="r" @click="SubmitByProduct" hover-class>立即购买</div>
    </div>
    <loadingComponent v-if="loading"></loadingComponent>
</div>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx';
import wxParse from 'mpvue-wxparse'
import express from '@/utils/express'
import util from '@/utils/util'
import loadingComponent from '@/components/loadingComponent'
import selectComponent from '@/components/selectComponent'
import { mapState, mapActions ,mapMutations } from 'vuex'


export default {
  components: {
    wxParse,
    loadingComponent,
    selectComponent
  },
  data () {
    return {
      navId: '',
      toView: 'goodshead',
      RequestUrl: '',
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
      Ids: '',
      gallery: [],
      number: 1,
      saleNumber: 0,
      checkedSpecText: '请选择规格数量',
      openAttr: false,
      goodDetailHTMLstr: '',
      collectStatus:false,
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
      skuPrice: 0,
      strYjtype: '请选择配送方式',
      Yjtype: 0,
      YjUse: 0, 
      Stock: 0,
      SubmitByProductType: false,
      comment: {},
      code: 0,
      ListPriceInfo: {
        sprice : 1,
        paraArr: []
      },
      openQuotSuccess: false,
      defalutHead: 'http://www.kiy.cn/Areas/wxMobile/Content/img/detailpage/'+ Math.floor(Math.random() * 7 + 1) +'.png',
      loading: true,
      OriginalPrice: 0,
      allCount: 0
    }
  },
  mounted () {
    if (this.$route.query.data) {
      const data = JSON.parse(this.$route.query.data);
      if(data.ProductName) {
        this.setTitle(data.ProductName)
      }
      this.id = data.ProductId
      // 非标报价id , 标准品为0
      this.code = data.code ? data.code : 0
      if(this.$route.query.proSearchParam) {
        var param = {
          dataStr: util.decode(this.$route.query.proSearchParam)
        }
        this.setProSearchParam(param)
      }
    }
    this.refresh()
  },
  computed: {
    baseUrl () {
      return this.$wx.baseUrl
    },
    parseUrl () {
      var obj = {
        mode: 'aspectFit',
        domain: this.$wx.baseUrl,
        lazyLoad: true,
        padding: 1
      }
      return obj
    },
    ...mapState([
      'proSearchParam',
      'userInfo',
      'shoppingCartCount'
    ])
  },
  // onReady() {
  //   this.loading = true
  // },
  // onUnload() {
  //   this.loading = true
  // },
  // onLoad () {
  //   this.loading = true
  // },
  methods: {
    ...mapMutations(['setProSearchParam']),
    ...mapActions(['submitByProductId' , 'SubmitByProductId2' , 'getShoppingCartCount']),
    async refresh() {
      // 已经来获取数据
      await Promise.all([
        this.getGoodsSkuInfo(),
        this.getGoodsDetail(),
        
      ]);
      // 把部分API请求提取出来，加快页面的输出速度，减少Loading的时间
      this.getGoodsDesc()
      this.getComment()
      this.IsCollection()
      this.getShoppingCartCount()

      this.setTitle(this.detailInfo.ProductName)
      // 默认选中配送方式，必须在报价之前选中默认的报价
      this.selectWuliu()
      // this.detailInfo.IsCustom = true
      // true等于非标

      if(this.detailInfo.IsCustom) {
        // 获取非标报价的价格
        await Promise.all([
          this.getOpenQuote()
        ])
      } else {
        // 标准品默认选中
        // 选中默认选项
        this.getSkuPrice()
      }
      
      
      // this.toView = 'goodshead'
      this.loading = false
    },
    // 获取非标的价格
    async getOpenQuote () {
      const _this = this;
      const openId = wx.getStorageSync('openId')
      let par = {
        qid: this.code, //报价qid
        FId: this.detailInfo.ShopMapId, //商家店铺fid
        data: this.proSearchParam.dataStr, //参数字符串
        dataStr: '',
        openId: openId,
        productId: this.id,//商品id
        RemindType: this.Yjtype //配送类型
      }
      this.$wx.showLoading( openId ? '正在报价...' : '登录后价格更优')
      const res = await api.getOpenQuote(par)
      this.$wx.hideLoading()
      this.openQuotSuccess = res.success
      if(res.success) {
        const Data = JSON.parse(res.Data)
        const ListPriceInfo  = Data.ListPriceInfo[0]
        this.ListPriceInfo.sprice = res.SumPrice
        this.ListPriceInfo.paraArr = ListPriceInfo.logJson
        this.ListPriceInfo.OriginalPrice = res.OriginalPrice
        this.ListPriceInfo.Data = ListPriceInfo
        this.ListPriceInfo.res = res
      } else {
        this.ListPriceInfo.sprice = 0
        this.ListPriceInfo.paraArr = []
      }
      // 获取运费提点
      this.getYJFreightCalculate()
    },
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
    // 获取商品描述
    async getGoodsDesc() {
      var par = {
        ProductId : this.id
      }
      const res = await api.getProductDesc(par)
      if(res.success) {
        this.goodDetailHTMLstr = res.ProductDescription
      }
    },
    // 获取商品详情
    async getGoodsDetail () {
      const openId = wx.getStorageSync('openId')
      var par = {
        ProductId : this.id,
      }
      if(openId) {
        par = Object.assign(par ,{openId : openId})
      }
      const res = await api.getGoodsDetail(par)
      if(res.success){
        this.RequestUrl = res.RequestUrl
        this.detailInfo = res.data
        this.gallery = util.getImagePathGroup(this.detailInfo.imagePath)
        // // 最低销售量
        // this.number = Number(this.detailInfo.SaleNumber)
      } else {
        this.$wx.showErrorToast(res.msg)
      }

    },
    // 获取评论
    async getComment () {
      const res = await api.getCommentList({ ProductId: this.id , pageNo: 1 , pageSize: 1})
      if(res.comments.length != 0) {
        this.comment = res.comments[0]
        var star = ''
        for (let index = 0; index < this.comment.ReviewMark; index++) {
          star += '☆'
        }
        this.comment.star = star
        this.comment.UserName = this.comment.UserName.substr(0, 7) + '****'
      }
    },
    // 获取印捷提点
    // 获取印捷提点运费
    async getYJFreightCalculate() {
        if(this.detailInfo.IsRemind) {
          let item = this.detailInfo
          var par = {
              UserId: this.userInfo.Id,
              UserAddress: item.ShippingAddress,
              ShopId: item.ShopId,
              Yjtype: this.Yjtype,
              Price: this.detailInfo.IsCustom ? this.ListPriceInfo.sprice : this.detailInfo.Price
          }
          const res = await api.getYJFreightCalculate(par)
          if(res.success) {
              this.detailInfo.RemindPrice = res.data.RemindPrice
              this.detailInfo.ReMind = res.data.ReMind
              this.detailInfo.RemindLogId = res.data.RemindLogId
          }
        } else {
          this.detailInfo.RemindPrice = 0
        }
        
    },
    // 获得 评论数量
    async getCommentCount () {
      this.ProductId = this.$route.query.valueId      
      const res = await api.getCommentCount({ ProductId: this.ProductId });
      if (res.success === true) {
        this.allCount = res.Comments;
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
      console.log(selectSku)
      for(var key in selectSku) {
        skuStr += `_${selectSku[key]}`
      }
      // this.skuId = skuStr
      // this.getSkuPrice()
      const skuInfo = this.skuInfo
      // 1031性能调优
      let skuItem = {}
      skuInfo.map(item => {
        if(item.SkuId == skuStr) {
          skuItem = item
        }
      })
      this.setSkuInfo(skuItem)
    },
    // 获取sku的价格
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
      const _this = this;
      if(this.$route.query.skuId) {
        this.getRouteSku()
        return
      } else {
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
      }
      this.setSkuInfo(skuInfo[0])
    },
    // 根据路由信息进来
    getRouteSku () {
      const skuInfo = this.skuInfo
      let skuItem = {}
      skuInfo.map(item => {
        if(item.SkuId == this.$route.query.skuId) {
          skuItem = item
        }
      })
      this.setSkuInfo(skuItem)
    },
    // 设置skuid , SaleNumber , number , detailInfo.Price
    setSkuInfo (skuItem) {
      this.skuId = skuItem.SkuId
      this.Stock = skuItem.Stock
      // 默认数量和最低销售数量
      this.number = skuItem.SaleNumber != 0 ? skuItem.SaleNumber : 1
      this.saleNumber = skuItem.SaleNumber != 0 ? skuItem.SaleNumber : 1
      // 1031性能调优
      this.skuPrice = skuItem.Price 
      this.detailInfo.Price = util.accMul(skuItem.Price , this.number)
      this.getDefalutSelect()
    },
    // 选择skuInfo的价格
    getSkuInfoPirce() {
      const skuInfo = this.skuInfo
      const skuId = this.skuId
      // 将数量转为纯数字
      if(typeof this.number != 'number') {
        this.number = Number(this.number)
      }
      // 1031性能优化
      if(this.number < this.saleNumber) {
        this.number = this.saleNumber
      }
      this.detailInfo.Price = util.accMul(this.skuPrice , this.number)
    },
    // 获取默认选项
    getDefalutSelect() {
      const skuId = this.skuId
      const skuIdArr = skuId.split('_')
      const selectSkuStr = this.selectSkuStr
      const detailInfo = this.detailInfo
      this.selectSku.Color = Number(skuIdArr[1])
      this.selectSku.Size = Number(skuIdArr[2])
      this.selectSku.Version = Number(skuIdArr[3])
      this.selectSku.Material = Number(skuIdArr[4])
      this.selectSku.Fashion = Number(skuIdArr[5])
      this.selectSku.Grams = Number(skuIdArr[6])
      this.selectSku.Ensemble = Number(skuIdArr[7])
      //文字
      for(var key in selectSkuStr) {
        if(detailInfo[key].length != 0) {
          detailInfo[key].map(item => {
            if(item.SkuId === this.selectSku[key]) {
              this.selectSkuStr[key] = item.Value
            }
          })
        }
      }
    },
    
    // 打开商品规格选择弹窗
    switchAttrPop () {
        if (this.openAttr === false) {
          this.SubmitByProductType = false
          this.openAttr = !this.openAttr;
        }
    },
    toBaojia() {
      const par = {
        pid: this.code,
        title: this.detailInfo.ProductName,
        isDetail : true,
        fid: this.detailInfo.ShopMapId,
        detailCommon: true,
        data: this.proSearchParam.dataStr
      }
      this.openAttr = false;
      this.$wx.toBaoJia(par , this)
    },
    // 关闭规格弹窗
    closeAttr (e) {
      if(e != 'no') {
        this.openAttr = false;
      }
    },
    // 购物车的五角星，添加或是取消收藏
    async addCannelCollect () {
      if (this.collectStatus) {//取消收藏
            const openId = wx.getStorageSync('openId')
            const res2 = await api.CancelConcernProducts({ Ids: this.Ids ,ProductIds : this.id,  openId: openId })
            if (res2.success) {
              this.collectStatus = false;
            this.$wx.showSuccessToast('取消成功')
          } else {        
            this.$wx.showErrorToast('取消失败')
          }                                
        } else {//添加收藏          
          const openId = wx.getStorageSync('openId')
          const res1 = await api.AddFavoriteProduct({ ProductId: this.id , openId: openId }) 
          if (res1.success) {
            this.collectStatus = true;                 
            this.$wx.showSuccessToast('收藏成功')
          }else {        
            this.$wx.showErrorToast('请先登录')
          }             
      } 
    },
   // 判断商品是否已收藏
     async IsCollection () {
         const openId = wx.getStorageSync('openId')
         const res = await api.IsCollection({ ProductId: this.id , openId: openId }) 
         let data = JSON.parse(res.data)   
         this.collectStatus = data;
    },
    stopPageScroll(){
    return
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
        this.SubmitByProductType = true
        this.openAttr = !this.openAttr;
      } else {
          if(this.detailInfo.IsCustom) {
            this.buyOpenGood()
          } else {
            this.buyGood()
          }
       }


    },
    // 非标品立即购买
    buyOpenGood() {
      try {
        const openId = wx.getStorageSync('openId')
        var par = {
            openId: openId,
            skuIds: this.detailInfo.ProductId + '_0_0_0_0_0_0_0',
            counts: 1,
            regionId: this.userInfo.RegionId,
            // YjUse: this.YjUse,//是否印捷配送
            Yjtype: this.Yjtype,
            price: this.ListPriceInfo.res.SumPrice,
            quoteModel: this.ListPriceInfo.res.QuoteLogInfoId,
            RemindPrice: this.detailInfo.RemindPrice,
            GroupJson: JSON.stringify(this.ListPriceInfo.Data.GroupJson),
            QuoteStr: this.proSearchParam.dataStr,
            LimitTimeBuyId: this.ListPriceInfo.res.LimitTimeBuyId
        }
        this.openAttr = false
        this.SubmitByProductId2(par)
      } catch (error) {
        this.$wx.showErrorToast('非标品下单失败')
      }
        
    },
    // 标准品立即购买
    buyGood () {
   
      if(this.checkStock()) return
      var par = {
        skuIds: this.skuId,
        counts: this.number,
        Yjtype: this.Yjtype
        // YjUse: this.YjUse
      }
      this.openAttr = false
      this.submitByProductId(par)
      
    },
    // 加入购物车，多种判断哦~
    async addToCart () {
      if (this.openAttr === false) {
        // 打开规格选择弹窗
        this.SubmitByProductType = false
        this.openAttr = !this.openAttr;
      } else {
        
        const openId = wx.getStorageSync('openId') 
        var par = {
          openId: openId,
          productId: this.id,
          isCustom: this.detailInfo.IsCustom,//标准品
          skuId: this.skuId,
          quantity: this.number,
          Yjtype: this.Yjtype
          // YjUse: this.YjUse
        }
        
        if(this.detailInfo.IsCustom) {
          // 如果是定制品
          // 重定义非标品的skuId和数量
          par.skuId = this.detailInfo.ProductId + '_0_0_0_0_0_0_0'
          par.quantity = 1
          let paraArr = ''
          this.ListPriceInfo.paraArr.map(item => {
            paraArr += item.paraStr + ','
          })
          par = Object.assign(par , 
            { 
              dataStr : this.proSearchParam.dataStr , 
              quoteJson: JSON.stringify(this.ListPriceInfo.Data.GroupJson) , 
              paraStr : util.delLastStr(paraArr , ','),
              Price: util.addNum(this.ListPriceInfo.sprice , this.detailInfo.RemindPrice)
            }
          )
        } else {
          // 标准品检查库存
          if(this.checkStock()) return
        }
        this.$wx.showLoading()
        const res = await api.modifyShoppingCart(par)
        this.$wx.hideLoading()
        if(res.success) {
          this.getShoppingCartCount()
          this.$wx.showSuccessToast('加入购物车成功')
        } else {
          this.$wx.showErrorToast('加入购物车失败')
        }
      }
    },
    // 选择物流
    selectWuliu(e) {
      const _this = this;
      const detailInfo =  this.detailInfo
      const openId = wx.getStorageSync('openId')
      // 加载信息
      var info = {
        isYJPeiSong : detailInfo.IsYJPeiSong,
        YjUse: detailInfo.YjUse,
        useFreightTempalate: detailInfo.UseFreightTempalate,
        productId : detailInfo.ProductId,
        openId: openId
      }
      // 根据上面的信息，返回文字数组
      var arr = express.selectExpress(info)

      // 第一次进来e是undefined
      if(e) {
        this.$wx.showActionSheet(arr).then(res => {
          _this.strYjtype = arr[res.tapIndex]
          _this.Yjtype = express.wuliuId(_this.strYjtype)
          _this.YjUse = express.checkYjUse(_this.Yjtype)
          // 获取提点
          _this.getYJFreightCalculate()
        })
      } else {
        _this.strYjtype = arr[0]
        _this.Yjtype = express.wuliuId(_this.strYjtype)
        _this.YjUse = express.checkYjUse(_this.Yjtype)
        _this.getYJFreightCalculate()
      }
    },
    // 检查库存
    checkStock() {
      let check = false
      if(this.number > this.Stock) {
        this.$wx.showErrorToast('超出库存') 
        check = true
      }
      return check
    },
    // 减少数量
    cutNumber () {
      this.number = this.number - 1 
      this.getSkuInfoPirce()
    },
    // 增加数量
    addNumber () {
      this.number = this.number + 1;
      this.getSkuInfoPirce()
    },
    // 数量变化
    numberChange (number) {
      this.number = number != '' ? Number(number) : this.number
      this.getSkuInfoPirce()
    },
    // 滚动到某位置
    toNav: function(e) {
      this.toView = e.currentTarget.dataset.id
      const query = wx.createSelectorQuery()
      query.select('#' + this.toView).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 300
        })
      })
    },
    setTitle (text) {
        wx.setNavigationBarTitle({
            title: text
        })
    },
    imgError (e) {
      const arr = []
      this.gallery.map(item => {
        if(item != e) {
          arr.push(item)
        }
      })
      this.gallery = arr
    },
    callPhone() {
      this.$wx.makePhoneCall(this.detailInfo.CompanyPhone)
    },
    previewImage (url) {
      var urls = []
      this.gallery.map(item => {
        urls.push(this.baseUrl + item)
      })
      this.$wx.previewImage({
        current: this.baseUrl + url,
        urls: urls
      })
    },
    async toChat() {
      this.$wx.showLoading('正在加载客服')
      const res = await api.getCustomerService({ShopId: this.detailInfo.ShopId})
      this.$wx.hideLoading()
      if(!res.success) {
        this.$wx.showErrorToast(res.msg)
        return
      }
      const selectSkuStr = this.selectSkuStr
      let price = 0
      let str = ''
      if(this.detailInfo.IsCustom) {
        price = this.ListPriceInfo.sprice + this.detailInfo.RemindPrice
        this.ListPriceInfo.paraArr.map(item => {
          str += `${item.paraStr} +`
        })
      } else {
        price = this.skuPrice
        for (const key in selectSkuStr) {
          if(selectSkuStr[key] != '') {
            str += `${selectSkuStr[key]} +`
          }
        }
      }
      const data = {
          productId: this.detailInfo.ProductId,
          productName : this.detailInfo.ProductName,
          isCustom: this.detailInfo.IsCustom,
          price: price,
          number: this.number,
          shopName: this.detailInfo.ShopName,
          skuName: util.delLastStr(str , '+'),
          imgUrl: this.baseUrl + this.gallery[0]
        }
      console.log(JSON.stringify(data))
      this.$router.push({
        path: '../wxchat/customerChat',
        query: {
          data: JSON.stringify(data),
          customer: res.data
        }
      })
    }
  },
  watch: {
    // number (e , b) {
    //   this.getSkuInfoPirce()
    // },
    proSearchParam (a , b ) {
      if(this.detailInfo.IsCustom) {
        this.getOpenQuote()
      }
    }
  }, 
  onPullDownRefresh: function() {
    // this.refresh()
    wx.stopPullDownRefresh()
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    const goodsUrl = util.getGoodsUrl({
      ProductId: this.detailInfo.ProductId,
      ProductName: this.detailInfo.ProductName,
      code: this.code != 0 ? this.code : undefined,
      IsCustom: this.detailInfo.IsCustom , 
      dataStr: this.proSearchParam.dataStr,
      skuId: this.skuId
    })
    console.log(goodsUrl)
    return {
      title: this.detailInfo.ProductName,
      desc: this.detailInfo.ShopName,
      path: goodsUrl,
      imageUrl: this.baseUrl + this.gallery[0]
    }
  }
}
</script>

<style>

page{
  height: 100%;
} 
.container-scroll{
  height: 100%;
}
.scroll{
  height: 100%;
  overflow: hidden;
}
 .scroll-lock{
  height: 100%;
  overflow-y: auto;
} 

.container {
  background-color: #f1f1f1;
  margin-bottom: 100rpx;
  overflow: hidden;
}
.clear:after{
  display: block;
  content:'';
  clear: both;
  height:0;
}
.goodshead{
  width: 750rpx;
  height: 65rpx;
  background-color: white;
  position: fixed;
  z-index: 10;
  left:0;

}
.head-classify{
  width: 428rpx;
  height: 65rpx;
  margin: 0 auto;
  display: -webkit-box;
  display: -webkit-flex;
}
.classify-item{
  flex: 1;
  text-align: center;
  line-height: 65rpx;
  color: #282828;
  font-size: 32rpx;
}
.classify-item:first-child{
  margin-left: 0;
}
.classify-item img{
  width: 20rpx;
  height: 25rpx;
  text-align: left;
  line-height: 65rpx;
}
.head-share{
  width: 44rpx;
  height: 44rpx;
  position: absolute;
  right: 47rpx;
  top: 8rpx;
  display: flex;
  align-items:center;
  justify-content: space-around;
}
.head-share img{
   width: 44rpx;
   height: 44rpx;
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
  background: #fff;
  border: 1rpx solid transparent;
}

.goods-info .c {
  margin-top: 30rpx;
  padding:0  30rpx;
  height: 50rpx;
  line-height: 50rpx;
}
.goods-info .c-price{ 
  color: #dc2121;
  font-size: 42rpx;
  float: left;
}
.c-price .price-icon{
  font-size: 34rpx;
}
.goods-info .c-collect{
    float: right;
    margin-top: 3rpx;
    width: 44rpx;
    height: 44rpx;
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/collect.png) no-repeat;
    background-size: 44rpx;
}

.goods-info .collected{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/collect-color.png) no-repeat;
    background-size: 44rpx;
}
.goods-info .con-text{
  padding:10rpx 50rpx 0 30rpx;
  padding-bottom: 30rpx;
}
.con-text .desc{
  color: #282828;
  font-size: 32rpx;
}
.con-text .notes{
  margin-top: 15rpx;
  color: #828282;
  font-size: 22rpx;
}
.section-nav {
  width: 750rpx;
  height: 100rpx;
  background: #fff;
  margin-top: 30rpx;
}

.section-nav .t {
  float: left;
  width: 600rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  color: #555555;
  margin-left: 31.25rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.section-nav .t .td{
  width: 600rpx;
  color: #282828;
  /* padding-left: 25rpx; */
  height: 100rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
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
  height: 100rpx;
  overflow: hidden;
  line-height: 100rpx;
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
.address-nav {
  width: 750rpx;
  height: 108rpx;
  background: #fff;
  margin-top: 30rpx;
}

.address-nav .t {
  float: left;
  width: 700rpx;
  height: 100rpx;
  line-height: 100rpx;
  font-size: 28rpx;
  color: #555555;
  margin-left: 31.25rpx;
  overflow: hidden;
}
.address-nav .t .td{
  color: #282828;
  padding-left: 25rpx;
  box-sizing: border-box
  
}

.address-nav .i {
  float: right;
  width: 52rpx;
  height: 52rpx;
  margin-right: 16rpx;
  margin-top: 28rpx;
}

.comments  {
  width: 750rpx;
  padding: 0 30rpx 30rpx 30rpx;
  box-sizing: border-box;
  background-color: white;
  margin-top: 30rpx;
}

.comments .h {
  width: 750rpx;
  height: 100rpx;
  line-height: 100rpx;
  background-color: white;
  padding: 0 30rpx 0 0;
  box-sizing: border-box;
  border-bottom: 1rpx solid #f1f1f1;
}

.comments .h .t {
  display: block;
  float: left;
  width: 50%;
  font-size: 28rpx;
  color: #555555;
}

.comments .h .i {
  display: block;
  float: right;
  font-size: 22rpx;
  text-align: right;
  padding-right: 70rpx;
  color: #c5c5c5;
  background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/address-right-990628faa7.png) 86% center no-repeat;
  background-size: 52rpx;
}
.comments .info {
  padding: 30rpx;
  box-sizing: border-box;
}

.comments .user {
  float: left;
  width: auto;
  height: 70rpx;
  line-height: 70rpx;
}

.comments .user image {
  float: left;
  width: 70rpx;
  height: 70rpx;
  text-align: center;
  margin-right: 17rpx;
  border-radius: 50%;
}

.comments .user text {
  display: inline-block;
  width: auto;
  font-size:24rpx;
  color: #555555;
}

.comments .star {
  display: block;
  float: right;
  width: auto;
  line-height: 70rpx;
  font-size: 38rpx;
  color: #ffb93b;
  padding-right: 30rpx;
  box-sizing: border-box;
}

.comments .content {
  line-height: 50rpx;
  font-size: 34rpx;
  color: #555555;
  padding: 15rpx 30rpx;
  box-sizing: border-box;
  text-align: center;
}
.comments .seeall{
  font-size: 28rpx;
  color: #555555;
  text-align: center;
  margin-top: 30rpx;
}
.proDetail{
  margin-top: 30rpx;
  background-color: white;
  width: 750rpx;
  padding: 0 0 120rpx 0;
  box-sizing: border-box;
  overflow: hidden;
}
.proDetail .title{
  height: 75rpx;
  line-height: 75rpx;
  text-align: center;
  font-size: 28rpx;
  color: #555555;
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
  /* display: block; */
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
  z-index: 5;
  width: 750rpx;
  height: 100rpx;
  display: flex;
  background: #fff;
}

.bottom-btn .l {
  float: left;
  height: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-btn .l.l-collect {
  width: 100rpx;
  border-right: 3rpx solid #f1f1f1;;
  text-align: center;
}
.bottom-btn .l.l-cart {
  width: 130rpx;
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
  font-size: 28rpx;
  color: #fff;
  line-height: 28rpx;
  border-radius: 50%;
  padding: 4rpx;
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
  line-height: 100rpx;
  flex: 1;
  text-align: center;
  background-color: #e3fffe;
  color: #009e96;
  font-size: 28rpx;
}

.bottom-btn .r {
  background: #009e96;
  float: left;
  height: 100rpx;
  line-height: 100rpx;
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
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
  padding: 31.25rpx 31.25rpx;
  background: #fff;
  position: fixed;
  z-index: 9;
  bottom: 100rpx;
}

.original-price {
  text-decoration: line-through;
    color: #999;
}
.td-content {
  height: 100rpx;
}
</style>
