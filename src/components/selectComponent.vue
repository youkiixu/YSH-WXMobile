<template>
    <view>
      <view class="close" @click="closeAttr">
        <img class="icon" src="/static/images/icon_close.png"/>
      </view>
      <view class="img-info clear">
        <img class="img" :src="baseUrl + detailInfo.imagePath + '/1_350.png'" @click="previewImage(baseUrl + detailInfo.imagePath + '/1_350.png')"/>
        <view class="info">
          <view class="c">
            <view class="p" v-if="!detailInfo.IsCustom"><text class="p-icon">￥</text>{{detailInfo.Price}}</view>
            <view class="p" v-else><text class="p-icon">￥</text>{{ListPriceInfo.sprice + detailInfo.RemindPrice}}</view>
            <view class="s" v-if="!detailInfo.IsCustom">库存：{{Stock}}</view>
            <view class="a" v-if="!detailInfo.IsCustom">已选：<text>{{selectSkuStr.Color}} {{selectSkuStr.Size}} {{selectSkuStr.Version}} {{selectSkuStr.Material}} {{selectSkuStr.Fashion}} {{selectSkuStr.Grams}} {{selectSkuStr.Ensemble}}</text></view>
            <view class="a" v-if="detailInfo.IsCustom"><text v-for="(item , index) in ListPriceInfo.paraArr" :key="index">{{item.paraStr}}</text></view>
          </view> 
      </view>
      </view>
      <scroll-view scroll-y class="spec-con">
        <view class="spec-item" v-if="detailInfo.IsCustom">
            <view class="name">点击这里选择参数重新报价</view>
            <view class="values"  v-for="(item , index) in ListPriceInfo.paraArr" :key="index">
              <view class="selected value" @click="toBaojia">{{item.paraStr}}</view>
            </view>
        </view>
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
        <view class="spec-item" v-if="strYjtype">
            <view class="name">点击选择物流方式</view>
            <view class="values">
              <view class="selected value" @click="selectWuliu">{{strYjtype}}<span>></span></view>
            </view>
        </view>
        <view class="number-item" v-if="!detailInfo.IsCustom">
            <view class="name">数量</view>
            <view class="selnum">
            <view class="cut" @click="cutNumber" hover-class>-</view>
            <input v-model.lazy="number" @blur="numberChange" @confirm="numberChange" class="number"  type="number" confirm-type="done"/>
            <view class="add" @click="addNumber" hover-class>+</view>
            </view>
        </view>
      </scroll-view>
      <view class="car-btn clear" v-if="!SubmitByProductType">
          <view class="car-add"  v-if="detailInfo.IsNotNeedFile" @click="addToCart" hover-class>加入购物车</view>
          <view class="car-buy"  v-if="detailInfo.IsNotNeedFile" @click="SubmitByProduct" hover-class>立即购买</view>
          <!-- IsNotNeedFile 预计将用这个需不需要上传文件字段判断是否可以下单或加入购物车-->
          <view class="car-buy disabled" v-if="!detailInfo.IsNotNeedFile" style="width:100%;" @click="disabledClick">下单需要上传文件，请到电脑端操作</view>
      </view>
      <view class="car-btn clear" v-if="SubmitByProductType">
          <view class="car-buy" v-if="detailInfo.IsNotNeedFile" style="width:100%;" @click="SubmitByProduct" hover-class>{{btnText}}</view>
          <!-- IsNotNeedFile 预计将用这个需不需要上传文件字段判断是否可以下单或加入购物车-->
          <view class="car-buy disabled" v-if="!detailInfo.IsNotNeedFile" style="width:100%;" @click="disabledClick">下单需要上传文件，请到电脑端操作</view>
      </view>
    </view>   
</template>
<script>
export default {
    props: {
        baseUrl: {
            type: String,
            default: ''
        },
        detailInfo: {
            type: Object,
            default: {
                Material: [],
                Size: [],
                Version: [],
                Color: [],
                Grams: [],
                Fashion: [],
                Ensemble: []
            }
        },
        selectSku : {
            type: Object,
            defalut: {
                Color: 0,
                Size: 0, 
                Version: 0,
                Material: 0,
                Fashion: 0,
                Grams: 0,
                Ensemble: 0
            }
        },
        selectSkuStr: {
            type: Object,
            defalut: {
                Color: '',
                Size: '',
                Version: '',
                Material: '',
                Fashion: '',
                Grams: '',
                Ensemble: ''
            }
        },
        ListPriceInfo: {
            type: Object,
            defalut: {
                sprice : 1,
                paraArr: []
            }
        },
        strYjtype: {
            type: String,
            defalut: ''
        },
        SubmitByProductType: {
            type: Boolean,
            defalut: false
        },
        number :  {
            type: Number,
            defalut: 1
        },
        Stock : {
            type: Number,
            defalut: 0
        },
        btnText: {
            type: String,
            defalut: '立即购买'
        }
    },
    methods: {
        toBaojia () {
            this.$emit('toBaojia');
        },
        clickSkuValue (skuName , skuId , skuValue) {
            this.$emit('clickSkuValue' , skuName , skuId , skuValue )
        },
        addNumber () {
            this.$emit('addNumber')
        },
        cutNumber () {
            this.$emit('cutNumber')
        },
        addToCart () {
            this.$emit('addToCart')
        },
        SubmitByProduct () {
            this.$emit('SubmitByProduct')
        },
        closeAttr () {
            this.$emit('closeAttr')
        },
        selectWuliu(e ) {
            this.$emit('selectWuliu' , e)
        },
        numberChange(e) {
            this.$emit('numberChange' , e.mp.detail.value)
        },
        disabledClick () {
            this.$wx.showModal({
                content: '此商品需要下单需要上传文件，小程序暂时仅提供报价功能，下单请移步PC电脑端操作.',
                showCancel: false
            })
        },
        previewImage (url) {
            this.$wx.previewImage({
                current: url,
                urls: [url]
            })
        }
    }
}
</script>
<style scoped>


