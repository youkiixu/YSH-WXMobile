<template>
    <view>
        <swiper v-if="content.showType == 1" :class="{ 'banner ' : content.space == 0 , 'banner2': content.space == 1 }" :indicator-dots="content.space == 0 ? true : false" autoplay="true" interval="3000" duration="1000">
            <swiper-item v-for="item of content.dataset" :key="item.id">
            <view  @click="onClick(item)">
                <img :class="{ 'full' : content.space == 0 , 'nofull': content.space == 1 }" :src="baseUrl+item.pic" mode="scaleToFill" background-size="cover" />
            </view>
            </swiper-item>
        </swiper>
        <view class="nav a-section a-brand"  v-if="content.showType == 2">
            <view class="b clear">
            <view class="item item-1" v-for="(item , index) of content.dataset" :key="index" @click="onClick(item)">
                <view>
                    <text class="name" v-if="item.showtitle">{{item.showtitle}}</text>
                    <img class="img" :src="baseUrl+ item.pic" mode="scaleToFill" background-size="cover" />
                </view>
            </view>
            </view>
        </view>
    </view>
</template>


<script>
// 广告: 9
// space = 1 是留白，space = 0 是全屏
export default {
    name: 'indexAd',
    components: {
        
    },
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
    .banner2 {
        position: relative;
        display: block;
        width: 750rpx;
        height: 220rpx; 
        padding: 0 20rpx 0rpx 20rpx;
        box-sizing: border-box;
    }
    

    .full {
        width: 750rpx;
        height: 353rpx;
    }
    .nofull {
        width: 700rpx;
        height: 193rpx;
        border-radius:10rpx;
    }
    .nav {
        width:750rpx;
        height:auto;
    }
    .a-brand{
    margin-bottom: 20rpx;
    background-color: #fff;
    }
    .a-brand .b {
    width: 750rpx;
    height: auto;
    padding: 0 20rpx 20rpx 20rpx;
    overflow: hidden;
    }
    .clear:after{
        display: block;
        content:'';
        clear: both;
        height:0;
        }
    .a-brand .b .item {
    float: left;
    width: 30.5%;
    height: 226rpx;
    margin-top: 15rpx;
    margin-left: 15rpx;
    border-radius: 7rpx;
    background-color: #666;
    position: relative;
    }
    .a-brand .b .item:nth-child(1),.a-brand .b .item:nth-child(2),.a-brand .b .item:nth-child(3) {
    margin-top: 0;
    }
    .a-brand .b .item:nth-child(3n+1) {
    margin-left: 0;
    }
    .a-brand .b .item .name{
    display: block;
    width: 226rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 24rpx;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.2);
    }
    .a-brand .b .item .img{
    display: block;
    width: 100%;
    height: 226rpx;
    overflow: hidden;
    }
</style>