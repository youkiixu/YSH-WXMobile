<template>
    <div class="content">
        <form report-submit="true"  @submit="formSubmit">
            <div class="login">
                <div class="login_pwd clear">
                    
                    <input class="login_pwdInput" v-model="userName" placeholder="请输入昵称" confirm-type="done">  
                    <!-- <picker @change="bindPickerChange" :value="index" :range="serviceTypeStrGroup">      
                        <button class="pwd_btn"  @click="forgetPwd">{{serviceTypeStrGroup[index]}}</button>    
                    </picker> -->
                </div>
                <div  class="login_btn">
                    <button open-type="getUserInfo"  @getuserinfo="bind">绑定客服</button>
                </div>     
                <div  class="to_register">
                    <button @click="toIndex" formType="submit">返回首页</button>
                </div>                   
            </div>
        </form>
    </div>
</template>

<script>
import user from '@/services/user'
import api from '@/utils/api'
import {mapState} from 'vuex'
export default {
    data () {
        return {
            shopId: 0,
            shopName: '',
            userName: '',
            serviceTypeStrGroup: ['售前客服' , '售后客服'],
            serviceTypeGroup: [1 , 2],
            index: 0
        }
    },
    computed: {
      ...mapState([
          'userInfo'
      ])  
    },
    mounted () {
        this.shopId = decodeURIComponent(this.$route.query.scene)
        this.getUserShopInfo()
    },
    methods: {
        // 获取店铺的名字
        async getUserShopInfo () {
            this.$wx.showLoading()
            const res = await api.getUserShopInfo({shopId : this.shopId})
            this.$wx.hideLoading()
            if(res.data) {
                this.shopName = res.data.ShopName
            }
            
        },
        bind(e) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            // if(this.userName == '') {
            //     this.$wx.showErrorToast('请输入您的客服昵称')
            //     return
            // }
            let par = {
                strOpenId: hideOpenId,
                strGroupName: this.shopName,
                strUserName: this.userName
            }
            if(e.mp.detail.rawData) {
                const wxInfo = JSON.parse(e.mp.detail.rawData)
                par = Object.assign(par , {
                    strHeadIcon: wxInfo.avatarUrl,
                    strUserText: wxInfo.nickName
                })
            }
            this.bindSeller(par)

        },
        async bindSeller(par) {
            this.$wx.showLoading()
            const res = await api.bindSaaSWxCusService(par)
            this.$wx.hideLoading()
            if(res.success) {
                this.$wx.showSuccessToast(res.msg)
            } else {
                this.$wx.showErrorToast(res.msg)
            }

        },
        toIndex () {
            this.$router.push({ path: '/pages/index/index', isTab: true })
        },
        bindPickerChange(e) {
            this.index = Number(e.mp.detail.value)
        },
        formSubmit(e) {
            const formId = e.mp.detail.formId
        }
    }
}
</script>

<style scoped>
    .content {
        width: 750rpx;
        padding: 30rpx 20rpx;
    }
    .login .login_phone, .login .login_pwd{
        height: 80rpx;
        width: 705rpx;
    }
     .login_phone{
        margin-top: 30rpx;
        padding: 0 12rpx;
        box-sizing: border-box;
        width: 705rpx;
        height: 80rpx;       
        background-color: #f7f7f7;
    }
    .login_phone input{
        height: 100%;
        width: 100%;
        line-height: 80rpx;
        font-size: 24rpx;
        color: #282828;
    }
    .login_pwd{
        margin-top: 30rpx;
    }
    .login_pwdInput{
        float: left;
        width: 705rpx;
        height: 80rpx;       
        background-color: #f7f7f7;
        padding: 0 12rpx;
        box-sizing: border-box;       
    }
    .login_pwdInput input{
        height: 100%;
        width: 100%;
        line-height: 80rpx;
        font-size: 24rpx;
        color: #282828;
    }
    .pwd_btn{
        width: 135rpx;
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        color: #666;
        font-size: 22rpx;
        background-color: #e5e5e5;       
        float: left;
        border-style: none;
        padding: 0;
    }
     .login_btn{
        margin-top: 30rpx;       
        width: 705rpx;
        height: 80rpx;               
    }
    .login_btn button{
        border-radius: 10rpx;    
        width: 100%; 
        height: 100%;
        line-height: 80rpx;
        text-align: center;
        font-size: 28rpx;
        background-color: #009e96;
        color: #fff;
    }
    .to_register{
        margin-top: 30rpx;       
        width: 705rpx;
        height: 80rpx;    
    }
    .to_register button{    
        width: 100%; 
        height: 100%;
        line-height: 80rpx;
        text-align: center;
        font-size: 28rpx;
        color: #009e96;
        background-color:transparent;
    }
</style>
