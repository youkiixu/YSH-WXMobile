<template >
<view :style="{'height': '100%'}">
  <view class="add-address" >
      <view class="add-form">
          <view class="form-item">
              <input class="input"  placeholder="姓名" v-model="address.ShipTo" auto-focus/>
          </view>
          <view class="form-item">
              <input class="input"  v-model="address.Phone" placeholder="手机号码"/>
          </view> 
          <view class="form-item">
              <input class="input" :value="address.RegionFullName" disabled="true" @click="chooseRegion" placeholder="省份、城市、区县"/>
          </view>
          <view class="form-item">
              <input class="input"  v-model="address.Address" placeholder="详细地址, 如街道、楼盘号等"/>
          </view>
          <view class="form-default" v-if="address.Id">
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">设为默认地址</div>
                <div class="weui-cell__ft">
                    <switch :checked="address.IsDefault"  @change="bindIsDefault('IsDefault')"/>
                </div>
            </div>
          </view>
          <view class="form-default" v-if="address.Id">
            <div class="weui-cell weui-cell_switch">
                <div class="weui-cell__bd">设为印捷配送默认地址</div>
                <div class="weui-cell__ft">
                    <switch :checked="address.IsYJDefault"  @change="bindIsDefault('IsYJDefault')"/>
                </div>
            </div>
          </view> 
      </view>
      <view class="btns">
          <button class="cannel" @click="cancelAddress">取消</button>
          <button class="save" @click="saveAddress">保存</button>
      </view>
      <view class="region-select" v-if="openSelectRegion">
        <view class="hd">
          <view class="region-selected">
            <!-- <view :class="['item', { selected: item.id === selectRegionId }]"
            @click="selectRegionType(item , index)"  v-for="(item, index) of selectRegionList" :key="index">
              {{item.name}}
            </view> -->
            <view :class="['item', { selected: regionChina.id === selectRegionId }]" @click="selectRegionType('China' , -1)">
              {{regionChina.name}}
            </view>
            <view :class="['item', { selected: regionProvince.id === selectRegionId }]" @click="selectRegionType('Province' , 0)">
              {{regionProvince.name}}
            </view>
            <view :class="['item', { selected: regionCity.id === selectRegionId }]" @click="selectRegionType('City' , 1)">
              {{regionCity.name}}
            </view>
            <view :class="['item', { selected: regionArea.id === selectRegionId }]" @click="selectRegionType('Area' ,2)">
              {{regionArea.name}}
            </view>
            <view :class="['item', { selected: regionStreet.id === selectRegionId }]" @click="selectRegionType('Street' , 3)">
              {{regionStreet.name}}
            </view>
          </view>
          <view :class="regionStreet.id != undefined ? 'done' : 'disabled done'" @click="doneSelectRegion">确定</view>
        </view>
        <view class="bd">
          <view class="region-list">
            <view :class="item.selected ? 'selected item' : 'item'" @click="selectRegion(item)"
            v-for="(item, index) of regionList" :key="index">{{item.name}}</view>
          </view>
        </view>
      </view>
  </view>
  <view class="bg-mask" @click="cancelSelectRegion" v-if="openSelectRegion"></view>
</view>
</template>

<script>
import api from '@/utils/api'
import wx from 'wx'
import util from '@/utils/util'
import { mapState  , mapActions } from 'vuex'

