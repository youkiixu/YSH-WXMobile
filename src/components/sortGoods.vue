<template>
<form @submit="formSubmit" report-submit="true">
  <scroll-view scroll-y="true" scroll-top="scrollTop" enable-back-to-top="true" :style="{'height': '100%'}" >
        <view class="cate-item">           
            <view class="b"> 
                  <view v-for="item of goodsList" :key="item.ProductId" :class="(index + 1) % 2 === 0 ? 'item-b item' : 'item'"
                   @click="toDetail(item)" >
                   <button class="form_button" formType="submit">
                     <img class="img" :src="baseUrl + item.imagePath + '/1_350.png'" mode="scaleToFill" lazy-load/>
                      <view class="b-txt">                                         
                        <view class="name">{{item.ProductName}}</view>
                        <view class="ShopName">{{item.ShopName}}</view>
                        <view class="b-bottom clearfix">
                            <view class="price">
                            <text class="icon"></text>{{item.IsCustom ? '定制报价' : '￥' + item.MinSalePrice}}
                            </view> 
                            <view class="dealNum">成交 {{item.SaleCounts}} 笔</view> 
                        </view>
                      </view>
                   </button>
                </view>
            </view>
        </view>
    </scroll-view>
</form>
</template>

<script>
import api from '@/utils/api'
export default {
  methods: {
    toDetail (item) {
      if(item.IsCustom) {
        this.$wx.toBaoJia({ pid: item.QitemCode , title: item.ProductName , isDetail: true , ProductId: item.ProductId , fid: item.ShopMapId} , this)
      } else {
        this.$wx.toDetail({id : item.ProductId , title: item.ProductName} , this)
      }
    },
    async formSubmit(e) {
      const formId = e.mp.detail.formId
      const hideOpenId = wx.getStorageSync('hideOpenId')
      if(formId === 'the formId is a mock one' || !hideOpenId) return
        await api.saaSSaveFormId({
            form_id: formId,
            strOpenId: hideOpenId
        })
    }
  },
  computed: {
      baseUrl() {
          return this.$wx.baseUrl
      }
  },
  props: {
    goodsList: {
      type: Array,
      default () {
        return {}
      }
    }
  }
}
</script>

<style scoped>
@import "../css/sortGoods.css";

</style>
