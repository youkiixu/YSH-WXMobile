<template >
<div class="container">

  <div class="profile-info clear" >
    <div class="user_info clear" v-if="userInfo.Id">
      <div class="user_info_img" >
        <img :src="userInfo.WXHeadImage ? userInfo.WXHeadImage : userInfo.photo ? baseUrl+userInfo.photo : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png'" />
      </div>
      <div class="user_info_txt">
        <div class="info_name">{{userInfo.WXNick ? userInfo.WXNick : userInfo.UserName}}</div>
        <div class="info_member">{{userInfo.GradeName ? userInfo.GradeName : '大众会员'}}</div>
      </div>
    </div>

     <div v-else class="user_info clear">     
      <div class="user_info_img NotLogged">
        <img class="icon" src="/static/images/ic_menu_me_pressed.png"/>
      </div>
      <div class="user_info_txt">
        <button v-if="canIUse" open-type="getUserInfo"  @getuserinfo="goLogin" class="goLoginBtn" >点击，授权登录~</button>   
      </div>
      </div>

    <div class="set" v-if="userInfo.Id" @click="logOut">
      <img src="/static/images/ic_me_set.png"/>
    </div>
  </div>
  <div class="myOrder">
      <div class="h clear">
          <navigator url="/orderPages/order">
              <text class="t">我的订单</text>
              <text class="i">查看全部订单</text>            
          </navigator>
      </div>
      <div class="myOrder_con">
        <navigator class="con_item" @click="toOrderList('WaitPay')">
          <img src="/static/images/ic_me_pay.png"/>
          <text class="item_t">待付款</text>
        </navigator>
        <navigator class="con_item" @click="toOrderList('WaitDelivery')">
          <img src="/static/images/ic_me_deliver.png"/>
          <text class="item_t">待发货</text>
        </navigator>
        <navigator class="con_item" @click="toOrderList('WaitReceiving')">
          <img src="/static/images/ic_me_collect.png"/>
          <text class="item_t">待收货</text>
        </navigator>
        <navigator class="con_item" @click="toOrderList('Finish')">
          <img src="/static/images/ic_me_complete.png"/>
          <text class="item_t">已完成</text>
        </navigator>
      </div>

  </div>

  <navigator url="../cart/cart" open-type="switchTab" class="ShoppingCar list clear">    
        <div class="t">购物车</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </navigator>
  <navigator url="../../addressPages/address" class="address list clear">    
        <div class="t">地址管理</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </navigator>
  <navigator url="../ucenter/collect" class="collection list clear">    
        <div class="t">我的收藏</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </navigator>
  <div class="service list clear" @click="toSelectChat">    
        <div class="t">聊天记录</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </div>
   <!-- <div class="integral list clear" @click="noEvent">    
        <div class="t">我的积分</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </div> -->
   <!-- <div class="footprint list clear" @click="noEvent">    
        <div class="t">我的足迹</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </div> -->
   
   
  <button v-if="userInfo.Id" open-type="getUserInfo"  @getuserinfo="switchAccount " class="ShoppingCar list clear">    
        <div class="t" style="text-align:left;">切换账号</div>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </button>

</div>
</template>

<script>
import wx from 'wx';
import api from '@/utils/api'
import user from '@/services/user'
import { mapState, mapActions , mapMutations } from 'vuex'
var app = getApp();

export default {
  data () {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      isSeller: true,
      shopName: ''
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    baseUrl() {
        return this.$wx.baseUrl
    }
  },
  mounted () {
    // this.getUserShopInfo()
  },
  methods: {
    ...mapActions([
      'sassLogin'
    ]),
    ...mapMutations ([
      'setUserInfo',
      'setUserAddressList',
      'setWxUserInfo'
    ]),
    // 根据用户OpenId获取是否有店铺信息
    // async getUserShopInfo () {
    //   const hideOpenId = wx.getStorageSync('hideOpenId')
    //   const res = await api.getUserShopInfo({openId : hideOpenId})
    //   if(res.data) {
    //     this.isSeller = true
    //     this.shopName = res.data.ShopName
    //   }
    // },
    // 客服选择，去到聊天记录页
    async toSelectChat () {

      const hideOpenId = wx.getStorageSync('hideOpenId')
      
    
      this.$router.push({
          path: '../../wxchat/userList',
          query: {
            //userList:JSON.stringify(res.data),
            strFromOpenId:hideOpenId,
          }
        })
        //this.$wx.showLoading('正在加载...')
      //const res = await api.getMyFriendList({strFromOpenId: hideOpenId})
      //this.$wx.hideLoading()
      // if(res.success) { 
      //   this.$router.push({
      //     path: '../../wxchat/userList',
      //     query: {
      //       userList:JSON.stringify(res.data),
      //     }
      //   })
      // }
    },
    switchAccount (isLogin) {
      var _this = this;
      if(isLogin.mp.detail.rawData) {
        this.setWxUserInfo(JSON.parse(isLogin.mp.detail.rawData))
      }
      _this.$router.push({
        path: 'login' 
      })
    },
    // 点击登陆
    goLogin (isLogin) {
      var _this = this
      let openId = ''
        // 获取微信用户信息
      if(isLogin.mp.detail.rawData) {
        this.setWxUserInfo(JSON.parse(isLogin.mp.detail.rawData))
      }

      _this.$wx.showLoading()
      user.loginByWeixin().then(res => {
        _this.$wx.hideLoading()
        openId = res.openId
        _this.sassLogin({
          openId: openId
        }).then(res => {
          // 登录成功,将openId存起来
          // wx.setStorageSync('openId', openId);
        }).catch(err => {
          // 如果没有这个账号，则登录失败，跳登陆页
          _this.$router.push({
            path: 'login'
          })
        })
      }).catch((err) => {
        _this.$wx.hideLoading()
        _this.$wx.showErrorToast('网络异常')
      });
    },
    // 去详情页
    toOrderList(orderStatus) {
      this.$router.push({
        path: '/orderPages/order',
        query: {
          orderStatus: orderStatus
        }
      })
    },
    // 退出登陆
    async logOut () {
      var _this = this;
      wx.showModal({
        title: '',
        content: '退出登录?',
        success: async function (res) {
          if (res.confirm) {
            const openId = wx.getStorageSync('openId')
            const res = await api.loginOut({openId :openId})
            if(res.success) {
              // 清空缓存
              _this.setUserInfo({})
              _this.setUserAddressList([])
              wx.removeStorageSync('openId')
            }
          }
        }
      })
    },
    noEvent () {
      this.$wx.showErrorToast('暂未开放!')
    },
    onPullDownRefresh: function() {
      // this.refresh()
      wx.stopPullDownRefresh()
    }

  }
}
</script>

