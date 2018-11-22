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
        },
        async setSaaSTalkOnOffLine (onLineOffLine) {
            const hideOpenId = wx.getStorageSync('hideOpenId')
            // 客服
            let par = {
                "strType": onLineOffLine,
                "bCustomer": false,
                "strOpenId": hideOpenId,
                "strGroupName": this.sendToGroupCode
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
                page: util.getCustomerChat(par , this)
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
        // // 渲染ui
        // renderUI (item , time) {
        //     const _this = this
        //     const hideOpenId = wx.getStorageSync('hideOpenId')
        //     let _type = false
        //     if(item.strFromOpenId != item.strToOpenId) {
        //         if(item.strFromOpenId === hideOpenId) {
        //             _type = true
        //         } 
        //     } else {
        //         _type = item.bCustomer
        //     }
        //     var temp = {
        //         userImgSrc: this.sendToHead ? this.sendToHead : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png',
        //         textMessage: item.strContent,
        //         dataTime: item.dCreateTime,
        //         msg_type: 'text',
        //         type: _type,
        //         item: item
        //     };
        //     // type = true 在右边
        //     // 没有time就刷新高度，拉到最底部，有time保留现在的位置
        //     if(time) {
        //         const oldWxchatLists = this.wxchatLists
        //         let arr = []
        //         arr.push(temp)
        //         this.wxchatLists = arr.concat(oldWxchatLists)
        //     } else {
        //         this.wxchatLists.push(temp)
        //         this.setChatHeight()
        //     }
        // },
        // loadProduct () {
        //     var temp = {
        //         msg_type: 'product',
        //         type: 1
        //     };
        //     this.wxchatLists.push(temp)
        //     this.setChatHeight()
        // },
        // setChatHeight(newList) {
        //     let len = 0
        //     if(newList) {
        //         len = newList.length
        //     } else {
        //         len = this.wxchatLists.length + 1
        //     }
        //     const height = len * 87
        //     this.chatValHeight = newList ? height :  this.chatHeight + height
        // },
        // // 选中要聊天的人
        // selectCustomer(item) {
        //     const DETAIL = item.mp.detail
        //     const sendToUser = this.userChatList[DETAIL.target.dataset.id]
        //     this.initData(sendToUser)
        //     // 保存一次formId
        //     this.formSubmit(item)
        // },
        // async formSubmit(e) {
        //     const formId = e.mp.detail.formId
        //     const hideOpenId = wx.getStorageSync('hideOpenId')
        //     if(formId === 'the formId is a mock one' || !hideOpenId) return
        //     await api.saaSSaveFormId({
        //         form_id: formId,
        //         strOpenId: hideOpenId
        //     })
        // },
        // // 下拉翻页
        // async scrolltoupper (e) {
        //     if(this.isTop || this.isScrolltoupper) return
        //     this.isScrolltoupper = true
        //     this.$wx.showLoading('正在加载')
        //     await Promise.all([
        //         this.loadHistory(this.wxchatLists[0].dataTime)
        //     ])
        //     this.$wx.hideLoading()
        //     this.isScrolltoupper = false
        // },
        // // 循环读读聊天数据
        // timeListenMsg () {
        //     const _this = this
        //     TIMER = setInterval(() => {
        //         if(!_this.wxchatLists.length) {
        //             _this.listenMsg()
        //         } else {
        //             _this.listenMsg(_this.wxchatLists[_this.wxchatLists.length-1].dataTime)
        //         }
        //     } , 5000)
        // }
    },
    // // 页面卸载时触发。如redirectTo或navigateBack到其他页面时。
    // onUnload () {
    //     if(this.isInit) {
    //         clearInterval(TIMER)
    //         this.setSaaSTalkOnOffLine('offLine')
    //     }
    // },
    // // 页面隐藏/切入后台时触发
    // onHide () {
    //     if(this.isInit) {
    //         clearInterval(TIMER)
    //         this.setSaaSTalkOnOffLine('offLine')
    //     }
    // },
    // // 页面显示/切入前台时触发。
    // onShow () {
    //     if(this.isInit) {
    //         this.setSaaSTalkOnOffLine('onLine')
    //         this.timeListenMsg()
    //     }
    // }
}
</script>
<style scoped>
    @import "../css/chatStyle.css";
</style>


