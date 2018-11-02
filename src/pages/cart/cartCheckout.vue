<template >
<view class="container">  
        <view class="order-content" v-if="goodList.length != 0">     
            <view class="address-box">
                <view class="address-item" @click="selectAddress" v-if="address">
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
                    <view class="info-go" v-if="checkOutOther.Remindtype != 3">
                        <img src="/static/images/address_right.png"/>
                    </view>
                    </view>
                </view>
                <view class="address-item address-empty" @click="addAddress" v-if="!address">
                    <view class="m">
                    还没有收货地址，去添加
                    </view>
                </view>
            </view>
            <view class="line">
                <img src="/static/images/icon-order-division.png"/>
            </view>
            <scroll-view scroll-y :style="{'height': '100%'}">
                <view class="card" v-for="(item , index) of goodList" :key="index">
                    <view class="goods-items">
                        <view class="item" >
                            <view class="img">
                                <image :src="baseUrl + item.imagePath + '/1_350.png'"/>
                            </view>
                            <view class="info">
                                <view class="t">
                                    <text class="name" v-if="item.ProductName">{{item.ProductName}}</text>
                                    <text class="number">x{{item.IsCustom ? item.ShuLiang : item.Count}}</text>
                                </view>
                                
                                <view class="m" v-if="item.paraStr">参数:{{item.paraStr}}</view>
                                <view class="m" v-if="item.Color">颜色：{{item.Color}}</view>
                                <view class="m" v-if="item.Size">尺寸：{{item.Size}}</view>
                                <view class="m" v-if="item.Version">规格：{{item.Version}}</view>
                                <view class="m" v-if="item.Material">材料：{{item.Material}}</view>
                                <view class="m" v-if="item.Fashion">款式：{{item.Fashion}}</view>
                                <view class="m" v-if="item.Grams">克重：{{item.Grams}}</view>
                                <view class="m" v-if="item.Ensemble">套餐：{{item.Ensemble}}</view>
                                <!-- <view class="b">￥{{checkOutInfo.products.SalePrice}}</view> -->
                            </view>
                        </view>
                    </view>
                    <view class="order-box" >
                        <view class="box-top">
                            
                        <view class="order-item clear"  @click="selectWuliu(index)">
                            <view class="l">
                                <text class="name">配送方式</text>
                            </view>
                            <view class="r distribution y">  
                                <text class="txt">￥{{item.isDaifa ? item.ExpressFreight : 0}}</text>          
                                <text class="txt">{{item.RemindtypeStr}}</text>
                            </view>
                        </view>
                        <!-- 代发快递 -->
                        <div class="box-content" v-if="item.Remindtype == 1">
                            <!-- <div class="weui-cells__title">代发快递方式</div> -->
                            <div class="weui-cells weui-cells_after-title" >
                                <div class="weui-cell weui-cell_switch"  v-if="item.CarryCompanyId != 7">
                                    <div class="weui-cell__bd">代收货款</div>
                                    <div class="weui-cell__ft">
                                        <switch :checked="item.IsDaiShouHuoKuan" @change="daifaSwitch(index)"/>
                                    </div>
                                </div>
                                <div class="weui-cell weui-cell_switch" v-if="item.IsDaiShouHuoKuan">
                                    <div class="weui-cell__bd">代收货款金额</div>
                                    <div class="weui-cell__ft">
                                        <input class="weui-input" v-model.lazy="item.daiShouMoney" type="number" placeholder="请输入代收货款金额" />
                                    </div>
                                </div>
                                <!-- 快递公司	 -->
                                <div class="weui-cell weui-cell_select">
                                    <div class="weui-cell__hd weui-cell__hd_in-select-after">
                                        <div class="weui-label">快递公司</div>
                                    </div>
                                    <div class="weui-cell__bd">
                                        <picker @change="expressCompanyChange" :id="index" :range="expressCompany">
                                        <div class="weui-select weui-select_in-select-after">{{item.CarryCompany}}</div>
                                        </picker>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <view class="order-item clear">
                            <view class="l">
                                <text class="name">买家留言</text>
                            </view>
                            <view class="r message">
                                <input class="txt" v-model.lazy="item.orderRemarks" placeholder="点击给商家留言"/>
                            </view>
                        </view>
                        <view class="box-bottom">
                            <view class="price-total">
                                <view class="product-price clear">
                                    <view class="l">商品金额</view>
                                    <view class="r">￥{{item.totalAmount + item.RemindPrice}}</view>
                                </view>
                                <view class="express-price clear">
                                    <view class="l">运费</view>
                                    <view class="r">+ ￥{{item.isDaifa ? item.ExpressFreight : 0}}</view>
                                </view>
                            </view>
                        </view>
                        <view class="order-item clear">
                            <view class="l">
                                <text class="name">合计</text>
                            </view>
                            <view class="r price">            
                                <view class="txt" v-if="item.isDaifa">￥ {{item.totalAmount + item.RemindPrice + item.ExpressFreight}}</view>
                                <view class="txt" v-if="!item.isDaifa">￥ {{item.totalAmount + item.RemindPrice}}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="line">
                        <img src="/static/images/icon-order-division.png"/>
                    </view>
                </view>
            </scroll-view>
        </view>


    <view class="order-total">
        <view class="t">
        <!-- 如果是代发，需要加上代发运费 -->
        <view >合计：￥{{totalAmount }}</view>
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
            orderRemarks: '',
            Remindtype: 0,
            RemindtypeStr: '',
            expressCompanyIndex: 0
        },
        daifaInfo: {
            isDaifa: false,//是否代发
            IsDaiShouHuoKuan: false,//是否代收货款
            // isCashOnDelivery: false,//是否代货到付款
            daiShouMoney: 0,//代收金额
            CarryCompany: '优速快递',//快递公司名字
            CarryCompanyId: 28,
            ExpressFreight: 0,
            ExpressWeight: 0,
            ExpressFreightLog: 0

        },
        // 运费提点
        remindInfo : {
            RemindPrice: 0,
            RemindLogId: 0,
            ReMind: 0
        },
        expressCompany : [ '优速快递'  , '运通快递' ,'顺丰快递' , '韵达快递'],
        expressCompanyId: [ 28 , 11 , 7 , 34],
        goodList: []
    }
  },
  computed: {
        ...mapState([
            'userInfo',
            'cartCheckOutInfo',
            'address'
        ]),
        baseUrl () {
            return this.$wx.baseUrl
        },
        totalAmount () {
            let sum = 0
            this.goodList.map(item => {
                // 如果有印捷提点，加上提点的费用，否者直接用返回的商品价格
                sum = item.IsRemind ? util.addNum(util.addNum(sum , item.totalAmount) , item.RemindPrice) : util.addNum(sum , item.totalAmount)
                if(item.isDaifa) {
                    // 如果有代发，加上代发的费用
                    sum = util.addNum(sum , item.ExpressFreight)
                }
            })
            return sum.toFixed(2)
        }
    },      
  async mounted () {
    const data = this.cartCheckOutInfo
    this.set_address(data.Address)
    var _this = this;
    // 遍历购物车信息，加入默认的参数
    data.ProductInfo.map(item => {
        // 加入默认的代发快递信息
        item = Object.assign(item , this.daifaInfo)
        // 加入默认的表单信息
        item = Object.assign(item , this.checkOutOther)
        // 加入默认的提点信息
        item= Object.assign(item , this.remindInfo)
        //如果非标报价，需要加上非标报价的信息，做展示使用
        if(item.RecordModel != '') {
            const RecordModel = JSON.parse(item.RecordModel)
            item.paraStr = ''
            RecordModel.map(iitem => {
                item.paraStr +=  iitem.paraStr + ','
            })
            item.paraStr = util.delLastStr(item.paraStr , ',')
        }
        // 加入到数组里，渲染到页面上
        this.goodList.push(item)
    })
    // 遍历，获取默认的信息
    this.goodList.map((item, index) => {
        _this.init(index)
    })
  },
  methods: {
    ...mapMutations(['set_address']),
    // 首次进来
    async init(index) {
        // 获取默认的配送方式
        this.selectWuliu(index , true)
    },
    // 获取代发快递
    async getCalculateFreight(index) {
        const item = this.goodList[index]
        if(item.isDaifa) {
            var par = {
                quoteLogModelId: this.goodList[index].QuoteLogModel,//报价id
                UserId: this.userInfo.Id,//用户Id
                CompanyId: this.goodList[index].CarryCompanyId,//物流公司id
                fahuoCity: this.goodList[index].ShopAddress,//商店地址
                recieveCity: this.address.RegionFullName,//地址全称
                shuliang: this.goodList[index].IsCustom ? this.goodList[index].ShuLiang : this.goodList[index].Count,//产品数量
                Price: this.goodList[index].totalAmount,//商品价格
                CategoryPath: this.goodList[index].CategoryPath,//分类路径
                skuId: this.goodList[index].Id
            }
            this.$wx.showLoading('正在加载...')
            const res = await api.getCalculateFreight(par)
            this.goodList[index].ExpressFreight = res.data.DiscountFreight
            this.goodList[index].ExpressWeight = res.data.Weight
            this.goodList[index].ExpressFreightLog = res.data.logId
            this.renderUI()
            this.$wx.hideLoading()
        }

    },
    // 获取印捷提点运费
    async getYJFreightCalculate(index) {
        let item = this.goodList[index]
        if(item.IsRemind && item.Remindtype != 0) {
            var par = {
                UserId: this.userInfo.Id,//用户Id
                UserAddress: this.address.RegionFullName,//地址全称
                ShopId: item.ShopId,//商店地址
                Yjtype: item.Remindtype,//配送类型
                Price: item.totalAmount//商品价格
            }
            this.$wx.showLoading()
            const res = await api.getYJFreightCalculate(par)
            if(res.success) {
                this.goodList[index].ReMind = res.data.ReMind
                this.goodList[index].RemindLogId = res.data.RemindLogId
                this.goodList[index].RemindPrice = res.data.RemindPrice
                this.renderUI()
            }
            this.$wx.hideLoading()
        }
        
    },
    // 选择配送方式
    selectWuliu(index , init) {
        var _this = this;
        let item = this.goodList[index]
        const openId = wx.getStorageSync('openId')
        // 加载信息
        var info = {
            isYJPeiSong : item.IsPeisong,//是否印捷配送
            YjUse: item.YjUse,//是否使用印捷配送
            useFreightTempalate: item.UseFreightTemplate,//运费模板
            productId : item.ProductId,
            openId: openId
        }
        // 根据上面的信息，得到可以选择的配送类型
        var arr = express.selectExpress(info)
        // 初次进来默认选中第一个选项
        if(init) {
            var wuliuStr = arr[0]
            // 配送类型id
            item.Remindtype = express.wuliuId(wuliuStr)
            // 配送配型字符串
            item.RemindtypeStr = wuliuStr
            _this.goodList[index] = item
            // 选择运费类型会产生的事件
            _this.getYunFeiEvent(index, wuliuStr)
        } else {
            this.$wx.showActionSheet(arr).then(res => {
                var wuliuStr = arr[res.tapIndex]
                // 配送类型id
                item.Remindtype = express.wuliuId(wuliuStr)
                // 配送配型字符串
                item.RemindtypeStr = wuliuStr
                _this.goodList[index] = item
                // 选择运费类型会产生的事件
                _this.getYunFeiEvent(index, wuliuStr)
            })
        }
        

    },
    // 选择运费类型会产生的事件
    getYunFeiEvent(index , str) {
        if(str == '代发快递'){
            // 如果是代发快递，获取代发快递的价格
            this.goodList[index].isDaifa = true
            this.getCalculateFreight(index)
        } else {
            this.goodList[index].isDaifa = false
            this.renderUI()
        }
        if(str == '印捷配送') {
            // 让选择印捷默认的地址，讲默认的地址传到vuex里面
            this.set_address(this.cartCheckOutInfo.Address)
            this.renderUI()
        }

        // 配送类型变了，根据当前的配送类型获取印捷提点
        this.getYJFreightCalculate(index)
    },
    // 代发快递信息选项
    daifaSwitch(index) {
        this.goodList[index].IsDaiShouHuoKuan = !this.goodList[index].IsDaiShouHuoKuan
        this.renderUI()
    },
    // 代发快递公司选择
    expressCompanyChange(e) {
        const expressCompanyIndex = e.mp.detail.value
        const index = Number(e.mp.target.id)
        this.goodList[index].CarryCompany = this.expressCompany[expressCompanyIndex]
        this.goodList[index].CarryCompanyId = this.expressCompanyId[expressCompanyIndex]
        // 如果是顺丰快递，没有代收货款
        if(this.goodList[index].CarryCompanyId == 7) {
            this.isShunFeng(index)
        }
        this.getCalculateFreight(index)
    },
    isShunFeng (index) {
        this.goodList[index].IsDaiShouHuoKuan = false
        this.goodList[index].daiShouMoney = 0
    },
    // 选择收获地址
    selectAddress () {
        var isYj = false
        this.goodList.map(item => {
            if(item.Remindtype == 3) {
                isYj = true
            }
        })
        // 如果是印捷配送，不能修改3
        if(isYj) {
            this.$wx.showModal({
                content: '有一项产品选择了印捷配送，不能更改地址。'
            })
            return
        }
        this.$router.push({
            path: '../../shoppingPages/address'
        })
    },
    // 添加收获地址
    addAddress () {
        this.$router.push({
            path: '../../shoppingPages/address'
        })
    },
    // 点击“去付款”
    async submitOrder () {
        const openId = wx.getStorageSync('openId')
        const productInfo = []
        let goodList = util.deepCopy(this.goodList)
        goodList.map(item => {
            delete item.QuoteLogModel
            productInfo.push(item)
        })
        const productInfoStr =  JSON.stringify(productInfo)
        var par = {
            openId: openId,
            userAddressId : this.address.Id,
            productInfo : productInfoStr
        }
        this.$wx.showLoading('正在提交订单')
        const res = await api.submitOrderByShoppingCart2(par)
        this.$wx.hideLoading()
        this.submitAfter(res , productInfoStr)
    },
    // 提交按钮的下一步事件
    submitAfter (res , productInfoStr) {
        if(res.success) {
            this.$router.replace({
                path: '../pay/pay',
                query: {
                    productInfo: this.totalAmount,
                    id: res.data
                }
            })
        } else {
            this.$wx.showErrorToast(res.msg)
        }
    },
    // 因为小程序的模板引擎问题，需要对列表重新赋值才能显示
    renderUI () {
        const template = this.goodList
        this.goodList = []
        this.goodList = template
    }
  },
  watch: {
    //   如果地址变了,需要重新获取运费和提点
    address () {
        const _this = this;
        this.goodList.map((item , index) => {
            _this.getCalculateFreight(index)
            _this.getYJFreightCalculate(index)
        })
    }  
  },
  // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh()
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
    border-bottom: 2rpx solid #f5f5f5;
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
    color: #000;
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
    box-shadow:2rpx 2rpx 6rpx 6rpx #e8e8e8;
    z-index: 1000;
}

.order-total .t{
    flex: 1;
    height: 70rpx;
    line-height: 55rpx;
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
    box-shadow:  2px 2px 8px rgba(0, 150, 158, 0.6);

}
.line-bg {
    height: 20rpx;
    width: 750rpx;
    background:#666;
}
</style>
