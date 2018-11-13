<template>
    <view >
        <!-- 选择界面 -->
        <view class="select-type" v-if="isSelect">
            <div class="select-type-content">
                <img src="http://www.kiy.cn/Areas/Wxmobile/Content/img/logo.png" class="logo" alt="">
                <button class="btn block" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号快捷登录</button>
                <button  class="btn" @click="unSelect">彩印通账号密码登录</button>
                <!-- <button>彩印通账号密码登录</button> -->
            </div>
        </view>
        <!-- 手机绑定操作 -->
        <view class="content" v-if="!isSelect">
            <div class="to-select" @click="toSelect">
                返回上一步
            </div>
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
                <view class="register_pwd">
                <input v-model="registerInfo.Password" placeholder="请输入密码" password confirm-type="done">         
                </view>
                <view class="register_pwd">
                <input v-model="Password2" placeholder="请再次输入密码" password confirm-type="done">         
                </view>
                <view  class="register_btn">
                    <button @click="btnHandler">注册</button>
                </view>                       
                <view  class="to_register">
                    <button @click="transferText">已有账号</button>
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
                    <!-- <button class="pwd_btn"  @click="forgetPwd">忘记密码</button>                 -->
                </view>            
                <view  class="login_btn">
                    <button @click="btnHandler">登录</button>
                </view>   
                <view  class="to_register">
                    <button @click="transferText">立即注册</button>
                </view>                       
            </view>
        </view>

    </view>

</template>
<script>
import api from '@/utils/api'
import util from '@/utils/util'
// import user from '@/services/user';
import wx from 'wx'
import { mapState , mapActions } from 'vuex'
export default {
    name: 'login',
    data () {
        return {
            userInfo: {
                UserId: '',
                Password: '',
                loginType: 1
            },
            registerInfo: {
                CellPhone: '',
                Code: '',
                Password: ''
            },
            Password2 : '',
            isRegister: false,
            isSelect: true,
            openId : ''
        }
    },
    computed: {
        ...mapState([
            'wxUserInfo'
        ])
    },
    mounted () {
        var _this = this
        // user.loginByWeixin().then(res => {
        //     if(res.success) {
        //         _this.openId = res.openId
        //     }
        // })
    },
    methods: { 
        ...mapActions([
            'sassLogin'
        ]),
        getPhoneNumber (e) {
            const _this = this
            if(e.mp.detail.encryptedData) {
                _this.quickLogin(e.mp.detail)
            }
        },
        async quickLogin(item) {
            const _this = this
            const openId = wx.getStorageSync('openId')
            var par = {
                encryptedData: item.encryptedData,
                iv: item.iv,
                wxHeadImg: this.wxUserInfo.avatarUrl,
                wxNick: this.wxUserInfo.nickName,
                loginType: 2 
            }
            this.$wx.showLoading('正在登录')
            _this.sassLogin(par).then(res => {
                _this.$wx.hideLoading()
                _this.$wx.showSuccessToast( '登陆成功')
                setTimeout(() => {
                    _this.$router.back()
                }, 1000);
            }).catch(err => {
                _this.$wx.hideLoading()
                _this.$wx.showModal({
                    title: '登录失败',
                    content: '该手机号没有绑定账号，请用彩印通账号登录',
                    showCancel: true
                }).then(res => {
                    _this.unSelect()
                })
                
            })
        },
        login() {
            const _this = this;
            // this.showLoading()
            this.$wx.showLoading('正在登录')
            _this.sassLogin(this.userInfo).then(res => {
                _this.$wx.hideLoading()
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
                return
            }
            if(this.registerInfo.Password != this.Password2) {
                this.$wx.showErrorToast('输入密码不一致')
                return
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
                this.$wx.showErrorToast('手机号码错误')
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
                Code: '',
                Password: ''
            }
            this.Password2 = ''
        },
        forgetPwd() {
            this.$wx.showErrorToast('暂未支持')
        },
        unSelect () {
            const _this = this
            _this.isSelect = false
            _this.register = false
            
        },
        toSelect() {
            this.isSelect = true
            this.register = false
        }
    }
}
</script>
<style scoped>
    .to-select {
        position: absolute;
        top: 20rpx;
        left: 20rpx;
        height: 40rpx;
        font-size: 30rpx;
        width: 180rpx;
        background: #cccccc;
        border-radius: 50rpx;
        padding: 10rpx;
        line-height:40rpx;
        color: #fafafa;
        text-align: center;
    }
    .select-type {
        position: relative;
        height: 100vh;
        width: 750rpx;
    }
    .select-type-content {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 680rpx;
    }
    .select-type .logo {
        display: block;
        width: 605rpx;
        height: 325rpx;
        margin: 0 auto;
        transform: scale(0.7);
    }
    .select-type .btn {
        width: 680rpx;
        height: 80rpx; 
        line-height: 80rpx;
        color: #009e96;
        margin-bottom: 30rpx;
        background: #fff;
        border: 1rpx solid #009e96;
    }
    .select-type .block {
        color: #fff;
        background: #009e96;
    }
    .content {
        width: 750rpx;
        padding: 80rpx 20rpx;
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


