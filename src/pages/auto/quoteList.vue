<template>
    <view class="container">
        <view class="sort">
            <view class="sort-box">
            <view :class=" currentSortType == 'default' ? 'active item' : 'item'"  @click="openSortFilter" id="defaultSort">
                <text class="txt">综合</text>
            </view>
            <view :class="['item', 'by-price', { active: currentSortType == 'price', asc: currentSortOrder == 'asc', desc: currentSortOrder !== 'asc' }]"
                @click="openSortFilter" id="priceSort">
                <text class="txt">价格</text>
            </view>
            <view :class=" currentSortType == 'category' ? 'active item' : 'item'" @click="openSortFilter" id="categoryFilter">
                <text class="txt">分类</text>
            </view>
            </view>
            <view class="sort-box-category" v-if="categoryFilter">
            <view :class="item.checked ? 'active item' : 'item'" v-for="(item, index) of filterCategory" :key="cate-item.id" :data-category-index="index" @click="selectCategory">{{item.name}}</view>
            </view>
        </view>
        <div class="list-content">
            <div class="list-item" v-for="(item , index) in quoteList" :key="index" @click="toDetail(item)">
                <div class="list-item-box">
                    <img class="list-img" :src="item.ImagePath" alt="">
                    <div class="list-info">
                        <div class="list-info-content">
                            <div class="title">
                                {{item.ShopName}}
                            </div>
                            <div class="p price">
                                ￥{{item.Price}}
                            </div>
                            <div class="bottom">
                                <div class="bottom-left p">{{item.SaleCounts}}销量 {{item.ProductMark}}好评</div>
                                <div class="bottom-right p">货期{{item.DeliveryTime}}天</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </view>
</template>

<script>
import { mapState , mapActions } from 'vuex';

export default {
    data () {
        return {
            quoteList: []
        }
    },
    computed: {
        ...mapState(['proSearchRst'])
    },
    mounted () {
        console.log(this.proSearchRst)
        this.quoteList = JSON.parse(this.proSearchRst.data)
    },
    methods: {
        ...mapActions(['SubmitByProductId2']),
        toDetail(item) {
            console.log(item)
            var par = {
                skuIds: item.ProductId + '_0_0_0_0_0_0_0',
                counts: 1,
                // regionId: 
                YjUse: item.YjUse,
                price: item.Price,
                quoteModel: item.QuoteLogInfoId,
                // qItemCode: item.
                RemindPrice: item.RemindPrice,
                GroupJson: item.GroupJson,
                QuoteStr: item.QuoteStr,
                LimitTimeBuyId: item.LimitTimeBuyId,
                // PreferentialAmount: item.
            }
            this.SubmitByProductId2(par)
        }
    }
}
</script>
<style scoped>
page{
  min-height: 100%;
  background-color: #f4f4f4;
}
.sort{
    position: relative;
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
    color: #b4282d;
}

.sort-box .item.by-price{
    background: url(//yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/no-3127092a69.png) 155rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.asc{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/up-636b92c0a5.png) 155rpx center no-repeat;
    background-size: 15rpx 21rpx;
}

.sort-box .item.by-price.active.desc{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/down-95e035f3e5.png) 155rpx center no-repeat;
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
.list-content {
    
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
  width: 440rpx;
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
  color: #333;
  height: 40rpx;
  line-height: 40rpx;
}
.price {
    color: red;
    font-size: 28rpx;
}
.bottom {
    margin-top: 55rpx;
    height: 24rpx;
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
</style>

