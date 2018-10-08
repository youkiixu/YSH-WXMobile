<template >
<view class="container">

  <view class="profile-info clear">
    <view class="user_info clear" v-if="userInfo.Id">
      <view class="user_info_img">
        <img :src="baseUrl+userInfo.photo" @click="goLogin(true)"/>
      </view>
      <view class="user_info_txt">
        <view class="info_name">{{userInfo.UserName}}</view>
        <view class="info_member">金牌会员</view>
      </view>
    </view>

     <view v-else class="user_info clear">     
      <view class="user_info_img NotLogged">
        <img class="icon" src="/static/images/ic_menu_me_pressed.png"/>
      </view>
      <view class="user_info_txt">
        <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="goLogin" class="goLoginBtn" >点击，授权登录~</button>   
      </view>
      </view>
      
    <view class="set">
      <img src="/static/images/ic_me_set.png"/>
    </view>
  </view>
  <view class="myOrder">
      <view class="h clear">
          <navigator>
              <text class="t">我的订单</text>
              <text class="i">查看全部订单</text>            
          </navigator>
      </view>
      <view class="myOrder_con">
        <view class="con_item">
          <img src="/static/images/ic_me_pay.png"/>
          <text class="item_t">待付款</text>
        </view>
        <view class="con_item">
          <img src="/static/images/ic_me_deliver.png"/>
          <text class="item_t">待发货</text>
        </view>
        <view class="con_item">
          <img src="/static/images/ic_me_collect.png"/>
          <text class="item_t">待收货</text>
        </view>
        <view class="con_item">
          <img src="/static/images/ic_me_complete.png"/>
          <text class="item_t">已完成</text>
        </view>
      </view>

  </view>

  <view class="ShoppingCar list clear">    
        <view class="t">购物车</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </view>
  <view class="collection list clear">    
        <view class="t">我的收藏</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </view>
   <view class="integral list clear">    
        <view class="t">我的积分</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </view>
   <view class="footprint list clear">    
        <view class="t">我的足迹</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </view>
   <view class="address list clear">    
        <view class="t">地址管理</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </view>
   <view class="service list clear">    
        <view class="t">售后客服</view>
        <img class="i" src="/static/images/address_right.png" background-size="cover"/>       
  </view>

</view>
<!-- <view class="container">
  <view class="profile-info">
    <view v-if="userInfo.Id" >
      <img class="avatar" :src="baseUrl+userInfo.photo" @click="goLogin(true)"/>
      <view class="info">
        <text class="name">{{userInfo.UserName}}</text>
      </view>
    </view>
    <view v-else class="goLogin">
      <img class="icon" src="/static/images/ic_menu_me_pressed.png"/>
      <button v-if="canIUse" open-type="getUserInfo" @getuserinfo="goLogin" class="goLoginBtn" >点击，授权登录~</button>
    </view>
  </view>

  <view class="user-menu">
    <view class="item">
      <navigator url="/pages/ucenter/order" class="a">
        <text class="icon order"></text>
        <text class="txt">我的订单</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/coupon" class="a">
        <text class="icon coupon"></text>
        <text class="txt">优惠券</text>
      </navigator>
    </view>
    <view class="item no-border">
      <view class="a">
        <text class="icon gift"></text>
        <text class="txt">礼品卡</text>
      </view>
    </view>
    <view class="item">
      <navigator url="/pages/ucenter/collect" class="a">
        <img class="icon" src="/static/images/icon_collect.png"/>
        <text class="txt">我的收藏</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="../ucenter/footprint" class="a">
        <img class="icon" src="/static/images/footprint.png"/>
        <text class="txt">我的足迹</text>
      </navigator>
    </view>
    <view class="item no-border">
      <view class="a">
        <img class="icon" src="/static/images/VIP.png"/>
        <text class="txt">会员福利</text>
      </view>
    </view>
    <view class="item">
      <navigator url="../ucenter/address" class="a">
        <text class="icon address"></text>
        <text class="txt">地址管理</text>
      </navigator>
    </view>
    <view class="item">
      <view class="a">
        <text class="icon security"></text>
        <text class="txt">账号安全</text>
      </view>
    </view>
    <view class="item no-border">
      <view class="a">
        <text class="icon kefu"></text>
        <text class="txt">联系客服</text>
      </view>
    </view>
    <view class="item item-bottom">
      <view class="a">
        <text class="icon help"></text>
        <text class="txt">帮助中心</text>
      </view>
    </view>
    <view class="item item-bottom">
      <navigator url="../ucenter/feedback" class="a">
        <text class="icon feedback"></text>
        <text class="txt">意见反馈</text>
      </navigator>
    </view>
    <view class="item">
      <navigator url="../ucenter/express" class="a">
        <img class="icon" src="/static/images/car.png"/>
        <text class="txt">物流查询</text>
      </navigator>
    </view>
  </view>
  <view v-if="userInfo.avatar" class="logout" @click="exitLogin">退出登录</view>
</view> -->
</template>

<script>
import wx from 'wx';
// import getCurrentPages from 'wxFunction';
import user from '@/services/user';
import { mapState, mapActions } from 'vuex'
var app = getApp();

export default {
  data () {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo')
    }
  },
  onShow () {

  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    baseUrl() {
        return this.$wx.baseUrl
    }
  },
  methods: {
    ...mapActions([
      'sassLogin'
    ]),
    // 点击登陆
    goLogin (isLogin) {
      var _this = this;
      if(isLogin === true) {
        // 点击头像进入
        this.$router.push({
            path: 'login'
          })
      } else {
        _this.$wx.showLoading()
        user.loginByWeixin().then(res => {
          _this.$wx.hideLoading()
          _this.sassLogin().then(res => {

          }).catch(err => {
            this.$router.push({
              path: 'login'
            })
          })
          
        }).catch((err) => {
          _this.$wx.hideLoading()
          console.log('登陆失败', err)
        });
      }

    },
    
    // 退出登陆
    exitLogin () {
      wx.showModal({
        title: '',
        confirmColor: '#b4282d',
        content: '退出登录？',
        success: function (res) {
          if (res.confirm) {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            wx.switchTab({
              url: '/pages/ucenter/index',
              success: function (e) {

              }
            });
          }
        }
      })
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
  border-radius: 80rpx;
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
  padding: 0 12rpx;
  line-height: 30rpx;
  font-size: 20rpx;
  color: #fff;
  background-color: #dcae71;
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
  padding-right: 60rpx;
  color: #c5c5c5;
  background: url(http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/address-right-990628faa7.png) right center no-repeat;
  background-size: 45rpx;
  background-position: 85% 48%;
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
.collection{
  margin-top: 20rpx;
}
.list{
  border-top: 2rpx solid #f1f1f1;
}
.list:nth-child(0),list:nth-child(1){
  border: none;
}
</style>
