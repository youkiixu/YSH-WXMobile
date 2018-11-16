<template>
  <div class="nav a-section a-popular">
    <div class="b">
      <form @submit="formSubmit" report-submit="true">
        <div class="item" v-for="item of content.goodslist" :key="item.item_id"  @click="toDetail(item)">
          <button  class="form_button"  formType="submit">
            <img class="img" :src="baseUrl+ item.pic" background-size="cover" />
            <div class="right">
              <div class="text">
                <text class="name">{{item.title}}</text>
                <text class="desc">{{item.original_price}}</text>
                <text class="price">￥{{item.price}}</text>
              </div>
            </div>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
    name: 'a-popular',
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
.a-popular {
  width: 750rpx;
  height: auto;
  overflow: hidden;
}

.a-popular .b .item {
  border-top: 1px solid #d9d9d9;
  margin: 0 20rpx;
  height: 264rpx;
  width: 710rpx;
}

.a-popular .b .img {
  margin-top: 12rpx;
  margin-right: 12rpx;
  float: left;
  width: 240rpx;
  height: 240rpx;
}

.a-popular .b .right {
  float: left;
  height: 264rpx;
  width: 456rpx;
  display: flex;
  flex-flow: row nowrap;
}

.a-popular .b .text {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  height: 264rpx;
  width: 456rpx;
}

.a-popular .b .name {
  width: 456rpx;
  display: block;
  color: #333;
  line-height: 50rpx;
  font-size: 30rpx;
}

.a-popular .b .desc {
  width: 456rpx;
  display: block;
  color: #999;
  line-height: 50rpx;
  font-size: 25rpx;
}

.a-popular .b .price {
  width: 456rpx;
  display: block;
  color: #b4282d;
  line-height: 50rpx;
  font-size: 33rpx;
}
</style>


