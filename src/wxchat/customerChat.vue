<template>
    <div>
        <!-- 选择客服页面 -->
        <form report-submit="true" v-if="isSelect" @submit="selectCustomer">
            <div  class="select-content" >
                <button class="select-customer" v-for="(item , index) in userChatList" :key="index" formType="submit" :data-id="index" >
                    <img class="imgs" :src="item.strHeadIcon ? item.strHeadIcon : 'http://kiy.cn/Areas/Wxmobile/Content/img/online-service.png'" />
                    <text class="name type">客服</text>
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
            canSend: true,
            isTop:false,
            isScrolltoupper: false
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
    mounted () {
        if(this.$route.query.data) {
            this.productInfo = JSON.parse(this.$route.query.data)
        }
        if(this.$route.query.sellers) {
            
            const userList = JSON.parse(this.$route.query.sellers)
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
            that.height = systemInfo.windowHeight
            that.chatHeight = systemInfo.windowHeight- 55
            this.isTop = false
            this.sendToId = sendToUser.strOpenId
            this.sendToHead = sendToUser.strHeadIcon
            this.sendToName = sendToUser.strUserName
            this.sendToGroupCode = sendToUser.strGroupCode
            this.$wx.showLoading('读取聊天记录')
            await Promise.all([
                this.loadHistory(),
                this.setSaaSTalkOnOffLine('onLine')
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
            let par = {
                "strType": onLineOffLine,
                "bCustomer": true,
                "strOpenId": hideOpenId,
                "strGroupCode": this.sendToId,
                "strName": this.userInfo.Id ? (this.userInfo.WXNick ? this.userInfo.WXNick : this.userInfo.UserName) : '客户',
                "strHeadIcon": this.userInfo.WXHeadImage ? this.userInfo.WXHeadImage : this.userInfo.photo ? this.baseUrl + this.userInfo.photo : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png'
            }
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
            // if(!this.canSend) return
            // this.canSend = false
            // 读取当前时间之后的数据（即最新数据），用">"
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
            // this.canSend = true
        },
        // 读取历史消息，不传time默认服务器当前事件之前，传time以time时间为准,以time作为是否是下拉加载历史聊天记录的标准
        async loadHistory (time) {
            // 如果是顶部尽头的数据，不继续加载
            if(this.isTop) return
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
                // 如果有time,代表是下拉加载历史聊天记录，需要倒序
                if(time) {
                    arr = res.data.reverse()
                } else {
                    arr = res.data
                }
                arr.map(item => {
                    this.renderUI(item , time)
                })
                // 如果有time,代表是下拉加载历史聊天记录，把加载的历史聊天记录数量作为当前的距离顶部的高度
                if(time) {
                    this.setChatHeight(arr)
                }
            } else {
                this.isTop = true
                this.chatValHeight = 0
                // 如果没有数据，则判断是不是根据当前的time来读取的，如果是，代表已经到了顶部尽头，不再继续让读取数据，否则，主动模拟发送一条消息
                if(time) {

                } else {
                    // 模拟客服发消息
                    this.onSend(undefined , {
                        bCustomer: false,
                        strContent: '您好，请问有什么可以帮到您?',
                        strFromOpenId: this.sendToId,
                        strFromName: this.sendToName ? this.sendToName : '客服',
                        strToName: this.userInfo.Id ? (this.userInfo.WXNick ? this.userInfo.WXNick : this.userInfo.UserName) : '客户',
                        strToOpenId: hideOpenId,
                        strGroupCode: this.sendToGroupCode
                    })
                }
            }
        },
        // 发送消息
        async onSend (text , sellerPar) {
            const _this = this
            const hideOpenId = wx.getStorageSync('hideOpenId')
            let par = null;
            if(text != undefined) {
                par = {
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
                    page: util.getSellerChat(par , this , this.$route.query.data)
                })
            } else {
                par = sellerPar
                par = Object.assign(par , {
                    page: util.getCustomerChat(par , this  , this.$route.query.data)
                })
            }
            
            const res = await api.SaaSTalkEachOther(par)
            // 不再读取，留给定时器自动读取
            // await Promise.all([
            //     this.listenMsg()
            // ])
            this.renderUI({
                dCreateTime: res.dCreateTime,
                bCustomer: par.bCustomer,
                strContent: par.strContent,
                strFromOpenId: par.strFromOpenId,
                strToOpenId: par.strToOpenId
            })
        },
    }
}
</script>
<style scoped>
    @import "../css/chatStyle.css";
</style>


