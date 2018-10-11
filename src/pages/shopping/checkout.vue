<template >
<view class="container">  
    <!-- <view class="address-box">
        <view class="address-item" @click="selectAddress" v-if="address.Id > 0">
            <view class="l">
                <text class="name">{{address.ShipTo}}</text>
                <text class="default" v-if="address.IsDefault === 1">默认</text>
            </view>
            <view class="m">
                <text class="mobile">{{address.Phone}}</text>
                <text class="address">{{address.RegionFullName + address.Address}}</text>
            </view>
            <view class="r" v-if="checkOutOther.Remindtype != 3">
                <image src="/static/images/address_right.png"/>
            </view>
        </view>
      

      
    </view> -->

  <!-- <view class="address-item address-empty" @click="addAddress" v-if="checkOutInfo.Address">
            <view class="m">
               还没有收货地址，去添加
            </view>
            <view class="r">
                <image src="/static/images/address_right.png"/>
            </view>
        </view> -->
   
        <scroll-view scroll-y class="order-content">     

             <view class="address-box">
            <view class="address-item" @click="selectAddress" v-if="address.Id > 0">
                    <view class="name clear">
                        <text class="s">收货人：</text>
                        <text class="t">{{address.ShipTo}}</text>
                        <text class="phone">{{address.Phone}}</text>
                    </view>
                    <view class="address-info">
                    <view class="info-icon">
                        <img src="/static/images/location.png" background-size="cover"/>
                    </view>
                    <view class="info-txt">  
                        <text class="default" v-if="address.IsDefault === 1">默认</text>            
                        <text>{{address.Province +' '+  address.City +' '+ address.Area +' '+ address.Street +' '+ address.Address }}</text>
                    </view>
                    <view class="info-go">
                        <img src="/static/images/address_right.png"/>
                    </view>
                    </view>
                </view>

                <!-- <view class="address-item address-empty" @click="addAddress" v-if="checkOutInfo.Address">
                    <view class="m">
                    还没有收货地址，去添加
                    </view>
                    <view class="r">
                        <image src="/static/images/address_right.png"/>
                    </view>
                </view> -->
            </view>
            <view class="line">
                <img src="/static/images/icon-order-division.png"/>
            </view>

            <view class="goods-items">
                <view class="item" >
                    <view class="img">
                        <image :src="baseUrl + productImg"/>
                    </view>
                    <view class="info">
                        <view class="t">
                            <text class="name">{{checkOutInfo.products.ProductName}}</text>
                            <text class="number">x{{checkOutInfo.Count}}</text>
                        </view>
                        
                        <view class="m" v-if="ParaStr">参数:{{ParaStr}}</view>
                        <view class="m" v-if="checkOutInfo.products.Color">颜色：{{checkOutInfo.products.Color}}</view>
                        <view class="m" v-if="checkOutInfo.products.Size">尺寸：{{checkOutInfo.products.Size}}</view>
                        <view class="m" v-if="checkOutInfo.products.Version">规格：{{checkOutInfo.products.Version}}</view>
                        <view class="m" v-if="checkOutInfo.products.Material">材料：{{checkOutInfo.products.Material}}</view>
                        <view class="m" v-if="checkOutInfo.products.Fashion">款式：{{checkOutInfo.products.Fashion}}</view>
                        <view class="m" v-if="checkOutInfo.products.Grams">克重：{{checkOutInfo.products.Grams}}</view>
                        <view class="m" v-if="checkOutInfo.products.Ensemble">套餐：{{checkOutInfo.products.Ensemble}}</view>
                        <!-- <view class="b">￥{{checkOutInfo.products.SalePrice}}</view> -->
                    </view>
                </view>
            </view>

            
            <view class="order-box">
                <view class="box-top">
                    
                <view class="order-item clear"  @click="selectWuliu('Remindtype')">
                    <view class="l">
                        <text class="name">配送方式</text>
                    </view>
                    <view class="r distribution y">  
                        <text class="txt">￥{{daifaInfo.isDaifa ? daifaInfo.ExpressFreight : 0}}</text>          
                        <text class="txt">{{checkOutOther.RemindtypeStr}}</text>
                    </view>
                </view>
                
                <!-- <view class="order-item clear">
                    <view class="l">
                        <text class="name">优惠券码</text>
                    </view>
                    <view class="r distribution">            
                        <text class="txt">20元立减券</text>
                    </view>
                </view> -->
                <view class="order-item clear">
                    <view class="l">
                        <text class="name">买家留言</text>
                    </view>
                    <view class="r message">
                        <input class="txt" v-model="checkOutOther.orderRemarks" placeholder="点击给商家留言"/>
                    </view>
                </view>

                <view class="order-item clear">
                    <view class="l">
                        <text class="name">合计</text>
                    </view>
                    <view class="r price">            
                    <view class="txt" v-if="daifaInfo.isDaifa">￥ {{checkOutInfo.totalAmount + daifaInfo.ExpressFreight}}</view>
                    <view class="txt" v-if="!daifaInfo.isDaifa">￥ {{checkOutInfo.totalAmount}}</view>
                    </view>
                </view>
                </view>
                <view class="box-bottom">
                    <view class="price-total">
                        <view class="product-price clear">
                            <view class="l">商品金额</view>
                            <view class="r">￥{{checkOutInfo.totalAmount}}</view>
                        </view>
                        <view class="express-price clear">
                            <view class="l">运费</view>
                            <view class="r">+ ￥{{daifaInfo.isDaifa ? daifaInfo.ExpressFreight : 0}}</view>
                        </view>
                    </view>
                </view>

            
                <!-- 代发快递 -->
                <div class="box-content" v-if="checkOutOther.Remindtype == 1">
                    <div class="weui-cells__title">代发快递方式</div>
                    <div class="weui-cells weui-cells_after-title">
                        <!-- <div class="weui-cell weui-cell_switch">
                            <div class="weui-cell__bd">是否到付</div>
                            <div class="weui-cell__ft">
                                <switch :checked="daifaInfo.isCashOnDelivery" @change="daifaSwitch('isCashOnDelivery')"/>
                            </div>
                        </div> -->
                        <div class="weui-cell weui-cell_switch">
                            <div class="weui-cell__bd">代收货款</div>
                            <div class="weui-cell__ft">
                                <switch :checked="daifaInfo.IsDaiShouHuoKuan" @change="daifaSwitch('IsDaiShouHuoKuan')"/>
                            </div>
                        </div>
                        <div class="weui-cell weui-cell_switch" v-if="daifaInfo.IsDaiShouHuoKuan">
                            <div class="weui-cell__bd">代收货款金额</div>
                            <div class="weui-cell__ft">
                                <input class="weui-input" v-model="daifaInfo.daiShouMoney" type="number" placeholder="请输入代收货款金额" />
                            </div>
                        </div>
                        <!-- 快递公司	 -->
                        <div class="weui-cell weui-cell_select">
                            <div class="weui-cell__hd weui-cell__hd_in-select-after">
                                <div class="weui-label">快递公司</div>
                            </div>
                            <div class="weui-cell__bd">
                                <picker @change="expressCompanyChange" :range="expressCompany">
                                <div class="weui-select weui-select_in-select-after">{{expressCompany[expressCompanyIndex]}}</div>
                                </picker>
                            </div>
                        </div>
                    </div>
                </div>
        
            </view>
        </scroll-view>


    <view class="order-total" >
        <view class="t">
        <!-- 如果是代发，需要加上代发运费 -->
        <view  v-if="daifaInfo.isDaifa">合计：￥{{checkOutInfo.totalAmount + daifaInfo.ExpressFreight}}</view>
        <!-- 如果是印捷配送，直接显示价格 -->
        <view v-if="!daifaInfo.isDaifa">合计：￥{{checkOutInfo.totalAmount}}</view>
        </view>
        
        <view class="b" @click="submitOrder">确认下单</view>
    </view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import util from '@/utils/util'
