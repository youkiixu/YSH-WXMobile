<template>
  <div class="nav a-section a-new">
    <div class="b clear">
      <form @submit="formSubmit" report-submit="true">
        <div class="item" v-for="item of content.goodslist" :key="item.item_id" @click="toDetail(item)">
          <button  class="form_button"  formType="submit">
            <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
            <div class="txt">
                <text class="name">{{item.title}}</text>
                <!-- <text class="desc"></text> -->
                <text class="price">￥{{item.price}}</text>                        
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
    name: 'a-new',
    props: {
        content: Object
    },
    computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    },
    methods: {
      toDetail(item) {
        this.$emit('onClick' , item);
      },
      formSubmit(e) {
        const formId = e.mp.detail.formId
        this.$emit('formSubmit' , formId)
      }
    }
}
</script>
<style scoped>
.a-new .b {
  width: 750rpx;
  height: auto;
  padding: 0 20rpx 20rpx 20rpx;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #f1f1f1;
}
.clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.a-new .b .item {
  float: left;
  width: 349rpx;
  height: 510rpx;
  margin-top: 10rpx;
  margin-left: 10rpx;
  overflow: hidden;
}
.a-new .b .item:nth-child(1),.a-new .b .item:nth-child(2){
  margin-top: 0;
}
.a-new .b .item:nth-child(2n+1){
  margin-left: 0;
}
.a-new .b .item-b {
  margin-left: 42rpx;
}

.a-new .b .img {
  width: 100%;
  height: 350rpx;
  display: block;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #e5e5e5;
}

.a-new .item .txt{
  height: 160rpx;
  width: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  background-color: #fff;
  border: none;
  border-bottom-left-radius:10rpx;
  border-bottom-right-radius:10rpx;
}
.a-new .item .txt .name {
  display: block;
  height: 80rpx;
  line-height: 40rpx;
  font-size: 24rpx;
  color: #282828;
  width: 310rpx;
  overflow: hidden;
  /* white-space: nowrap; */
  text-overflow:ellipsis;
}
.a-new .item .txt .desc {
  display: block;
  line-height: 30rpx;
  font-size: 20rpx;
  color: #666666;
  width: 310rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
}

.a-new .item .txt .price{
  display: block;
  height: 50rpx;
  line-height: 60rpx;
  font-size: 22rpx;
  color: #dc2121;
}
</style>