.attr-pop .close {
  position: absolute;
  width: 100rpx;
  height: 100rpx;
  right: 80rpx;
  overflow: hidden;
  top: 31.25rpx;
  z-index: 30;
  text-align:right;
}

.attr-pop .close .icon {
  width: 48rpx;
  height: 48rpx;
}

.attr-pop .img-info {
  width: 687.5rpx;
  padding-bottom: 25rpx;
  position: relative; 
  border-bottom: 1px solid #ececec;
}

.attr-pop .img {
  float: left;
  height: 175rpx;
  width: 175rpx;
  background: #f4f4f4;
  margin-right: 31.25rpx;
  position: absolute;
  z-index: 100;
  top: -50rpx;  
  border-radius: 20rpx;
}
.attr-pop .info {
  float: right;
  width: 470rpx;
  overflow: hidden;
  /* display: flex; */
  align-items: center;
}
.attr-pop .p {
  font-size: 38rpx;
  color: #dc2121;
  height: 32rpx;
  line-height: 32rpx;
  margin-bottom: 10rpx;
}
.attr-pop .p-icon{
  font-size: 30rpx;
}
.attr-pop .s{
  font-size: 20rpx;
  color: #555555;
  height: 40rpx;
  line-height: 40rpx;
}
.attr-pop .a {
  font-size: 24rpx;
  color: #333;
  line-height: 35rpx;
  min-height: 70rpx;
}

.spec-con {
  width: 100%;
  height:500rpx;
  overflow: hidden;
}
.spec-con .spec-item{
   padding: 20rpx 10rpx;
   border-bottom: 2rpx solid #ececec;
}
.spec-con .name {
  /* height: 32rpx; */
  margin-bottom: 22rpx;
  font-size: 34rpx;
  color: #555;
}

.spec-con .values {
  height: auto;
  font-size: 0;
  margin-top: 10rpx;
}

.spec-con .value {
  display: inline-block;
  min-height: 55rpx;
  line-height: 55rpx;
  text-align: center;
  margin-right: 24rpx;
  margin-bottom: 24rpx;
  padding: 0 26rpx;
  box-sizing: border-box;
  background-color: #f4f4f4;
  font-size: 24rpx;
  color: #242424;
  border-radius: 10rpx;
}

.spec-con .value.disable {
  border: 2rpx solid #ccc;
  color: #ccc;
}

.spec-con .value.selected {
  background-color:#009e96; 
  color: white;
}
.spec-con .number-item{
   height: 100rpx;
   padding: 0 10rpx;
   line-height: 100rpx;
   border-bottom: 2rpx solid #ececec;
}
.number-item .name{
  font-size: 34rpx;
  color: #555;
  float: left;
}
.number-item .selnum {
  float: right;
  margin-top: 10rpx;
  margin-right: 50rpx;
  height: 55rpx;
  display: flex;
  font-size: 29rpx;
}

.number-item .cut {
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  background-color: #f4f4f4;
  border-radius: 5rpx;
  font-size: 40rpx;
}

.number-item .number {
  width: 90rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  float: left;
  margin-left: 3rpx;
  background-color: #f4f4f4;
  border-radius: 5rpx;
  font-size: 28rpx;
}

.number-item .add {
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin-left: 3rpx;
  background-color: #f4f4f4;
  border-radius: 5rpx;
  font-size: 40rpx;
}

.car-btn{
  height: 100rpx;
  width: 100%;
  line-height: 100rpx;
  color: white;
  font-size: 28rpx;
  position:fixed;
  left: 0;
  bottom: 0;
  z-index: 15;
}
.car-btn .car-add{
  float: left;
  width: 50%;
  text-align: center;
  color: #009e96;
  background-color: #e3fffe;
}
.car-btn .car-buy{
  width: 50%;
  float: left;
  text-align: center;
  background-color: #009e96;
}
.car-btn  .disabled {
    background-color: #777;
    color: #f7f7f7;
}
</style>