export default {
  data () {
    return {
      address: {},
      addressId: 0,
      openSelectRegion: false,
      selectRegionId : 0,
      selectRegionList: [{
        name : '省',
        id: 0,
        parent: 0
      }],
      regionType: 0,
      regionList: [],

      selectRegionDone: false,
      regionChina: {
        name : '全国',
        id: 0
      },
      regionProvince: {
        name : '省'
      },
      regionCity: {
        name: '城市'
      },
      regionArea: {
        name: '区'
      },
      regionStreet:{
        name: '街道'
      }
    }
  },
  async mounted () {
    
    
  },
  // 每次打开触发，更新数据
  onShow () {
    this.address = {}
    this.regionProvince = {name: '省'}
    this.regionCity = {name: '城市'}
    this.regionArea = {name: '区'}
    this.regionStreet = {name: '街道'}
    this.selectRegionId = 0
    this.regionType = 0 
    if(this.$route.query.address && this.$route.query.address != '{}') {
      this.address = JSON.parse(this.$route.query.address)
      console.log(this.address)
      this.init()
    } else {
      this.address = {}
      this.getRegionList(0)
    }
  },
  computed: {
    ...mapState([
      'userInfo' ,
    ])
  },
  created () {
    // this.$wx.showLoading()
  },
  methods: {
    ...mapActions(['getUserAddressList']),
    // 进来默认选中
    init() {
      const address = this.address
      let RegionIdPath = address.RegionIdPath
      const RegionIdPathArr =  RegionIdPath.split(',')
      // 默认第四级类型
      this.regionType = 4
      // 默认省市区街道
      this.provinceInit({name: address.Province , id : RegionIdPathArr[0]})
      this.cityInit({name: address.City , id : RegionIdPathArr[1]})
      this.areaInit({name: address.Area , id : RegionIdPathArr[2]})
      this.streetInit({name: address.Street , id : RegionIdPathArr[3]})
      // 默认选中第四级别
      this.selectRegionId = RegionIdPathArr[3]
      // 加载街道的数据
      this.getRegionList(RegionIdPathArr[2])
    },
    // 获得对应级别的地市信息
    async getRegionList (regionId) {
      const res = await api.getYinJieRegion({id: regionId});
      this.regionList = res
    },
    // 设置是否为默认地址
    bindIsDefault (type) {
      this.address[type] = !this.address[type]
      console.log(type , this.address[type])
    },
    // 展开地市选择浮窗
    chooseRegion () {
      this.openSelectRegion = !this.openSelectRegion;

    },
    // 选择不同级别的地市信息
    selectRegionType (type , num) {
      var typeItem = `region${type}`
      var typeObj = this[typeItem]
      if(typeObj.id != undefined) {
        this.regionType = num
        this.selectRegion(typeObj , true)
      }
      
    },
    // 点击列表中某一个地市名字
    selectRegion (item , titleClick) {
      // 获取地址类型
      this.regionType++
      if(this.regionType > 4 ) {
        this.regionType = 4
      }
      this.selectRegionId = item.id
      // 如果选到第四级不用加载数据
      if(this.regionType != 4 ) {
        this.getRegionList(item.id)
      }
      if(titleClick != true) {
        switch (this.regionType) {
          case 1:
            this.regionCity = {name: '城市'}
            this.regionArea = {name: '区'}
            this.regionStreet = {name: '街道'}
            this.provinceInit(item)
            break;
          case 2:
            this.regionArea = {name: '区'}
            this.regionStreet = {name: '街道'}
            this.cityInit(item)
            break;
          case 3:
            this.regionStreet = {name: '街道'}
            this.areaInit(item)
            break;
          case 4:
            this.streetInit(item)
            break;
          default:
            break;
        }
      }
    },
    // 点击浮窗的确定
    doneSelectRegion () {
      if(this.regionStreet.id != undefined) {
        this.openSelectRegion = false;
        this.address.RegionFullName = `${this.regionProvince.name} ${this.regionCity.name} ${this.regionArea.name} ${this.regionStreet.name}`
      }
    },
    // 读取省
    provinceInit(item) {
      this.regionProvince = item
    },
    // 读取城市
    cityInit(item) {
      this.regionCity = item
    },
    // 读取区
    areaInit(item) {
      this.regionArea = item
    },
    // 去读街道
    streetInit(item) {
      this.regionStreet = item
    },
    // 点击浮窗的背景遮罩，取消地市选择
    cancelSelectRegion () {
      this.openSelectRegion = false;
      // this.regionType = this.regionDoneStatus ? 3 : 1;
    },
    // 点击底部“取消按钮”退出本页面
    cancelAddress () {
      this.$router.back()
    },
    // 点击底部“保存按钮”保存地址
    async saveAddress () {
      const _this = this
      const openId = wx.getStorageSync('openId')
      let address = this.address;
      if (address.ShipTo === '') {
        this.$wx.showErrorToast('请输入姓名');
        return false;
      }
      if (address.Phone === '') {
        this.$wx.showErrorToast('请输入手机号码');
        return false;
      }
      if (this.regionStreet.id == undefined) {
        this.$wx.showErrorToast('请完善四级地址');
        return false;
      }
      if (address.Address === '') {
        this.$wx.showErrorToast('请输入详细地址');
        return false;
      }
      
      var par = {
        UserId: this.userInfo.Id,
        ShipTo: address.ShipTo,
        Phone: address.Phone,
        RegionId: this.regionStreet.id,
        Address: address.Address
      }
      if(address.Id) {
        // 如果平台默认
        par = Object.assign(par , {IsDefault : address.IsDefault ? 1 : 0})
        // 印捷默认
        par = Object.assign(par , {IsYJDefault  : address.IsYJDefault ? 1 : 0})
        par = Object.assign(par , {Id : address.Id , rowState: 'M'})
      } else {
        par = Object.assign(par , { Id : 0 , rowState: null})
      }
      

      const res = await api.modifyUserAddress(par);
      if(res.success) {
        this.$wx.showSuccessToast('保存成功')
        this.getUserAddressList(this.userInfo.Id)
        setTimeout(() => {
          _this.$router.back()
        }, 1000);
      } else {
        this.$wx.showErrorToast('保存失败')
      }
      
    }
  },
  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'xbyjShop',
      desc: '仿网易严选小程序商城',
      path: '/pages/ucenter/addressAdd'
    }
  }
}
</script>

