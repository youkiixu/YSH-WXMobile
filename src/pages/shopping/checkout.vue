<template >
<view class="container">
    <view class="address-box">
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
        <!-- <view class="address-item address-empty" @click="addAddress" v-if="checkOutInfo.Address">
            <view class="m">
               还没有收货地址，去添加
            </view>
            <view class="r">
                <image src="/static/images/address_right.png"/>
            </view>
        </view> -->
    </view>


    <view class="order-box">
        <view class="order-item">
            <view class="l">
                <text class="name">备注</text>
            </view>
            <view class="r">
                <input class="txt" v-model="checkOutOther.orderRemarks"/>
            </view>
        </view>
        <view class="order-item"  @click="selectWuliu('Remindtype')">
            <view class="l">
                <text class="name">配送方式</text>
            </view>
            <view class="r">
                <text class="txt">{{checkOutOther.RemindtypeStr}}</text>
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

    <view class="goods-items">
        <view class="item" >
            <view class="img">
                <image :src="checkOutInfo.products.imagePath"/>
            </view>
            <view class="info">
                <view class="t">
                    <text class="name">{{checkOutInfo.products.ProductName}}</text>
                    <text class="number">x{{checkOutInfo.Count}}</text>
                </view>
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

    <view class="order-total" >
        <!-- 如果是代发，需要加上代发运费 -->
        <view class="l" v-if="daifaInfo.isDaifa">实付：￥{{checkOutInfo.totalAmount + daifaInfo.DiscountFreight}}</view>
        <!-- 如果是印捷配送，直接显示价格 -->
        <view class="l" v-if="!daifaInfo.isDaifa">实付：￥{{checkOutInfo.totalAmount}}</view>
        <view class="r" @click="submitOrder">去下单</view>
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
        calculateFreight: {}
    }
  },
  computed: {
        ...mapState([
            'userInfo',
            'checkOutInfo',
            'address'
        ])
    },  
  async mounted () {
    // 获取印捷提点
    //将默认的地址存到全局那里
    this.set_address(this.checkOutInfo.Address)

    await Promise.all([
        this.getYJFreightCalculate(),
        this.getCalculateFreight()
    ])
    this.selectWuliu()
  },
  methods: {
    ...mapMutations(['set_address']),
    // 获取印捷运费
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
            this.daifaInfo = Object.assign(this.daifaInfo , res.data)
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
                _this.checkOutOther.Remindtype = express.wuliuId(wuliuStr)
                _this.checkOutOther.RemindtypeStr = wuliuStr
                _this.getYunFeiEvent(wuliuStr)
            })
        } else {
            var wuliuStr = arr[0]
            _this.checkOutOther.Remindtype = express.wuliuId(wuliuStr)
            _this.checkOutOther.RemindtypeStr = wuliuStr
            _this.getYunFeiEvent(wuliuStr)
        }

    },
    // 选择运费类型会产生的事件
    getYunFeiEvent(str) {
        if(str == '代发快递'){
            this.daifaInfo.isDaifa = true
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
      wx.navigateTo({
        url: '../shopping/address'
      })
    },
    // 添加收获地址
    addAddress () {
      wx.navigateTo({
        url: '../shopping/addressAdd'
      })
    },
    // 点击“去付款”
    submitOrder () {
        
        let res = undefined
        const openId = wx.getStorageSync('openId')
        //   标准品提交订单
        let par = {
            openId : openId,
            Remindtype: this.checkOutInfo.Remindtype,
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
                GroupJson : this.checkOutInfo.GroupJson 
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
            wx.redirectTo({
            url: '../pay/payResult?status=1&orderId=' + res.data
            });
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
page{
    height: 100%;
    background: #f4f4f4;
}

.address-box{
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
}

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
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
}

.order-box .order-item{
    height: 66rpx;
    overflow: hidden;
    background: #fff;
    display: flex;
    margin-left: 31.25rpx;
    padding-right: 31.25rpx;
    padding-top: 26rpx;
    border-bottom: 1px solid #d9d9d9;
}

.order-box .order-item .l{
    float: left;
    height: 52rpx;
    width: 50%;
    line-height: 52rpx;
    overflow: hidden;
}

.order-box .order-item .r{
    float: right;
    text-align: right;
    width: 50%;
    height: 52rpx;
    line-height: 52rpx;
    overflow: hidden;
}

.order-box .order-item.no-border{
    border-bottom: none;
}

.goods-items{
    margin-top: 20rpx;
    width: 100%;
    height: auto;
    /* overflow: hidden; */
    background: #fff;
    padding-left: 31.25rpx;
    margin-bottom: 120rpx;
}

.goods-items .item{
    /* height: 192rpx; */
    padding-right: 31.25rpx;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.15);
}

.goods-items .item.no-border{
    border-bottom: none;
}


.goods-items .item:last-child{
    border-bottom: none;
}

.goods-items .img{
    height: 145.83rpx;
    width: 145.83rpx;
    background-color: #f4f4f4;
    margin-right: 20rpx;
}

.goods-items .img image{
    height: 145.83rpx;
    width: 145.83rpx;
}

.goods-items .info{
    flex: 1;
    /* height: 145.83rpx; */
    padding-top: 5rpx;
}

.goods-items .t{
    height:  33rpx;
    line-height: 33rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
    font-size: 30rpx;
    color: #333;
}

.goods-items .t .name{
    display: block;
    float: left;
}

.goods-items .t .number{
    display: block;
    float: right;
    text-align: right;
    margin-right: 30rpx;
}

.goods-items .m {
    height:  29rpx;
    overflow: hidden;
    line-height: 29rpx;
    margin-bottom: 25rpx;
    font-size: 25rpx;
    color: #666;
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
    height: 100rpx;
    width: 100%;
    display: flex;
}

.order-total .l{
    flex: 1;
    height: 100rpx;
    line-height: 100rpx;
    color: #b4282d;
    background: #fff;
    font-size: 33rpx;
    padding-left: 31.25rpx;
    border-top: 1rpx solid rgba(0,0,0,0.2);
    border-bottom: 1rpx solid rgba(0,0,0,0.2);
}

.order-total .r{
    width: 233rpx;
    height: 100rpx;
    background: #b4282d;
    border: 1px solid #b4282d;
    line-height: 100rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
}
</style>