<style scoped>
page{
    height: 100%;
    width: 100%;
    background: #f1f1f1;
}
.container{
    background: #f1f1f1;
    height: auto;
    overflow: hidden;
    width: 100%;
}
 .clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
.profile-info{
    width: 100%;
    height: 240rpx;
    text-align: center;
    /* display: flex; */
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    padding: 0 20rpx;
    box-sizing: border-box;
    background: #fff;
}
.user_info{
  width: 80%;
  height: 100%;
  float: left;
  padding: 40rpx 0;
  box-sizing: border-box;
}
.user_info .user_info_img{
  width: 160rpx;
  height: 160rpx;
  float: left;
  border-radius: 50%;
  overflow: hidden;
}
.user_info_img img{
  width: 160rpx;
  height: 160rpx;
  text-align: center;
}
.user_info_txt{
  float: left;
  margin-left: 20rpx;
  color: #000;
  font-size: 28rpx;
  padding: 30rpx 0;
  box-sizing: border-box;
}
 button::after{ 
    border: none;
    border-radius: 0;
} 
.NotLogged{
  width: 100rpx;
  height: 100rpx;
}
.NotLogged img{
  width: 120rpx;
  height: 120rpx;
}
.user_info_txt button{
  color: #000;
  font-size: 28rpx;
  background-color: transparent;
}
.info_member{
  height: 30rpx;
  width: 105rpx;
  text-align: center;
  line-height: 30rpx;
  font-size: 20rpx;
  color: #fff;
  background-color: #dcae71;
  background: linear-gradient(to right,#ecc183, #c79558);
  border-radius: 5rpx;
  margin-top: 5rpx;
}
.profile-info .set{
  width: 12%;
  height: 100%;
  float: right;
}
.set img{
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  margin-top: 4rpx;
}
.myOrder{
  height: 240rpx;
  width: 100%;
  margin-top: 20rpx; 
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #fff;
}
.myOrder .h {
  width: 750rpx;
  height: 75rpx;
  line-height: 75rpx;
  background-color: white;
}

.myOrder .h .t {
  display: block;
  float: left;
  font-size: 28rpx;
  color: #111111;
}

.myOrder .h .i {
  display: block;
  float: right;
  font-size: 22rpx;
  text-align: right;
  padding-right: 80rpx;
  color: #c5c5c5;
  background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/address-right-990628faa7.png) right center no-repeat;
  background-size: 45rpx;
  background-position: 78% 48%;
}
.myOrder_con{
  width: 100%;
  height: 165rpx;
  padding: 35rpx 0;
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
}
.con_item{
  flex: 1; 
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.con_item img{
  width: 44rpx;
  height: 44rpx;
  
}
.con_item .item_t{
  display: block;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #333;
}
.ShoppingCar{
  margin-top: 20rpx;
}
.list {
  width: 750rpx;
  height: 85rpx;
  background: #fff;
  padding: 0 20rpx;
  box-sizing: border-box; 
}

.list .t {
  float: left;
  width: 600rpx;
  height: 85rpx;
  line-height: 85rpx;
  font-size: 28rpx;
  color: #111111;
 
}
.list .i {
  float: right;
  width: 44rpx;
  height: 44rpx;
  margin-top: 20rpx;
}
.address{
  margin-top: 20rpx;
}
.list{
  border-top: 2rpx solid #f1f1f1;
}
.list:nth-child(0),list:nth-child(1){
  border: none;
}
</style>