<style scoped>
page{
    height: 100%;
    background: #f1f1f1;
}
.add-address .add-form{
    
    width: 100%;
    height: auto;
    overflow: hidden;
}

.add-address .form-item{
    height: 100rpx;
    background: #fff;
    padding-left: 31.25rpx;
    border-bottom: 1px solid #d9d9d9;
    display: flex;
    align-items: center;
    padding-right: 31.25rpx;
}

.add-address .input{
    flex: 1;
    height: 44rpx;
    line-height: 44rpx;
    overflow: hidden;
}

.add-address .form-default{
  margin-top: 20rpx;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    /* height: 75rpx; */
    /* background: #fafafa; */
    /* padding-top: 28rpx; */
    /* font-size: 28rpx; */
}

.default-input{
    margin: 0 auto;
    display: block;
    width: 240rpx;
    height: 40rpx;
    padding-left: 50rpx;
    line-height: 40rpx;
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 1rpx -448rpx no-repeat;
    background-size: 38rpx 486rpx;
    font-size: 28rpx;
}

.default-input.selected{
    background: url(http://yanxuan.nosdn.127.net/hxm/yanxuan-wap/p/20161201/style/img/sprites/checkbox-sed825af9d3-a6b8540d42.png) 0 -192rpx no-repeat;
    background-size: 38rpx 486rpx;
}

.add-address .btns{
    position: fixed;
    bottom: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    height: 100rpx;
    width: 100%;
}

.add-address .cannel,.add-address .save{
    flex: 1;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 28rpx;
    border:none;
    border-radius: 0;
}

.add-address .cannel{
    background: #e3fffe;
    color: #009e96;
}

.add-address .save{
    background: #009e96;
    color: #fff;
}


.region-select{
  width: 100%;
  height: 600rpx;
  background: #fff;
  position: fixed;
  z-index: 10;
  left:0;
  bottom: 0;
}

.region-select .hd{
  height: 108rpx;
  width: 92%;
  border-bottom: 1px solid #f4f4f4;
  padding: 46rpx 30rpx 0 30rpx;
}

.region-select .region-selected{
  float: left;
  height: 60rpx;
  display: flex;
}

.region-select .region-selected .item{
  max-width: 140rpx;
  margin-right: 30rpx;
  text-align: left;
  line-height: 60rpx;
  height: 100%;
  color: #333;
  font-size: 28rpx;
  overflow: hidden;
      text-overflow: ellipsis;
    white-space: nowrap;
}

.region-select .region-selected .item.disabled{
  color: #999;
}

.region-select .region-selected .item.selected{
  color: #b4282d;
}

.region-select .done{
  float: right;
  height: 60rpx;
  width: 60rpx;
  border: none;
  background: #fff;
  line-height: 60rpx;
  text-align: center;
  color: #333;
  font-size: 28rpx;
}

.region-select .done.disabled{
  color: #999;
}



.region-select .bd{
  height: 492rpx;
  width: 100%;
  padding: 0 30rpx;
  overflow-y: auto;
}

.region-select .region-list{
  height: auto;
  overflow: scroll;

}

.region-select .region-list .item{
  width: 100%;
  height: 104rpx;
  line-height: 104rpx;
  text-align: left;
  color: #333;
  font-size: 28rpx;
}

.region-select .region-list .item.selected{
  color: #b4282d;
}


.bg-mask{
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  top:0;
  left:0;
  z-index: 8;
}

</style>
