<template>
    <div class="container">
        <div class="sort">
            <div class="sort-box">
                <div :class=" currentSortType == 'default' ? 'active item' : 'item'"  @click="openSortFilter" id="defaultSort">
                    <text class="txt">综合</text>
                </div>
                <div :class="['item', 'by-sales by-sort', { active: currentSortType == 'sales', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
                    @click="openSortFilter" id="salesSort">
                    <text class="txt">销量</text>
                </div>
                <div :class="['item', 'by-price by-sort', { active: currentSortType == 'price', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
                    @click="openSortFilter" id="priceSort">
                    <text class="txt">价格</text>
                </div>
                <div :class="['item', 'by-comment by-sort', { active: currentSortType == 'comment', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
                    @click="openSortFilter" id="commentSort">
                    <text class="txt">评论</text>
                </div>
            </div>
        </div>
        <div class="list-content">
            <div class="list-item" v-for="(item , index) in quoteList" :key="index" @click="toDetail(item)">
                <div class="list-item-box">
                    <img class="list-img" :src="baseUrl + '/Storage/Shop/'+ item.ShopId +'/Products/' + item.ProductId + '/1_350.png'" alt="" >
                    <div class="list-info">
                        <div class="list-info-content">
                            <div class="title" >
                                {{item.ShopName}}
                            </div>
                            <div class="p price" >
                                ￥{{item.Price}}
                            </div>
                            
                            <div class="bottom" >
                                <div class="bottom-left p">{{item.SaleCounts}}销量 {{item.ProductMark}}好评</div>
                                <div class="bottom-right p">货期{{item.DeliveryTime}}</div>
                            </div>
                            <div class="btn-group">
                                <!-- <kiyButton  text="去下单" @onClick="toCheckOut(item)"></kiyButton> -->
                                <!-- <kiyButton :solid="true" text="加入购物车" @onClick="toCart(item)"></kiyButton> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form @submit="formSubmit" report-submit="true">
            <button class="form_button add-address" formType="submit">重新报价</button>
        </form>
    </div>
</template>

<script>
import kiyButton from '@/components/kiyButton'
import wx from 'wx'
import { mapState , mapActions } from 'vuex';
import util from '@/utils/util'
import api from '@/utils/api'

