<template>
    <view class="a-section">
         <view class="h">
                <text class="txt float-l">{{content.title}}</text>
            <!-- <navigator url="../brand/brand">
                <text class="txt float-r">{{content.subtitle}}</text>
            </navigator> -->
        </view>
    </view>
</template>
<script>
// 标题 2
// subtitle
export default {
    name: 'indexTitle',
    props: {
        content: Object
    },
    mounted () {
        // console.log(this.content)
    }
}
</script>
<style scoped>
.a-section {
  width: 750rpx;
  height: auto;
  overflow: hidden;
  background: #fff;
  color: #333;
}

.a-section .h {
    position: relative;
  height: 76rpx;
}

.a-section .h .txt {
  padding-right: 30rpx;
  /* background: url("http://ac-3yr0g9cz.clouddn.com/2cdba05369e10f934e54.png") right 4rpx no-repeat; */
  /* background-size: 16.656rpx 27rpx; */
  display: inline-block;
  height: 76rpx;
  line-height: 76rpx;
}
.float-l {
    float: left;
    font-size: 29rpx;
    margin-left: 30rpx;
    font-weight: 700;
}
.float-r {
    font-size: 21rpx;
    color: #c5c5c5;
    float: right;
}
</style>


