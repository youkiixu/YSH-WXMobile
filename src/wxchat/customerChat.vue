<template>
    <div>
        <!-- 选择客服页面 -->
        <form report-submit="true" v-if="isSelect" @submit="selectCustomer">
            <div  class="select-content" >
                <button class="select-customer" v-for="(item , index) in sellers" :key="index" formType="submit" :data-id="index" >
                    <img class="imgs" :src="item.strHeadIcon ? item.strHeadIcon : 'http://kiy.cn/Areas/Wxmobile/Content/img/online-service.png'" />
                    <text class="name type">{{item.strUserText}}</text>
                    <text class="name">{{item.strUserName}}</text>

                </button>
            </div>
        </form>
        <!-- 聊天页面 -->
        <div class="chat" :style="{'height' : height + 'px'}" v-if="!isSelect">
            <scroll-view scroll-y='true' :scroll-top="chatValHeight"  class="chat-content" :style="{'height': chatHeight + 'px'}" @scrolltoupper="scrolltoupper">
                <div v-for="(item , index) in wxchatLists" :key="index">
                    <div class="chat-content-list-time">{{item.msg_type != 'product' ? item.dataTime : productInfo.productName}}</div>
                    <div :class="item.type ? 'chat-content-list right' : 'chat-content-list'" >
                        <img class="chat-content-list-avatar "  :src="item.userImgSrc" />
                        <div class="chat-content-list-content " @longtap="delMsg" :data-index="index">
                            <!--  文字信息模板  ↓ hidden="{{!(item.msg_type === 'text')}}" -->
                            <div class="chat-content-list-msg"  :hidden="!(item.msg_type === 'text')"> 
                                <text selectable='true'>{{item.textMessage}}</text>
                                <div class='over-read-tip '></div>
                            </div>

                        </div>
                        <!-- 产品模板 -->
                        <div class="img-info clear" v-if="item.msg_type === 'product'">
                            <img class="img" :src="productInfo.imgUrl" />
                            <div class="info">
                                <div class="c">
                                    <div class="p" ><text class="p-icon">￥</text>{{productInfo.price}}</div>
                                    <div class="s" v-if="!productInfo.isCustom">数量：{{productInfo.number}}</div>
                                    <div class="a">已选：<text>{{productInfo.skuName}}</text></div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </scroll-view>
            <chatInput @onSend="onSend"></chatInput>
        </div>
    </div>
</template>
<script>
import util from '@/utils/util'
import api from '@/utils/api'
import chatInput from "@/components/chat-input/chatInput";
import {mapState} from 'vuex'

let TIMER = null;

