<template>
    <view class="login">
        <view class="name" v-if="!isRegister">
            <input v-model="userInfo.UserId" placeholder="请输入账号" confirm-type="next">
        </view>
        <view class="psw" v-if="!isRegister">
            <input v-model="userInfo.Password" placeholder="请输入密码" password confirm-type="done">
        </view>
        
        <view class="name" v-if="isRegister">
            <input v-model="registerInfo.CellPhone" placeholder="请再次输入要注册的手机号" number confirm-type="done">
        </view>
        <view class="psw" v-if="isRegister">
            <input v-model="registerInfo.Code" placeholder="请再次短信验证码" confirm-type="done">
        </view>
        <button class="weui-btn mini-btn code-btn" size="mini" type="primary" v-if="isRegister" @click="getCode">获取验证码</button>
        <button class="btn" @click="btnHandler">{{isRegister ? '注册' : '登陆'}}</button>
        <text class="btn-transfer" @click="transferText">{{isRegister ? '已有账号?去登陆...' : '没有账号?去注册...'}}</text>
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
            this.sassLogin(this.userInfo).then(res => {
                this.$wx.showSuccessToast( '登陆成功')
                setTimeout(() => {
                    this.$router.back()
                }, 1000);
            }).catch(err => {
                this.$wx.showErrorToast( '登陆失败')
            })
        },
        async register () {
            if(this.registerInfo.CellPhone && this.registerInfo.Code) {
                const openId = wx.getStorageSync('openId')
                this.registerInfo.OpenId = openId
                const res = await api.sassRegister(this.registerInfo)
                
            } else {
                this.$wx.showErrorToast( '注册失败')
            }
        },
        async getCode () {
            const isPhone = util.checkMobile(this.registerInfo.CellPhone)
            if(isPhone){
                const res = api.verificationCode({
                    phone: this.registerInfo.CellPhone
                })
                this.$wx.showSuccessToast( res.msg)
            } else {
                this.$wx.showErrorToast( '请输入有效的手机号码')
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
            this.userInfo= {
                UserId: '',
                Password: ''
            }
            this.registerInfo= {
                CellPhone: '',
                Code: ''
            }
        }
    }
}
</script>
<style scoped>
    .login {
        text-align: center;
    }
    .name {
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
    }
</style>


