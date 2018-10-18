<template >



<view class="container">
    <!-- <view class="add-address clear" @click="addressAddOrUpdate" data-address-id="0">
      <text class="t">添加新的地址</text>
    </view> -->
   <view class="address-list" v-if="addressList.length">
        <view class="item" v-for="(item, index) of addressList" :key="item.Id"  :data-index="index" :data-address-id="item.Id" @click="addressAddOrUpdate">
            <view class="name"><text class="t">{{item.ShipTo}}</text><text class="phone">{{item.Phone}}</text></view>
            <view class="address-info">
              <view class="info-icon">
                <img src="/static/images/location.png" background-size="cover"/>
              </view>
              <view class="info-txt">
                <text class="default" v-if="item.IsDefault">平台默认</text>
                <!-- <text class="default" v-if="item.IsYJDefault">印捷默认</text> -->
                <text>{{item.Province +' '+  item.City +' '+ item.Area +' '+ item.Street +' '+ item.Address }}</text>
              </view>
              <view class="info-edit" @click.stop="deleteAddress" :data-address-id="item.Id">删除</view>
            </view>
        </view>
    </view>

    <!-- <view class="address-list" v-if="addressList.length">
        <view class="item" v-for="(item, index) of addressList" :key="item.Id" @click="addressAddOrUpdate"
          :data-address-id="item.Id" :data-index="index">
            <view class="l">
                <view class="name">{{item.ShipTo}}</view>
                <view class="default" v-if="item.IsDefault">默认</view>
                
            </view>
            <view class="c">
                <view class="mobile">{{item.Phone}}</view>
                <view class="address">{{item.Province + item.City + item.Area + item.Street + item.Address }}</view>
            </view>
            <view class="r"> 
                <image @click.stop="deleteAddress" :data-address-id="item.Id" class="del" src="/static/images/del-address.png"/>
            </view>
        </view>
    </view> -->

    <view class="empty-view" v-if="addressList.length <= 0">
      <image class="icon" src="http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/noAddress-26d570cefa.png"/>
      <text class="text">收货地址在哪里</text>
    </view>
    
    <view class="add-address"  @click="addressAddOrUpdate" data-address-id="0">新建</view>
</view>
</template>

<script>
import api from '@/utils/api'
import { mapState , mapMutations , mapActions } from 'vuex'
import wx from 'wx'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'userInfo' ,
      'addressList'
    ])
  },
  async onShow () {
    await Promise.all([
      this.getAddressList()
    ])
  },
  methods: {
    ...mapActions(['getUserAddressList']),
    // 获取地址信息
    async getAddressList () {
      this.getUserAddressList(this.userInfo.Id);
    },
    // 点击修改，或者点击底部“新建”
    async addressAddOrUpdate (event) {
      var addressId = event.currentTarget.dataset.addressId
      var par = {}
      if(addressId != 0) {
        const res = await api.getSassUserAddress({ Id: addressId , UserId: this.userInfo.Id});
        const data = JSON.parse(res.data)
        par = data[0];
      }
      this.$router.push({path: '../ucenter/addressAdd' , query: {address: JSON.stringify(par)}})
    },
    // 点击删除图标
    async deleteAddress (event) {
      // console.log('点击删除', event)
      let that = this;
      wx.showModal({
        title: '',
        content: '确定要删除地址？',
        success: async function (res) {
          if (res.confirm) {
            let addressId = event.target.dataset.addressId;
            const res = await api.ModifySassUserAddress({ Id: addressId , rowState : 'D'});
              that.getUserAddressList(that.userInfo.Id);
          }
        }
      })
      return false;
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活',
      path: '/pages/ucenter/address'
    }
  }
}
</script>

<style scoped>
page{
    height: 100%;
    width: 100%;
    background: #f4f4f4;
}

.container{
  height: 100%;
  width: 100%;
}
 .clear:after{
    display: block;
    content:'';
    clear: both;
    height:0;
    }
/* .add-address{
  height: 80rpx;
  width: 750rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 24rpx;
  color: #000;
  padding: 0 20rpx;
  box-sizing: border-box;
}
.add-address .t{
  width: 150rpx;
  float: right;
} */

.address-list{
    padding: 30rpx 20rpx;
    box-sizing: border-box;
    background: #fff url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/icon-normal/address-bg-bd30f2bfeb.png) 0 0 repeat-x;
    background-size: auto 10.5rpx;
    margin-bottom: 90rpx;
    width: 100%;
}

.address-list .item{
    padding: 20rpx 0 20rpx 0;
}
.address-list .name .t{
    font-size: 28rpx;
    color: #000;
    margin-left: 60rpx;
}
.address-list .name .phone{
  font-size: 24rpx;
  color: #898989;
  margin-left: 20rpx;
}
.address-info{
  display: -webkit-box;
  display: -webkit-flex;
  margin-top: 10rpx;
}
.address-info .info-icon{
  width: 45rpx;
  height: 50rpx;
  margin-top: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.address-info .info-icon img{
  width: 35rpx;
  height: 40rpx;
  text-align: center;
}
.address-info .info-txt{
  flex: 1;
  font-size: 28rpx;
  color: #000;
  width: 550rpx;
  line-height: 40rpx;
  margin-left: 15rpx;
}
.address-info .info-edit{
  width: 88rpx;
  height: 40rpx;
  color: #898989;
  font-size: 24rpx;
  text-align: center;
  line-height: 40rpx;
  margin-left: 20rpx; 
  border-left: 2rpx solid #c9caca;
}
.address-list .default{
    width: 77rpx;
    height: 30rpx;
    line-height: 30rpx;
    text-align: center;
    font-size: 26rpx;
    color: #009e96;
    margin-right: 20rpx;
    background-color: #c7eae8;
    visibility: visible;
    padding: 4rpx;
}
.add-address{
  height: 80rpx;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  text-align: center;
  line-height: 80rpx;
  background-color: #009e96;
  color: #fff;
  font-size: 28rpx;
}




.address-list .c{
    flex: 1;
    height: auto;
    overflow: hidden;
}

.address-list .mobile{
    height: 29rpx;
    font-size: 29rpx;
    line-height: 29rpx;
    overflow: hidden;
    color: #333;
    margin-bottom: 6.25rpx;
}

.address-list .address{
    height: 37rpx;
    font-size: 25rpx;
    line-height: 37rpx;
    overflow: hidden;
    color: #666;
}

.address-list .r{
    width: 52rpx;
    height: auto;
    overflow: hidden;
    margin-right: 16.5rpx;
}

.address-list .del{
    display: block;
    width: 52rpx;
    height: 52rpx;
}

/* .add-address{
    background: #b4282d;
    text-align: center;
    width: 100%;
    height: 99rpx;
    line-height: 99rpx;
    position: fixed;
    border-radius: 0;
    border: none;
    color: #fff;
    font-size: 29rpx;
    bottom: 0;
    left:0;
} */

.empty-view{
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-view .icon{
  height: 248rpx;
  width: 258rpx;
  margin-bottom: 10rpx;
}

.empty-view .text{
  width: auto;
  font-size: 28rpx;
  line-height: 35rpx;
  color: #999;
}
</style>