export default {
    components: {
        kiyButton
    },
    data () {
        return {
            quoteList: [],
            currentSortType: 'default',
            currentSortOrder: 'desc',
            orderKey: '默认',
            queryData : undefined
        }
    },
    computed: {
        ...mapState(['proSearchRst' , 'userInfo' , 'proSearchParam']),
        baseUrl() {
            return this.$wx.baseUrl
        }
    },
    mounted () {
        if(this.$route.query.data){
            this.queryData = JSON.parse(this.$route.query.data)
            this.toBaojiaPage(true)
        }
        // this.quoteList = JSON.parse(this.proSearchRst.data)
    },
    methods: {
        ...mapActions(['SubmitByProductId2']),
        // 去报价页
        toBaojiaPage(isFirst) {
            // isFirst如果是刚进来，是不会把默认参数带过去
            const item = this.queryData
            if(item.IsPriceDisplayPage != 0 && item.ProductId != 0){
                this.$wx.toBaoJia(
                    { 
                        pid: item.Code, 
                        title: item.qName, 
                        isDetail: true, 
                        ProductId: item.ProductId
                    }, 
                    this
                )
            } else {
                this.$wx.toBaoJia(
                    { 
                        pid: item.Code, 
                        title: item.qName,
                        data: isFirst ? '' :this.proSearchParam.dataStr
                    } , 
                    this
                )
            }
        },
        // 去商品页面
        toDetail(item) {
            const queryData = this.queryData
            const goodsUrl = util.getGoodsUrl({
                ProductId: item.ProductId,
                ProductName: queryData.qName,
                code: queryData.Code,
                IsCustom: true, 
                dataStr: item.QuoteStr,
            })
            this.$router.push(goodsUrl)
        },
        // toCheckOut(item) {
        //     const openId = wx.getStorageSync('openId')
        //     var par = {
        //         openId: openId,
        //         skuIds: item.ProductId + '_0_0_0_0_0_0_0',
        //         counts: 1,
        //         regionId: this.userInfo.RegionId,
        //         YjUse: item.YjUse,
        //         price: item.Price,
        //         quoteModel: item.QuoteLogInfoId,
        //         RemindPrice: item.RemindPrice,
        //         GroupJson: item.GroupJson,
        //         QuoteStr: item.QuoteStr,
        //         LimitTimeBuyId: item.LimitTimeBuyId,
        //     }
        //     this.SubmitByProductId2(par)
        // },
        // async toCart(item) {
        //     const openId = wx.getStorageSync('openId')
        //     var par = {
        //         openId: openId,
        //         productId: item.ProductId,
        //         isCustom: true,//非标品
        //         skuId: item.ProductId + '_0_0_0_0_0_0_0',
        //         quantity: 1,
        //         dataStr: item.QuoteStr,
        //         quoteJson : item.GroupJson,
        //         Price: item.Price,
        //         paraStr: item.QuoteStr
        //         // Yjtype: this.Yjtype
        //         // YjUse: this.YjUse
        //     }
            
        //     this.$wx.showLoading()
        //     const res = await api.modifyShoppingCart(par)
        //     this.$wx.hideLoading()
        //     if(res.success) {
        //         this.$wx.showSuccessToast('加入购物车成功')
        //     } else {
        //         this.$wx.showErrorToast('加入购物车失败')
        //     }
        // },
        openSortFilter (event) {
            // this.goodsList = []
            let currentId = event.currentTarget.id;
            switch (currentId) {        
                case 'salesSort':
                let tmpSortOrderSales = 'asc';
                if (this.currentSortOrder === 'asc') {
                    tmpSortOrderSales = 'desc';
                }
                this.currentSortType = 'sales';
                this.currentSortOrder = tmpSortOrderSales;
                this.orderKey = '销量'
                this.refresh();
                break;

                case 'priceSort':
                let tmpSortOrderPrice = 'asc';
                if (this.currentSortOrder === 'asc') {
                    tmpSortOrderPrice = 'desc';
                }
                this.currentSortType = 'price';
                this.currentSortOrder = tmpSortOrderPrice;
                this.orderKey = '价格'
                this.refresh();
                break;

                case 'commentSort':
                let tmpSortOrderComment = 'asc';
                if (this.currentSortOrder === 'asc') {
                    tmpSortOrderComment = 'desc';
                }
                this.currentSortType = 'comment';
                this.currentSortOrder = tmpSortOrderComment;
                this.orderKey = '评价'
                this.refresh();
                break;

                default:
                // 综合排序
                this.currentSortType = 'default';
                this.currentSortOrder = 'desc';
                this.orderKey = '默认'
                this.refresh();
            } 
        },
        async refresh () { 
            if(!this.proSearchParam.qitemCode || this.proSearchParam.isDetail) return
            const openId = wx.getStorageSync('openId')
            var par = Object.assign({
                'openId': openId , 'orderByType' : this.orderKey , 'orderByKey': this.currentSortOrder == 'desc' ? 0 : 1
            }, this.proSearchParam)
            this.quoteList = []
            this.$wx.showLoading('正在比价...')
            const res = await api.getProSearchRst(par)
            if(res.success) {
                this.quoteList = JSON.parse(res.data.data)
            } else {
                this.$wx.showErrorToast('网络出错')
            }
            this.$wx.hideLoading()
        },
        async formSubmit(e) {
            this.toBaojiaPage()
            const formId = e.mp.detail.formId
            const hideOpenId = wx.getStorageSync('hideOpenId')
            if(formId === 'the formId is a mock one' || !hideOpenId) return
            await api.saaSSaveFormId({
                form_id: formId,
                strOpenId: hideOpenId
            })
        }
    },
    watch: {
        proSearchParam () {
            this.refresh()
        }
    },
    // 小程序原生下拉刷新
    onPullDownRefresh: function() {
        this.refresh()
        wx.stopPullDownRefresh()
    }
}
</script>
<style scoped>
page{
  min-height: 100%;
  background-color: #f4f4f4;
}
.list-content {
    margin-bottom: 104rpx;
    padding-top: 78rpx;
}
.sort{
    position: fixed;
    top: 0;
    left: 0;
    background: #fff;
    width: 100%;
    height: 78rpx;
}