import pay from '@/services/pay'
import express from '@/utils/express'
import { mapState , mapMutations} from 'vuex'

export default {
  data () {
    return {
        checkOutOther:{
            isCashOnDelivery : 0,
            orderRemarks: '',
            Remindtype: 0,
            RemindtypeStr: '',
            isDaifa: '是否代发',
            Paymenttype: '支付类型',
            daiShouMoney: '代收金额',
            CarryCompany: '快递公司id',
            SenderPeople: '备注',
            ExpressFreight: '代发快递运费',
            ExpressWeight: '代发快递重量',
            ExpressFreightLog: '代发快递参数',
            filename: '文件名',
            quoteLogModel: '报价日志id',
            strId: '临时文件名',
            IsRemind: '是否有提点费',
            IsNotNeedFile: '是否需要传文件',
            LimitTimeBuyId: '限时购id'
        },
        daifaInfo: {
            isDaifa: false,//是否代发
            IsDaiShouHuoKuan: false,//是否代收货款
            // isCashOnDelivery: false,//是否代货到付款
            daiShouMoney: 0,//代收金额
            CarryCompany: 7,//快递公司id
        },
        expressCompany : ['顺丰快递'  , '运通快递' , '优速快递'],
        expressCompanyId: [ 7 , 11 , 28],
        expressCompanyIndex: 0,
        remindInfo: {},
        calculateFreight: {},
        productImg: '',
        ParaStr: ''
    }
  },
  computed: {
        ...mapState([
            'userInfo',
            'checkOutInfo',
            'address'
        ]),
        baseUrl () {
            return this.$wx.baseUrl
        }
    },  
  async mounted () {
    // 获取印捷提点
    //将默认的地址存到全局那里
    this.ParaStr = ''
    this.set_address(this.checkOutInfo.Address)
    this.productImg = this.$wx.getImagePath(this.checkOutInfo.products.imagePath)
    await Promise.all([
        this.getYJFreightCalculate(),
        this.getCalculateFreight()
    ])
    this.selectWuliu()

    try {
        var QuoteLogModel=  JSON.parse(this.checkOutInfo.QuoteLogModel)
        this.ParaStr = QuoteLogModel[0].ParaStr
    } catch (error) {
        
    }
  },
  methods: {
    ...mapMutations(['set_address']),
    // 获取代发快递
    async getCalculateFreight() {
        var par = {
            quoteLogModelId: this.checkOutInfo.QuoteLogModel,
            UserId: this.userInfo.Id,
            CompanyId: this.daifaInfo.CarryCompany,
            fahuoCity: this.checkOutInfo.ShopAddress,
            recieveCity: this.address.RegionFullName,
            shuliang: this.checkOutInfo.Count,
            Price: this.checkOutInfo.totalAmount
        }
        this.$wx.showLoading('正在加载...')
        const res = await api.getCalculateFreight(par)
        if(res.success) {
            var data = {
                ExpressFreight : res.data.DiscountFreight,
                ExpressWeight: res.data.Weight,
                ExpressFreightLog: res.data.logId,
            }
            this.daifaInfo = Object.assign(this.daifaInfo , data)
            // this.calculateFreight = res.data
        }
        this.$wx.hideLoading()
    },
    // 获取印捷提点运费
    async getYJFreightCalculate() {
        var par = {
            UserId: this.userInfo.Id,
            UserAddress: this.address.RegionId,
            ShopId: this.checkOutInfo.products.ShopId,
            Yjtype: this.checkOutInfo.Yjtype,
            Price: this.checkOutInfo.totalAmount
        }
        const res = await api.getYJFreightCalculate(par)
        if(res.success) {
            this.remindInfo = res.data
        }
    },
    // 选择配送方式
    selectWuliu(e) {
        var _this = this;
        var checkOutInfo = this.checkOutInfo
        // 加载信息
        var info = {
            isYJPeiSong : checkOutInfo.IsPeisong,
            YjUse: checkOutInfo.YjUse,
            useFreightTempalate: checkOutInfo.UseFreightTemplate,
            productId : checkOutInfo.products.ProductId
        }
        var arr = express.selectExpress(info)
        // 初次进来默认选中第一个选项
        if(e) {
            this.$wx.showActionSheet(arr).then(res => {
                var wuliuStr = arr[res.tapIndex]
                console.log(wuliuStr)
                _this.checkOutOther.Remindtype = express.wuliuId(wuliuStr)
                console.log(_this.checkOutOther.Remindtype)
                _this.checkOutOther.RemindtypeStr = wuliuStr
                _this.getYunFeiEvent(wuliuStr)
            })
        } else {
            var wuliuStr = arr[0]
            _this.checkOutOther.Remindtype = express.wuliuId(wuliuStr)
            console.log(_this.checkOutOther.Remindtype)
            _this.checkOutOther.RemindtypeStr = wuliuStr
            _this.getYunFeiEvent(wuliuStr)
        }

    },
    // 选择运费类型会产生的事件
    getYunFeiEvent(str) {
        if(str == '代发快递'){
            this.daifaInfo.isDaifa = true
            this.getCalculateFreight()
        } else {
            this.daifaInfo.isDaifa = false
        }

        if(str == '印捷配送') {
            // 让选择印捷默认的地址
            this.set_address(this.checkOutInfo.Address)
        }
    },
    // 代发快递信息选项
    daifaSwitch(item) {
        this.daifaInfo[item] = !this.daifaInfo[item]
    },
    // 代发快递公司选择
    expressCompanyChange(e) {
        if(e) {
            this.expressCompanyIndex = e.mp.detail.value;
        } else {
            this.expressCompanyIndex = 0
        }
        this.daifaInfo.CarryCompany = this.expressCompanyId[this.expressCompanyIndex]
        this.getCalculateFreight()
    },
    // 选择收获地址
    selectAddress () {
        // 如果是印捷配送，不能修改3
        if(this.checkOutOther.Remindtype == 3) {
            return
        }
        this.$router.push({
            path: '../shopping/address'
        })
    },
    // 添加收获地址
    addAddress () {
        this.$router.push({
            path: '../shopping/addressAdd'
        })
    },
    // 点击“去付款”
    submitOrder () {
        
        let res = undefined
        const openId = wx.getStorageSync('openId')
        //   标准品提交订单
        let par = {
            openId : openId,
            Remindtype: this.checkOutOther.Remindtype,//配送类型
            skuIds : this.checkOutInfo.products.Id,
            counts: this.checkOutInfo.Count,
            userAddressId: this.address.Id,
            orderRemarks: this.checkOutOther.orderRemarks,
            quoteLogModel: this.checkOutInfo.QuoteLogModel,
            Paymenttype: 1
        }
        // 是否代发
        if(this.daifaInfo.isDaifa) {
            // 代发里面包含
            // ExpressFreight : this.calculateFreight.DiscountFreight,
            // ExpressWeight: this.calculateFreight.Weight,
            // ExpressFreightLog: this.calculateFreight.logId,
            par = Object.assign(par , this.daifaInfo )
        }
        // 非标品订单需要增加的参数
        if(this.checkOutInfo.QuoteStr && this.checkOutInfo.GroupJson) {
            let par2 = {
                QuoteStr : this.checkOutInfo.QuoteStr,
                GroupJson : this.checkOutInfo.GroupJson,
                PrintedMatterPrice: this.checkOutInfo.totalAmount
            }
            par = Object.assign(par , par2)
            // 修改报价日志id
            par.quoteLogModel = this.checkOutInfo.QuoteLogId
            par = this.$wx.formatBoolToInt(par)
            this.submitOrderByProductId2(par)
        } else {
            // 标准拼报价
            par = this.$wx.formatBoolToInt(par)
            this.submitOrderByProductId(par)
        }
    },
    async submitOrderByProductId (par) {
        this.$wx.showLoading()
        console.log(JSON.stringify(par))
        const res = await api.submitOrderByProductId(par)
        this.$wx.hideLoading()
        this.submitAfter(res)
        
    },
    async submitOrderByProductId2(par) {
        console.log(JSON.stringify(par))
        this.$wx.showLoading()
        const res = await api.submitOrderByProductId2(par)
        this.$wx.hideLoading()
        this.submitAfter(res)
    },
    submitAfter (res) {
        if(res.success) {
            // wx.redirectTo({
            // url: '../pay/payResult?status=1&orderId=' + res.data
            // });
            this.$router.replace({
                path: '../pay/payResult?status=1&isShopping=1&Id=' + res.data
            })
        } else {
            this.$wx.showErrorToast(res.msg)
        }
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/shopping/checkout'
    }
  }
}
</script>

