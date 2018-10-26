<template>
    <swiper :class="{ 'banner ' : content.space == 0 , 'banner2': content.space == 1 }" :indicator-dots="content.space == 0 ? true : false" autoplay="true" interval="3000" duration="1000">
        <swiper-item v-for="item of content.dataset" :key="item.id">
        <view  @click="onClick(item)">
            <img :class="{ 'full' : content.space == 0 , 'nofull': content.space == 1 }" :src="baseUrl+item.pic" background-size="cover" />
        </view>
        </swiper-item>
    </swiper>
</template>

<script>
// 广告: 9
// space = 1 是留白，space = 0 是全屏
export default {
    name: 'indexAd',
    props: {
        content: Object
    },
    mounted () {
        // console.log(this.content)
    },
    computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    },
    methods: {
        onClick(item) {
            this.$emit('onClick' , item);
        }
    }
}
</script>
<style scoped>
    .banner {
        position: relative;
        display: block;
        width: 750rpx;
        height: 353rpx;
        
    }
     /* .banner2 {
        position: relative;
        display: block;
        width: 750rpx;
        height: 244rpx; 
        margin-top: 10rpx;
    } */
    .banner2 {
        position: relative;
        display: block;
        width: 750rpx;
        height: 220rpx; 
        padding: 0 20rpx 20rpx 20rpx;
        box-sizing: border-box;
        align-items: center;
        justify-content: center;
    }
   
    .full {
        width: 100%;
        height: 353rpx;
    }
     /* .nofull {
        width: 710rpx;
        height: 234rpx;
        margin:  0 20rpx;
    } */
    .nofull {
        width: 710rpx;
        height: 193rpx;
        border-radius:10rpx;
    }
</style>