.sort-box{
    background: #fff;
    width: 690rpx;
    height: 78rpx;
    overflow: hidden;
    padding: 0 30rpx;
    display: flex;
    border-bottom: 1px solid #d9d9d9;
}

.sort-box .item{
    height: 78rpx;
    line-height: 78rpx;
    text-align: center;
    flex:1;
    color: #333;
    font-size: 30rpx;
}

.sort-box .item .txt{
    display: block;
    width: 100%;
    height: 100%;
    color: #333;
}

.sort-box .item.active .txt{
    color: #009e96;
} 

.sort-box .item.by-price , .sort-box .item.by-sales , .sort-box .item.by-comment{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/icon-none.png) 135rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.asc , .sort-box .item.by-sales.active.asc , .sort-box .item.by-comment.active.asc{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/icon-asc.png) 135rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.desc , .sort-box .item.by-sales.active.desc , .sort-box .item.by-comment.active.desc{
    background: url(http://www.kiy.cn/Areas/wxMobile/Content/img/icon-desc.png) 135rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box-category{
    background: #fff;
    width: 100%;
    height: auto;
    overflow: hidden;
    padding: 40rpx 40rpx 0 0;
    border-bottom: 1px solid #d9d9d9;
}

.sort-box-category .item{
    height: 54rpx;
    line-height: 54rpx;
    text-align: center;
    float: left;
    padding: 0 16rpx;
    margin: 0 0 40rpx 40rpx;
    border: 1px solid #666;
    color: #333;
    font-size: 24rpx;
}

.sort-box-category .item.active{
    color: #b4282d;
    border: 1px solid #b4282d;
}
.container{
  min-height: 100%;
  /* background-color: #f4f4f4; */
}
.list-item {
    width: 750rpx;
    height: 255rpx;
    background: #fff;
    border-bottom: 1px solid #f4f4f4;
}
.list-item-box {
    width: 686rpx;
    height: 255rpx;
    margin: 0 auto;
    padding-top: 40rpx;
}
.list-img {
    /* margin-top: 40rpx; */
  float: left;
  height: 177rpx;
  width: 177rpx;
  background: #eee;
  margin-right: 31.25rpx;
}
.list-info {
    /* margin-top: 40rpx; */
  float: left;
  height: 177rpx;
  width: 472rpx;
  align-items: center;
}
.title {
  font-size: 24rpx;
  font-weight: 700;
  color: #000000;
  height: 33rpx;
  line-height: 33rpx;
  margin-bottom: 10rpx;
}
.p {
  font-size: 29rpx;
  color: #666;
  height: 40rpx;
  line-height: 40rpx;
}
.price {
    color: red;
    font-size: 28rpx;
}
.bottom {
    margin-top: 55rpx;
    height: 60rpx;
    color: #949494;
}
.bottom-left {
    float: left;
    font-size: 22rpx;
}
.bottom-right {
    float: right;
    font-size: 22rpx;
}
.btn-group {
    display:flex;
    flex-direction: row-reverse;
}
.add-address{
  height: 104rpx;
  width: 100%;
  border-radius: none;
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: center;
  line-height: 104rpx;
  background-color: #009e96;
  color: #fff;
  font-size: 30rpx;
}
</style>

