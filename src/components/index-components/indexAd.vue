<template>
    <swiper :class="{ 'banner ' : content.space == 0 , 'banner2': content.space == 1 }" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <swiper-item v-for="item of content.dataset" :key="item.id">
        <navigator :url="item.link">
            <img :class="{ 'full' : content.space == 0 , 'nofull': content.space == 1 }" :src="'http://192.168.0.91:8008/'+item.pic" background-size="cover" />
        </navigator>
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
    .banner2 {
        position: relative;
        display: block;
        width: 750rpx;
        height: 244rpx; 
        margin-top: 10rpx;
    }
    

    .full {
        width: 100%;
        height: 353rpx;
    }
    .nofull {
        width: 710rpx;
        height: 234rpx;
        margin:  0 20rpx;
    }
</style>