export default {
    components: {
        chatInput
    },
    data () {
        return {
            wxchatLists: [],
            friendHeadUrl: '',
            // textMessage: '',
            chatItems: [],
            scrollTopTimeStamp: 0,
            height: 0,  //屏幕高度
            chatHeight: 0,
            chatValHeight:0,//聊天屏幕高度
            normalDataTime:'',
            productInfo: {},
            sellers: [],
            isSelect: true,
            sendToId: '',
            sendToName: '',
            sendToGroupCode: '',
            formId: '',
            isInit: false,
            canSend: true
        }
    },
    computed: {
        baseUrl () {
            return this.$wx.baseUrl
        },
        ...mapState([
            'userInfo'
        ])
    },
    async mounted () {
        if(this.$route.query.data) {
            this.productInfo = JSON.parse(this.$route.query.data)
        }
        if(this.$route.query.sellers) {
            this.sellers = JSON.parse(this.$route.query.sellers)
        }
    },
    methods: {
        initData: function () {
            let that = this;
            let systemInfo = wx.getSystemInfoSync();
            that.height = systemInfo.windowHeight
            that.chatHeight = systemInfo.windowHeight- 55
            wx.setNavigationBarTitle({
                title: this.sendToName
            })
            this.isInit = true
        },
        async setSaaSTalkOnOffLine (onLineOffLine) {
            const hideOpenId = wx.getStorageSync('hideOpenId')
            let par = {
                "strType": onLineOffLine,
                "bCustomer": true,
                "strOpenId": hideOpenId,
                "strGroupCode": this.sendToId
            }
            this.$wx.showSuccessToast(onLineOffLine)
            const res = await api.setSaaSTalkOnOffLine(par)
        },
        async listenMsg(time) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            // 如果是第一次聊天，是没有上一次的聊天记录的，读取默认历史消息
            if(!this.wxchatLists.length) {
                this.loadHistory()
                return
            }
            if(!this.canSend) return
            this.canSend = false
            const res = await api.saaSTalkRecordList({
                rule: '>',
                strFromOpenId: hideOpenId,
                strToOpenId: this.sendToId,
                dCreateTime: this.wxchatLists[this.wxchatLists.length - 1].dataTime,
                strGroupCode: this.sendToId,
                bCustomer: true
            })
            if(res.success) {
                res.data.map(item => {
                    this.renderUI(item)
                })
            }
            this.canSend = true
        },
        // 读取历史消息，不传time默认服务器当前事件之前，传time以time时间为准
        async loadHistory (time) {
            const hideOpenId = wx.getStorageSync('hideOpenId')
            const res = await api.saaSTalkRecordList({
                rule: '<',
                strFromOpenId: hideOpenId,
                strToOpenId: this.sendToId,
                strGroupCode: this.sendToId,
                dCreateTime: time? time : undefined,
                bCustomer: true
            })
            if(res.success) {
                let arr = []
                if(time) {
                    arr = res.data.reverse()
                } else {
                    arr = res.data
                }
                arr.map(item => {
                    this.renderUI(item , time)
                })
            }
        },
        // 发送消息
        async onSend (text) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            var par = {
                bCustomer: true,
                strContent: text,
                strFromOpenId: hideOpenId,
                strFromName: this.userInfo.Id ? (this.userInfo.WXNick ? this.userInfo.WXNick : this.userInfo.UserName) : '客户',
                strToName: this.sendToName,
                strToOpenId: this.sendToId,
                strGroupCode: this.sendToGroupCode
            }
            // 获取路径
            par = Object.assign(par , {
                page: util.getSellerChat(par , this)
            })
            const res = await api.SaaSTalkEachOther(par)
            this.canSend = true
            await Promise.all([
                this.listenMsg()
            ])
        },
        // 渲染ui
        renderUI (item , time) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            var temp = {
                userImgSrc: this.sendToHead,
                textMessage: item.strContent,
                dataTime: item.dCreateTime,
                msg_type: 'text',
                type: item.strFromOpenId === hideOpenId && item.bCustomer,
                item: item
            };
            // type = true 在右边
            if(time) {
                const oldWxchatLists = this.wxchatLists
                let arr = []
                arr.push(temp)
                this.wxchatLists = arr.concat(oldWxchatLists)
            } else {
                this.wxchatLists.push(temp)
                this.setChatHeight()
            }
        },
        loadProduct () {
            var temp = {
                msg_type: 'product',
                type: 1
            };
            this.wxchatLists.push(temp)
            this.setChatHeight()
        },
        setChatHeight() {
            const len = this.wxchatLists.length + 1
            const height = len * 87
            this.chatValHeight = this.chatHeight + height

        },
        // 选中客服
        async selectCustomer(item) {
            const DETAIL = item.mp.detail
            const sendToUser = this.sellers[DETAIL.target.dataset.id]
            this.sendToId = sendToUser.strOpenId
            this.sendToHead = sendToUser.strHeadIcon
            this.sendToName = sendToUser.strUserName
            this.sendToGroupCode = sendToUser.strGroupCode
            this.$wx.showLoading('读取聊天记录')
            await Promise.all([
                this.initData(),
                this.loadHistory(),
                this.setSaaSTalkOnOffLine('onLine')
            ])
            this.timeListenMsg()
            // 加载产品信息
            // this.loadProduct()
            this.$wx.hideLoading()
            this.isSelect = false
            // 保存一次formId
            this.formSubmit(item)


        },
        async formSubmit(e) {
            const formId = e.mp.detail.formId
            const hideOpenId = wx.getStorageSync('hideOpenId')
            if(formId === 'the formId is a mock one' || !hideOpenId) return
            await api.saaSSaveFormId({
                form_id: formId,
                strOpenId: hideOpenId
            })
        },
        // 下拉翻页
        async scrolltoupper (e) {
            this.$wx.showLoading('正在加载')
            await Promise.all([
                this.loadHistory(this.wxchatLists[0].dataTime)
            ])
            this.$wx.hideLoading()
        },
        // 循环读读聊天数据
        timeListenMsg () {
            const _this = this
            TIMER = setInterval(() => {
                if(!_this.wxchatLists.length) {
                    _this.listenMsg()
                } else {
                    _this.listenMsg(_this.wxchatLists[_this.wxchatLists.length-1].dataTime)
                }
            } , 5000)
        }
    },
    onUnload () {
        if(this.isInit) {
            this.setSaaSTalkOnOffLine('offLine')
            clearInterval(TIMER)
        }
    },
    onHide () {
        if(this.isInit) {
            this.setSaaSTalkOnOffLine('offLine')
            clearInterval(TIMER)
        }
    },
    onShow () {
        if(this.isInit) {
            this.setSaaSTalkOnOffLine('onLine')
            this.timeListenMsg()
        }
    }
}
</script>
<style scoped>
.select-content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap ;
    align-content: flex-start;
}
.select-content button{
    border:none;
    background: #fff;
    box-sizing:none;
    padding-right:0;
}
.select-customer {
    padding-top: 25rpx;
    padding-left: 25rpx;
    width: 350rpx;
    height: 150rpx;
    border-radius: 10rpx;
    border: 1rpx solid #ecf0f3;
    /* margin-left: 20rpx; */
    margin-top: 20rpx;
    box-shadow: 4rpx 4rpx 10rpx rgba(0,0,0, .2);

}
.select-customer .imgs {
    float: left;
    height: 100rpx;
    width: 100rpx;
    background: #f4f4f4;
    border-radius: 20rpx;
}
.select-customer .name {
    width: 200rpx;
    float: left;
    display: block;
    margin-left: 10rpx;
    font-size: 28rpx;
    height: 50rpx;
    line-height: 50rpx;
    overflow: hidden;
    text-align: left;
}
.select-customer .type {
    /* width: 135rpx; */
    background: #cccccc;
    border-radius: 50rpx;
    padding: 10rpx;
    line-height:30rpx;
    color: #fafafa;
}
page {
    background-color: #fafafa;
}
view,
textarea,
input,text,
scroll-view{
    box-sizing: border-box;
}
.chat{
    display: flex;
    flex-direction: column;
}
.chat-content{
    -webkit-overflow-scrolling: touch;
}
.chat-content>view:last-child{
  margin-bottom: 50rpx;
}
.chat-content-list{
    display: flex;
    align-items: flex-start;
    padding:0 30rpx;
}
.chat-content-list.right{
    flex-direction: row-reverse;
}
.chat-content-list.right > .chat-content-list-avatar{
    margin-right: 0;
    margin-left: 30rpx;
    display: none;
}
.chat-content-list.right > .chat-content-list-content > .chat-content-list-name{
    margin-right: 16rpx;
    text-align: right;
}
.chat-content-list.right > .chat-content-list-content .chat-content-list-msg{
    margin-left: 0;
    /* margin-right: 14rpx; */
    background: #009e96;
    color: #fff;
}

