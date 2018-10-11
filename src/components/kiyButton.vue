<template>
    <view :class="solid ? 'btn cancel' : 'btn confirm'" @click="clickEvent">
        {{text}}
    </view>
</template>
<script>
export default {
    name: 'kiyButton',
    props: {
        solid: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: ''
        }
    },
    methods: {
        clickEvent() {
            this.$emit('onClick');
        }
    }
}
</script>
<style scoped>
.btn {
  margin-right: 20rpx;
  width: 140rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  font-size: 24rpx;
}
.cancel{
  color: #666;
  border: 2rpx solid #666;
  border-radius: 8rpx;
}
.confirm{
  color: #009e96;
  border: 2rpx solid #009e96;
  border-radius: 8rpx;
}
</style>


