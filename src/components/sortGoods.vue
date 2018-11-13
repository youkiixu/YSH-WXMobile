<template>
<div>
  <scroll-view scroll-y="true" scroll-top="scrollTop" enable-back-to-top="true" :style="{'height': '100%'}" >
        <div class="cate-item">           
            <div class="b"> 
                  <div v-for="item of goodsList" :key="item.ProductId" :class="(index + 1) % 2 === 0 ? 'item-b item' : 'item'"
                   @click="toDetail(item)" >
                    <img class="img" :src="baseUrl + item.imagePath + '/1_350.png'" mode="scaleToFill" lazy-load/>
                    <div class="b-txt">                                         
                      <div class="name">{{item.ProductName}}</div>
                       <div class="ShopName">{{item.ShopName}}</div>
                       <div class="b-bottom clear">
                          <div class="price">
                           <text class="icon"></text>{{item.IsCustom ? '定制报价' : '￥' + item.MinSalePrice}}
                          </div> 
                          <div class="dealNum">成交 {{item.SaleCounts}} 笔</div> 
                       </div>
                    </div>
                </div>
            </div>
        </div>
    </scroll-view>

</div>
</template>

<script>
export default {
  methods: {
    toDetail (item) {
      if(item.IsCustom) {
        this.$wx.toBaoJia({ pid: item.QitemCode , title: item.ProductName , isDetail: true , ProductId: item.ProductId , fid: item.ShopMapId} , this)
      } else {
        this.$wx.toDetail({id : item.ProductId , title: item.ProductName} , this)
      }
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
