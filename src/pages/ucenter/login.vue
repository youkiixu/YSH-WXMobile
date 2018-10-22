<template>
    <view class="content">
        <!-- 注册 -->
        <view class="register" v-if="isRegister">
            <view class="phone clear">
                <button class="phone_btn">+86</button>
                <view class="phone_num">
                    <input v-model="registerInfo.CellPhone" placeholder="请输入手机号码" number confirm-type="done">
                </view>
            </view>
            <view class="VerCode clear">
                <view class="VerCode_num">
                     <input v-model="registerInfo.Code" placeholder="请输入验证码" confirm-type="done">
                </view>
                <button class="VerCode_btn"  @click="getCode">获取验证码</button>                
            </view>
            <!-- <view class="register_pwd">
               <input v-model="userInfo.Password" placeholder="请输入密码" password confirm-type="done">         
            </view> -->
            <view  class="register_btn">
                <button @click="btnHandler">注册</button>
            </view>                       
            <view  class="to_register">
                <button @click="transferText">已有账号?去登陆...</button>
            </view>  
        </view>

        <!-- 登录 -->
        <view class="login" v-if="!isRegister">
            <view class="login_phone">
               <input v-model="userInfo.UserId" placeholder="请输入账号/手机号" confirm-type="done">         
            </view>
            <view class="login_pwd clear">
                <view class="login_pwdInput">
                     <input v-model="userInfo.Password" placeholder="请输入密码" password confirm-type="done">
                </view>
                <button class="pwd_btn"  @click="forgetPwd">忘记密码</button>                
            </view>            
            <view  class="login_btn">
                <button @click="btnHandler">登录</button>
            </view>   
            <view  class="to_register">
                <button @click="transferText">立即注册</button>
            </view>                       
        </view>


    </view>

</template>
<script>
import api from '@/utils/api'
import util from '@/utils/util'
import { mapActions } from 'vuex'
export default {
    name: 'login',
    data () {
        return {
            userInfo: {
                UserId: '',
                Password: ''
            },
            registerInfo: {
                CellPhone: '',
                Code: ''
            },
            isRegister: false
        }
    },
    methods: { 
        ...mapActions([
            'sassLogin'
        ]),
        login() {
            const _this = this;
            this.sassLogin(this.userInfo).then(res => {
                _this.$wx.showSuccessToast( '登陆成功')
                setTimeout(() => {
                    _this.$router.back()
                }, 1000);
            }).catch(err => {
                _this.$wx.showErrorToast( '登陆失败')
            })
        },
        async register () {
            const _this = this;
            if(this.registerInfo.CellPhone == '') {
                this.$wx.showErrorToast('请输入手机号')
                return
            }
            if(this.registerInfo.Code == '') {
                this.$wx.showErrorToast('请输入验证码')
            }

            const openId = wx.getStorageSync('openId')
            _this.registerInfo.OpenId = openId
            this.$wx.showLoading()
            const res = await api.sassRegister(this.registerInfo)
            this.$wx.hideLoading()
            if(res.success) {
                this.$wx.showSuccessToast(res.msg)
                setTimeout(() => {
                    _this.$router.back()
                }, 1000);
            } else {
                this.$wx.showErrorToast(res.msg)
            }
              
        },
        async getCode () {
            const isPhone = util.checkMobile(this.registerInfo.CellPhone)
            if(isPhone){
                this.$wx.showLoading()
                const res = api.verificationCode({
                    phone: this.registerInfo.CellPhone
                })
                this.$wx.hideLoading()
                this.$wx.showSuccessToast( res.msg)
            } else {
                this.$wx.showErrorToast('请正确输入手机号码')
            }
        },
        btnHandler () {
            if(this.isRegister) {
                this.register()

            } else {
                this.login()
            }
        },
        transferText() {
            this.isRegister = !this.isRegister
            if(this.isRegister){
                wx.setNavigationBarTitle({
                    title: '注册'
                })
            } else {
                wx.setNavigationBarTitle({
                    title: '登陆'
                })
            }

            this.userInfo= {
                UserId: '',
                Password: ''
            }
            this.registerInfo= {
                CellPhone: '',
                Code: ''
            }
        },
        forgetPwd() {
            this.$wx.showErrorToast('暂未支持')
        }
    }
}
</script>
<style scoped>
    .content {
        width: 750rpx;
        padding: 30rpx 20rpx;
    }
    .clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
    .register .phone, .register .VerCode{
        height: 80rpx;
        width: 705rpx;
    }   
    button::after{ 
        border: none;
        border-radius: 0;
    } 
    button{
    border-radius: 0;
    }
    .phone_btn{
        width: 85rpx;
        height: 80rpx;
        text-align: center;
        line-height: 80rpx;
        color: #666;
        font-size: 22rpx;
        background-color: #fff;
        border-bottom: 2rpx solid #e5e5e5;
        float: left;
    }
    .phone_num{
        float: left;
        margin-left: 10rpx;
        width: 605rpx;
        height: 80rpx;       
        background-color: #f7f7f7;
        padding: 0 12rpx;
        box-sizing: border-box;
    }
    .phone_num input{
        height: 100%;
        width: 100%;
        line-height: 80rpx;
        font-size: 24rpx;
        color: #282828;
    }
    .VerCode{
        margin-top: 30rpx;
    }
    .VerCode_num{
        float: left;
        width: 570rpx;
        height: 80rpx;       
        background-color: #f7f7f7;
        padding: 0 12rpx;
        box-sizing: border-box;       
    }
    .VerCode_num input{
        height: 100%;
        width: 100%;
        line-height: 80rpx;
        font-size: 24rpx;
        color: #282828;
    }
    .VerCode_btn{
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
    .register_pwd{
        margin-top: 30rpx;
        padding: 0 12rpx;
        box-sizing: border-box;
        width: 705rpx;
        height: 80rpx;       
        background-color: #f7f7f7;
    }
    .register_pwd input{
        height: 100%;
        width: 100%;
        line-height: 80rpx;
        font-size: 24rpx;
        color: #282828;
    }
    .register_btn{
        margin-top: 30rpx;       
        width: 705rpx;
        height: 80rpx;               
    }
    .register_btn button{
        border-radius: 10rpx;    
        width: 100%; 
        height: 100%;
        line-height: 80rpx;
        text-align: center;
        font-size: 28rpx;
        background-color: #009e96;
        color: #fff;
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
        width: 570rpx;
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

    /* .name {
        width: 700rpx;
        margin: 500rpx auto 50rpx;
        border-bottom: 1px solid #999;
    }
    .psw {
        width: 700rpx;
        margin: 0 auto 50rpx;;
        border-bottom: 1px solid #999;
    }
    .btn {
        width: 500rpx;
        height: 80rpx;
        line-height: 80rpx;
        background: #999;
        color: #fff;
        margin: 0 auto;
    }
    .code-btn {
        margin-bottom: 15rpx;
    }
    .btn-transfer {
        margin-top: 100rpx;
        text-align:center;
        display:block;
        font-size: 26rpx;
        color: red;
    } */
</style>


