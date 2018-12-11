<template>
    <div class="container">
        <swiper class="container" :current="current" @change="changeDot" >
              <swiper-item>
                <img mode="aspectFill" class="settled-img" src="http://kiy.cn/Areas/Wxmobile/Content/img/01_page.png" alt="">
              </swiper-item>
              <swiper-item>
                <img mode="aspectFill" class="settled-img" src="http://kiy.cn/Areas/Wxmobile/Content/img/02_page.png" alt="">
              </swiper-item>
              <swiper-item>
                <img mode="aspectFill" class="settled-img" src="http://kiy.cn/Areas/Wxmobile/Content/img/03_page.png" alt="">
              </swiper-item>
              <swiper-item>
                <img mode="aspectFill" :class="showModel ? 'settled-img blur' : 'settled-img' " src="http://kiy.cn/Areas/Wxmobile/Content/img/04_page.png" alt="">
                <div class="btn-submit" hover-class="active" @click="submit">
                    申请入驻
                </div>
              </swiper-item>
        </swiper>
        <div class="dot-content">
            <span :class="current == 0 ? 'dot active' : 'dot'"></span>
            <span :class="current == 1 ? 'dot active' : 'dot'"></span>
            <span :class="current == 2 ? 'dot active' : 'dot'"></span>
            <span :class="current == 3 ? 'dot active' : 'dot'"></span>
        </div>
        <div class="attr-pop-box" v-if="showModel" @click="showModel=false" catchtouchmove="stopPageScroll">
            
        </div>
        <div class="pop-box" v-if="showModel">
            <div class="input-content" v-if="!success">
                <input type="name" class="pop-input" placeholder-class="pop-input-pla" placeholder="姓名">
                <input type="number" class="pop-input" placeholder="电话" placeholder-class="pop-input-pla">
                <div class="set-btn btn-sub" @click="submitForm">提交</div>
            </div>
            <div class="success-content" v-if="success">
                <div class="title">
                    提交成功
                </div>
                <div class="content">
                    我们会有专人与您联系，请留意手机
                </div>
                <div class="btn-back">
                    返回首页
                </div>
            </div>
        </div>
    </div>    
</template>
<script>
export default {
    data () {
        return {
            current: 0,
            showModel: false,
            success: false
        }
    },
    mounted () {

    },
    methods: {
        changeDot(e) {
            this.current = e.mp.detail.current
        },
        submit() {
            this.showModel = true
            this.success = false
        },
        submitForm() {
            this.success = true
        }
    },
    onShareAppMessage: function () {
        return {
            title: '印生活商城',
            desc: '入驻平台',
            path: 'pages/ucenter/settledIn'
        }
    }
}
</script>
<style scoped>
    .settled-img {
        /* height: 100vh;
        width: 100vw; */
        /* margin: 0 auto;
        display: block; */
        width: 750rpx;
        height: 1200rpx;
    }
    .dot-content {
        position: fixed;
        display: flex;
        left: 50%;
        transform: translateX(-50%);
        bottom: 25rpx;
        width: 150rpx;
        height: 10rpx;
        
    }
    .dot {
        display: block;
        flex:1;
        width: 20rpx;
        margin: 0 6rpx;
        height: 8rpx;
        background: #fcfaf8;
        border-radius: 4rpx;
    }
    .active {
        background: #ef893d;
    }
    .set-btn {
        text-align: center;
        color: #fff;
        background: #4c99f0;
    }
    .btn-submit {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        height: 80rpx;
        width: 500rpx;
        bottom: 50rpx;
        text-align: center;
        line-height: 80rpx;
        color: #fff;
        background: #4c99f0;
        border-radius: 150rpx;
        font-size: 48rpx;
        border-radius: 150rpx;

    }
    .attr-pop-box {
        width: 100%;
        height: 100%;
        position: fixed;
        background: rgba(255, 255, 255, .5);
        z-index: 8;
        bottom: 0;
        
    }
    .blur {
        -webkit-filter: blur(5px); /* Chrome, Opera */
       -moz-filter: blur(5px);
        -ms-filter: blur(5px);    
            filter: blur(5px);  
    }
    .pop-box {
        position: fixed;
        left: 50%;
        top: 35%;
        transform: translate(-50%,-50%);
        width: 606rpx;
        height: 404rpx;
        background: #fff;
        border-radius: 14rpx;
        z-index: 9;
        box-shadow: 0 0 15rpx 0rpx rgba(0, 0, 0, .2)
    }
    .pop-input {
        position: relative;
        margin: 40rpx auto 0;
        background: #eee;
        width: 515rpx;
        height: 76rpx;
        padding: 0 20rpx;
        color: #999;
        border-radius: 8rpx;
    }
    .pop-input-pla {
        font-size: 38rpx;
        color: #999;
    }
    .btn-sub {
        width: 280rpx;
        height: 80rpx;
        line-height: 80rpx;
        font-size: 40rpx;
        margin: 40rpx auto 0;
        border-radius: 8rpx;
        
    }
    .title {
        margin: 58rpx auto 0;
        font-size: 56rpx;
        text-align: center;
        font-weight: 700;
    }
    .content {
        font-size: 30rpx;
        color: #666666;
        text-align: center;
        font-weight: 500;
        margin: 30rpx auto 0;
    }
    .btn-back {
        font-size: 40rpx;
        color: #469bf0;
        text-align: center;
        margin-top: 80rpx;
        text-decoration: underline;
    }
</style>

