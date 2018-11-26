<template>
    <div>
        <!-- 选择客服页面 -->
        <form report-submit="true" v-if="isSelect" @submit="selectCustomer">
            <div  class="select-content" >
                <button class="select-customer" v-for="(item , index) in userChatList" :key="index" formType="submit" :data-id="index" >
                    <img class="imgs" :src="item.strHeadIcon ? item.strHeadIcon : 'http://kiy.cn/Areas/Wxmobile/Content/img/online-service.png'" />
                    <text class="name type">客户</text>
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
      <!-- 返回首页 -->
        <navigator url="../pages/index/index" open-type="switchTab">    
            <div class="GoIndex">首页</div>   
        </navigator>
    </div>
</template>
<script>
import util from '@/utils/util'
import api from '@/utils/api'
import chatInput from "@/components/chat-input/chatInput";
import chatMixin from "@/mixins/chatMixin";
import {mapState} from 'vuex'

// let TIMER = null;

export default {
    components: {
        chatInput
    },
    mixins: [
        chatMixin
    ],
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
            userChatList: [],
            isSelect: true,
            sendToId: '',
            sendToName: '',
            sendToGroupCode: '',
            formId: '',
            isInit: false,
            canSend: true, //是否可以发送
            isTop:false,
            shopName: ''
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
        if(this.$route.query.shopName) {
            this.shopName = this.$route.query.shopName
        }
        if(this.$route.query.customers) {
            const userList = JSON.parse(this.$route.query.customers)
            if(this.$route.query.single === 'yes') {
                this.initData(userList[0])
            } else {
                this.userChatList = userList
            }
        }
    },
    methods: {
        async initData (sendToUser) {
            let that = this;
            let systemInfo = wx.getSystemInfoSync();
            // const hideOpenId = wx.getStorageSync('hideOpenId')
            // const res = await api.getUserShopInfo({openId : hideOpenId})
            that.height = systemInfo.windowHeight
            that.chatHeight = systemInfo.windowHeight- 55
            this.isTop = false
            this.sendToId = sendToUser.strOpenId
            this.sendToHead = sendToUser.strHeadIcon
            this.sendToName = sendToUser.strUserName
            if(this.shopName != '') {
                this.sendToGroupCode = sendToUser.strAppid + this.shopName
            } else {
                this.sendToGroupCode = sendToUser.strGroupCode
            }
            this.$wx.showLoading('读取聊天记录')
            await Promise.all([
                this.setSaaSTalkOnOffLine('onLine'),
                this.loadHistory()
            ])
            this.timeListenMsg()
            this.$wx.hideLoading()

            wx.setNavigationBarTitle({
                title: this.sendToName
            })
            this.isSelect = false
            this.isInit = true

            if(this.$route.query.data) {
                this.loadProduct()
            }
        },
        async setSaaSTalkOnOffLine (onLineOffLine) {
            const hideOpenId = wx.getStorageSync('hideOpenId')
            // 客服
            // let par = {
            //     "strType": onLineOffLine,
            //     "bCustomer": false,
            //     "strOpenId": hideOpenId,
            //     "strGroupName": this.sendToGroupCode
            // }
            // const res = await api.setSaaSTalkOnOffLine(par) 
            let par = {
                "strType": onLineOffLine,
                "strFromHeadIcon": this.userInfo.WXHeadImage ? this.userInfo.WXHeadImage : this.userInfo.photo ? this.baseUrl + this.userInfo.photo : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png',
                "strFromOpenId": hideOpenId,
                "strUserName": this.userInfo.Id ? (this.userInfo.WXNick ? this.userInfo.WXNick : this.userInfo.UserName) : '客户',
                "strToOpenId": this.sendToId,
            }
            const res = await api.setTalkConnect(par)
        },
        async listenMsg(time) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            // 如果是第一次聊天，是没有上一次的聊天记录的，读取默认历史消息
            if(!this.wxchatLists.length) {
                this.loadHistory()
                return
            }
            // 设置canSend,必须等这一次读取完数据才能继续读取数据
            // if(!this.canSend) return
            // this.canSend = false
            // 读取当前时间之后的数据（即最新数据），用">"
            const res = await api.saaSTalkRecordList({
                rule: '>',
                strFromOpenId: hideOpenId,
                strToOpenId: this.sendToId,
                dCreateTime: this.wxchatLists[this.wxchatLists.length - 1].dataTime,//获取最新一条的聊天纪录的时间
                strGroupCode: this.sendToGroupCode,//如果是客服跟客户聊，需要传完整的groupCode,即0007彩印通，如果是客户跟客服聊，只需要传入客服的OpenId
                bCustomer: false
            })
            // 还没到尽头
            if(res.success) {
                res.data.map(item => {
                    this.renderUI(item)
                })
            }
            // this.canSend = true
        },
        // 读取历史消息，不传time默认服务器当前事件之前，传time以time时间为准
        async loadHistory (time) {
            // 如果是顶部尽头的数据，不继续加载
            if(this.isTop) return
            const hideOpenId = wx.getStorageSync('hideOpenId')
            const res = await api.saaSTalkRecordList({
                rule: '<',
                strFromOpenId: hideOpenId,
                strToOpenId: this.sendToId,
                dCreateTime: time ? time : undefined,//传入时间，获取这一条时间之前的旧历史聊天记录，undefined寄获取系统当前时间之前的聊天记录
                strGroupCode: this.sendToGroupCode,//如果是客服跟客户聊，需要传完整的groupCode,即0007彩印通，如果是客户跟客服聊，只需要传入客服的OpenId
                bCustomer: false
            })
            if(res.success) {
                // 如果有返回数据，执行渲染操作
                let arr = []
                if(time) {
                    arr = res.data.reverse()
                } else {
                    arr = res.data
                }
                arr.map(item => {
                    this.renderUI(item , time)
                })
                if(time) {
                    this.setChatHeight(arr)
                }
            } else {
                this.isTop = true
                this.chatValHeight = 0
                // 如果没有数据，则判断是不是根据当前的time来读取的，如果是，代表已经到了顶部尽头，停止setinterval，否则，主动发送一条消息，不停止setinterval
                // 客服页面不需要主动发消息
                // if(time) {
                    
                // } else {
                //     this.onSend('可以立即开始回复客户' )
                // }
            }
        },
        // 发送消息
        async onSend (text) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            var par = {
                bCustomer: false,
                strContent: text,
                strFromOpenId: hideOpenId,
                strFromName: this.userInfo ? (this.userInfo.WXNick ? this.userInfo.WXNick : this.userInfo.UserName) : '客服',
                strToName: this.sendToName,
                strToOpenId: this.sendToId,
                strGroupCode: this.sendToGroupCode
            }
            par = Object.assign(par , {
                page: util.getCustomerChat(par , this , this.$route.query.data)
            })
            const res = await api.SaaSTalkEachOther(par)
            // 不再读取，留给定时器自动读取
            // await Promise.all([
            //     this.listenMsg()
            // ])
            this.renderUI({
                dCreateTime: res.dCreateTime,
                bCustomer: false,
                strContent: text,
                strFromOpenId: hideOpenId,
                strToOpenId: this.sendToId
            })
        },

    },
}
</script>
<style scoped>
    @import "../css/chatStyle.css";
</style>