<style scoped>
.container{
    height: 100%;
    background: #fff;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.order-content{
    margin-bottom: 200rpx;
}
.address-box{
    width: 750rpx;
    height: auto;
    padding: 0 20rpx 20rpx 20rpx;
    box-sizing: border-box;
    background-color: #fff;
}
.address-box .address-item{
    padding: 20rpx 0 20rpx 0;
}
.address-box .name{
    height: 55rpx;
    line-height: 55rpx;
}
.address-box .name .s{
    font-size: 28rpx;
    color: #000;
    margin-left: 60rpx;
}
.address-box .name .t{
    font-size: 28rpx;
    color: #000;
    margin-left: 10rpx;
}
.address-box .name .phone{
  float: right;
  font-size: 28rpx;
  color: #000;
  margin-right: 50rpx;
 
}
.address-info{
  display: -webkit-box;
  display: -webkit-flex;
  margin-top: 10rpx;
}
.address-info .info-icon{
  width: 45rpx;
  height: 50rpx;
  margin-top: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address-info .info-icon img{
  width: 35rpx;
  height: 40rpx;
  text-align: center;
}
.address-info .info-txt{
  flex: 1;
  font-size: 28rpx;
  color: #000;
  width: 550rpx;
  line-height: 40rpx;
  margin-left: 15rpx;
}
.address-info .info-go{
  width: 45rpx;
  height: 50rpx;
  margin-top: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address-info .info-go img{
  width: 35rpx;
  height: 40rpx;
  text-align: center;
}
.address-box .default{
    width: 77rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    font-size: 26rpx;
    color: #009e96;
    margin-right: 20rpx;
    background-color: #c7eae8;
    visibility: visible;
}

.line{
    width: 100%;
    height: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}
.line img{
    width: 100%;
    height: 10rpx;
}

/* .address-box{
    width: 100%;
    height: 166.55rpx;
    background: url('http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-bg-bd30f2bfeb.png') 0 0 repeat-x;
    background-size: 62.5rpx 10.5rpx;
    margin-bottom: 20rpx;
    padding-top: 10.5rpx;
}

.address-item{
    display: flex;
    height: 155.55rpx;
    background: #fff;
    padding: 41.6rpx 0 41.6rpx 31.25rpx;
} */

.address-item.address-empty{
  line-height: 75rpx;
  text-align: center;
}

.address-box .l{
    width: 125rpx;
    height: 100%;
}

.address-box .l .name{
    margin-left: 6.25rpx;
    margin-top: -7.25rpx;
    display: block;
    width: 125rpx;
    height: 43rpx;
    line-height: 43rpx;
    font-size: 30rpx;
    color: #333;
    margin-bottom: 5rpx;

}

.address-box .l .default{
    margin-left: 6.25rpx;
    display: block;
    width: 62rpx;
    height: 33rpx;
    border-radius: 5rpx;
    border: 1px solid #b4282d;
    font-size: 20.5rpx;
    text-align: center;
    line-height: 29rpx;
    color: #b4282d;
}

.address-box .m{
    flex: 1;
    height: 72.25rpx;
    color: #999;
}

.address-box .mobile{
    display: block;
    height: 29rpx;
    line-height: 29rpx;
    margin-bottom: 6.25rpx;
    font-size: 30rpx;
    color:#333;
}

.address-box .address{
    display: block;
    height: 37.5rpx;
    line-height: 37.5rpx;
    font-size: 25rpx;
    color:#666;
}

.address-box .r{
    width: 77rpx;
    height: 77rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.address-box .r image{
    width: 52.078rpx;
    height: 52.078rpx;
}

.coupon-box{
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
}

.coupon-box .coupon-item{
    width: 96%;
    height: 108.3rpx;
    overflow: hidden;
    background: #fff;
    display: flex;
    padding-left: 31.25rpx;
}

.coupon-box .l{
    flex: 1;
    height: 43rpx;
    line-height: 43rpx;
    padding-top: 35rpx;
}

.coupon-box .l .name{
    float: left;
    font-size: 30rpx;
    color: #666;
}

.coupon-box .l .txt{
    float: right;
    font-size: 30rpx;
    color: #666;
}

.coupon-box .r{
    margin-top: 15.5rpx;
    width: 77rpx;
    height: 77rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.coupon-box .r image{
    width: 52.078rpx;
    height: 52.078rpx;
}

.order-box{
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #f1f1f1;
}
.order-box .box-top,.order-box .box-bottom{
    background: #fff;
}
.order-box .order-item{
    height: 85rpx;
    line-height: 85rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
    border-bottom: 1rpx solid #f5f5f5;
}
.order-box .order-item:first-child{
    height: 100rpx;
    line-height: 100rpx;
}
.order-box .order-item:last-child{
    border-bottom: none;
}

.order-box .order-item .l{
    float: left;
    width: 25%;
    font-size: 28rpx;
    color: #000;
}

.order-box .order-item .r{
    float: right;
    text-align: right;
    width: 75%;
    padding-right: 50rpx;
    box-sizing: border-box;
    font-size: 26rpx;
    color: #666;
}
.order-box .order-item .distribution{
    background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/address-right-990628faa7.png) right center no-repeat;
    background-size: 52rpx;
}
.order-box .order-item .y{
    padding-top: 17rpx;
    padding-bottom: 17rpx;
    box-sizing: border-box;
}
.order-box .order-item .y .txt{
    display: block;
    line-height: 35rpx;
}
.order-box .order-item .message{
    text-align: left;
}
.order-box .order-item .message input{
    width: 100%;
    height: 85rpx;
    line-height: 85rpx;
    color: #a9a9a9;
    font-size: 28rpx;
}
.order-box .order-item .price{
    color: #ea291b;
    font-size: 38rpx;
    padding-right: 0;
}
.price-total{
    margin-top: 20rpx;
    background-color: #fff;
    height: 170rpx;
    width: 100%;
    padding-top: 20rpx;
    box-sizing: border-box;
}
.price-total .express-price,.price-total .product-price{
    padding: 0 20rpx;
    box-sizing: border-box;
}
.price-total .l{
    width: 25%;
    height: 60rpx;
    float: left;
    line-height: 65rpx;
    font-size: 28rpx;
    color: #666;
}
.price-total .r{
    width: 75%;
    height: 60rpx;
    float: right;
    line-height: 65rpx;
    text-align: right;
    font-size: 28rpx;
    color: #666;
}

.order-box .order-item.no-border{
    border-bottom: none;
}

.goods-items{
    width: 100%;
    height: auto;
    /* overflow: hidden; */
    background: #f1f1f1;
    padding: 25rpx 20rpx 25rpx 20rpx;
   
}

.goods-items .item{
    display: flex;
    align-items: center;
    margin-left: 20rpx;
}

.goods-items .item.no-border{
    border-bottom: none;
}


.goods-items .item:last-child{
    border-bottom: none;
}

.goods-items .img{
    height: 150rpx;
    width: 150rpx;
    background-color: #282828;
    margin-right: 20rpx;
}

.goods-items .img image{
    height: 150rpx;
    width: 150rpx;
}

.goods-items .info{
    flex: 1;
}

.goods-items .t{
    line-height: 35rpx;
    overflow: hidden;
    font-size: 28rpx;
    color: #000;
    margin-bottom: 20rpx;
}

.goods-items .t .name{
    width: 370rpx;
    display: block;
    float: left;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.goods-items .t .number{
    width: 145rpx;
    display: block;
    float: right;
    text-align: center;
}

.goods-items .m {
    overflow: hidden;
    line-height: 30rpx;
    font-size: 26rpx;
    color: #595757;
    width:500rpx;
}

.goods-items .b {
    height:  41rpx;
    overflow: hidden;
    line-height: 41rpx;
    font-size: 30rpx;
    color: #333;
}

.order-total{
    position: fixed;
    left:0;
    bottom: 0;
    height: 200rpx;
    width: 100%;
    background-color: #fff;
    padding: 20rpx;
    box-sizing: border-box;
    box-shadow: 0 -2px 0 #f5f5f5;
    z-index: 1000;
}

.order-total .t{
    flex: 1;
    height: 70rpx;
    line-height: 70rpx;
    color: #000;
    font-size: 28rpx;
    text-align: center;
}

.order-total .b{
    width: 700rpx;
    height: 85rpx;
    background: #009e96;
    line-height: 85rpx;
    text-align: center;
    color: #fff;
    font-size: 34rpx;
    margin: 0 auto;
    border-radius: 6rpx;
    box-shadow: 2rpx 3rpx 9rpx 2rpx rgba(0, 150, 158, 0.6);

}
</style>