.chat-content-list-voice{
    padding: 0 0 0 40rpx;
    box-sizing: border-box;
    border-top-left-radius: 43rpx;
    border-top-right-radius: 43rpx;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 43rpx;
    background-color: #009e96;
    font-size: 32rpx;
    color: #fff;
    position: relative;
    /* margin-right: 14rpx; */
    min-width: 200rpx;
    max-width: 332rpx;
    line-height:86rpx;
    font-weight: 300;
    height: 86rpx;
    /* margin-top: 5rpx; */
    /* margin-bottom: 10rpx; */
}
.chat-content-list-voice.length1{
  /* width: 182rpx; */
  width: 200rpx;
}
.chat-content-list-voice.length2{
  width: 262rpx;
}
.chat-content-list-voice.length3{
  width: 332rpx;
}
/*声音语音*/
.chat-voice-img{
  width: 52rpx;
  height: 30rpx;
  float: right;
  margin-right: 40rpx;
  margin-top: 28rpx;
}
.chat-content-list-avatar{
    width: 88rpx;
    height: 88rpx;
    margin-right: 30rpx;
    border-radius: 50%;
}
.chat-content-list-content{
    display: flex;
    flex-direction: column;
    align-items:flex-start;
    min-height: 86rpx;
    max-width: 464rpx;
    line-height: 1.6;
    position: relative;
}
.chat-content-list.right .chat-content-list-content{
    align-items:flex-end;
}
.chat-content-list-msg.yellow {
    background: #ffdb0e;
}
.chat-content-list-name{
    margin-left: 16rpx;
    font-family: MicrosoftYaHei;
    font-size: 24rpx;
    color: #1e1e1e;
    margin-bottom: 6rpx;
}
.chat-content-list-msg{
    padding: 16rpx 40rpx;
    /* border-radius: 5px; */
    border-top-left-radius: 43rpx;
    border-top-right-radius: 43rpx;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 43rpx;
    background-color: #ecf0f3;
    color: #1e1e1e;
    position: relative;
    /* margin-left: 14rpx; */
    max-width:540rpx;
    word-wrap:break-word;
    font-size: 32rpx;
    font-weight: 400;
}
.chat-content-list.right .chat-content-list-msg{
    border-top-left-radius: 43rpx;
    border-top-right-radius: 43rpx;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 43rpx;
}
.chat-set{
    width: 750rpx;
    height: 98rpx;
    background-color: #f7f7fa;
    border-top: 2rpx solid rgba(0,0,0, .2);
    padding: 0 24rpx;
    position: relative;
}
.chat-set-icon{
    width: 60rpx;
    height: 60rpx;
}
.chat-set-icon-right{
    margin-left: 24rpx;
}
.chat-set-input{
    width: 530rpx;
    height: 72rpx;
    border-radius: 10rpx;
    background-color: #ffffff;
    border: solid 2rpx rgba(0,0,0, .2);
    margin-left: 24rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    font-size: 24rpx;
    line-height: 32rpx;
}
.chat-set-voice{
    width: 530rpx;
    height: 72rpx;
    border-radius: 10rpx;
    border: solid 2rpx rgba(0,0,0, .2);
    line-height: 72rpx;
    font-size: 24rpx;
    color: #333;
    text-align: center;
    margin-left: 24rpx;
    
    
}
.chat-set-write{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}
.chat-emoji{
    position: absolute;
    width: 750rpx;
    bottom: 98rpx;
    left: 0;
}
.chat-emoji-list{
    display: inline-flex;
    flex-flow: wrap;
}
.chat-emoji-icon{
    width: 46rpx;
    height: 46rpx;
    padding: 10rpx;
    border-radius: 6rpx;
}
.chat-speaking{
    position: fixed; 
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    background: rgba(2,2,2,.6);
    z-index: 1000;
    width: 300rpx;
    height: 300rpx;
    border-radius: 10rpx;
}
.speaker{ 
    position:absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 120rpx;
    height: 120rpx;
    
} 
.chat-content-list-img{
  width: 440rpx;
  height: 376rpx;
  position: relative;
  border-radius: 43rpx;
  overflow: hidden;
}
.chat-content-list-img image{
  width: 100%;
  height: 100%;
}
.chat-content-list-time{
  display:block;
  text-align: center;
  width: 100%;
  height: 88rpx;
  font-size: 24rpx;
  color: #cccccc;
  float: left;
  padding-top:30rpx;
  box-sizing: border-box;
}
.chat-content-list .chat-content-list-msg-del{
  position: absolute;
  right:-10rpx;
  top:-10rpx;
  font-size: 20rpx;
  width:20rpx;
  height: 20rpx;
  color: #000;
  line-height: 1;
}
.chat-content-list.right .chat-content-list-msg-del{
  left:-10rpx;
}
.over-read-tip{
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #009e96;
  position: absolute;
  /* left: -40rpx; */
  bottom: 0;
  display: none;
}
.over-read-tip.active{
  display: block;
}


.img-info {
  width: 687.5rpx;
  padding: 25rpx 0;
  position: relative; 
  border: 1px solid #ececec;
  border-radius: 20rpx;
  min-height: 204rpx;
}

.img {
  float: left;
  height: 175rpx;
  width: 175rpx;
  background: #f4f4f4;
  margin-right: 31.25rpx;
  margin-left: 13rpx;
  position: absolute;
  z-index: 100;
  top: 13rpx;  
  border-radius: 20rpx;
}
.info {
  float: right;
  width: 465rpx;
  overflow: hidden;
  /* display: flex; */
  align-items: center;
}
.p {
  font-size: 38rpx;
  color: #dc2121;
  height: 32rpx;
  line-height: 32rpx;
  margin-bottom: 10rpx;
}
.p-icon{
  font-size: 30rpx;
}
.s{
  font-size: 20rpx;
  color: #555555;
  height: 40rpx;
  line-height: 40rpx;
}
.a {
  font-size: 24rpx;
  color: #333;
  line-height: 35rpx;
  min-height: 70rpx;
}
</style>


