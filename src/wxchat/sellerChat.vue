<template>
    <div class="chat" :style="{'height' : height + 'px'}">
        <scroll-view scroll-y='true' :scroll-top="chatValHeight"  class="chat-content" :style="{'height': chatHeight + 'px'}">
            <div v-for="(item , index) in wxchatLists" :key="index">
                <!-- ↑ wx:for="{{wxchatLists}}" wx:key="{{index}}" -->
                <div class="chat-content-list-time">{{item.msg_type != 'product' ? item.dataTime : productInfo.productName}}</div>
                <div :class="item.type === 1 ? 'chat-content-list right' : 'chat-content-list'" >
                    <img class="chat-content-list-avatar "  :src="item.userImgSrc" />
                    <div class="chat-content-list-content " @longtap="delMsg" :data-index="index">
                        <!--  文字信息模板  ↓ hidden="{{!(item.msg_type === 'text')}}" -->
                        <div class="chat-content-list-msg"  :hidden="!(item.msg_type === 'text')"> 
                            <text selectable='true'>{{item.textMessage}}</text>
                            <div class='over-read-tip '></div>
                        </div>

                        <!--  语音信息模板  ↓   hidden="{{!(item.msg_type === 'voice')}}" -->
                        <!-- <div class="chat-content-list-voice"  @click='playRecord' :hidden="!(item.msg_type === 'voice')" >
                            <text class=''>{{item.voiceTime}}s</text> 
                            <img class='chat-voice-img' src='../static/images/chat-voice-img@3x.png' />
                            <div class='over-read-tip '></div>
                        </div> -->

                        <!--  图片信息模板  ↓   -->
                        <div class="chat-content-list-img"  :hidden="!(item.msg_type === 'img')" >
                            <img :src="item.sendImgSrc" mode="aspectFill"  @click='seeBigImg'  :data-index="index" />
                            <!-- <div class='chat-content-list-msg-del' data-index="{{index}}" bindtap="delMsg">X</div> -->
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
</template>
<script>
import utils from '@/utils/util'
import chatInput from "@/components/chat-input/chatInput";

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
            productInfo: {}
        }
    },
    computed: {
        baseUrl () {
            return this.$wx.baseUrl
        }
    },
    async mounted () {
        this.productInfo = JSON.parse(this.$route.query.data)
        await Promise.all([
            this.loadHistory(),
            this.initData()
        ])
        
        // 加载产品信息
        this.loadProduct()
    },
    methods: {
        initData: function () {
            let that = this;

            let systemInfo = wx.getSystemInfoSync();

            that.height = systemInfo.windowHeight

            that.chatHeight = systemInfo.windowHeight- 55
            that.normalDataTime = utils.formatTime(new Date())
            wx.setNavigationBarTitle({
                title: that.productInfo.shopName
            });
            
        },
        listenMsg() {
            
        },
        loadHistory () {
            var arr = [1,2,3,4]
            arr.map(item => {
                this.onSend(1)
            })
        },
        onSend (text) {
            const _this = this
            var temp = {
                userImgSrc: '../static/images/chat/extra/close_chat.png',
                textMessage: text,
                dataTime: utils.formatTime(new Date()),
                msg_type: 'text',
                type: 1
            };
            this.wxchatLists.push(temp)
            this.setChatHeight()
            setTimeout(() => {
                _this.loadMsg(text)
            }, 1000);
        },
        loadMsg (text) {
            var temp = {
                userImgSrc: 'http://kiy.cn/Areas/Wxmobile/Content/img/online-service.png',
                textMessage: text,
                dataTime: utils.formatTime(new Date()),
                msg_type: 'text',
                type: 2
            };
            this.wxchatLists.push(temp)
            this.setChatHeight()
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
        }
    }
}
</script>
<style scoped>
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


