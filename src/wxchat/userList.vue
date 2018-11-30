<template>
    <div class="weui-panel weui-panel_access">
        <form report-submit="true" @submit="selectCustomer">
            <div class="weui-panel__hd">人员列表(未读消息： <span style="color: red;">{{intTotal}}</span> 条)</div>
            <div class="weui-panel__bd" >
                <button class="form_button"  formType="submit" v-for="(item , index) in userList" :key="index" :data-id="index">
                    
                    <navigator url="" class="weui-media-box weui-media-box_appmsg" hover-class="weui-cell_active">
                        <div class="weui-media-box__hd weui-media-box__hd_in-appmsg" style="position:relative;">
                            <image class="weui-media-box__thumb"  :src="item.strHeadIcon ? item.strHeadIcon : 'http://kiy.cn/Areas/Wxmobile/Content/img/online-service-change.png'" />
                            <div class="weui-badge" style="position: absolute;top: -.4em;right: -.4em;">{{item.intTotal ? item.intTotal : 0}}</div>
                        </div>
                        <div class="weui-media-box__bd weui-media-box__bd_in-appmsg">
                            <div class="weui-media-box__title">{{item.strUserName}}</div>
                            <div class="weui-media-box__desc">{{item.strContent ? item.strContent : '暂无未读消息'}}</div>
                        </div>
                    </navigator>
                </button>
            </div>
            <div></div>
        </form>
    </div>
</template>
<script>
import api from '@/utils/api'
import {mapState} from 'vuex'
let TIMERS  = null

export default {
    data () {
        return {
            productInfo: {},
            userList: [],
            isInit: false,
            canSend: true,
            shopName: '',
            intTotal: 0
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
   
        // if(this.$route.query.userList) {
        //     this.userList =  JSON.parse(this.$route.query.userList)
        //     // this.timeGetUnRead()
        //     this.getUnReadRecord()
        //     this.setSaaSTalkOnOffLine('onLine')
        // }

    },
    methods: {
        // 选中客服
        async selectCustomer(item) {
            const DETAIL = item.mp.detail
            const sendToUser = this.userList[DETAIL.target.dataset.id]
            if(sendToUser.strContent) {
                delete sendToUser.strContent
                delete sendToUser.intTotal
            }
            // 保存一次formId
            this.formSubmit(item)
            this.$router.push({
                path: './wxChat',
                query: {
                    data: this.$route.query.data,
                    userList: JSON.stringify(sendToUser),
                    single: 'yes'
                }
            })
        },
        async getUnReadRecord () {
            // if(!this.canSend){
            //     return;
            // }
            const hideOpenId = wx.getStorageSync('hideOpenId')
            const res = await api.getUnReadRecord({
                strOpenId: hideOpenId
            })

              if(res.success) {
                // this.intTotal = res.intTotal
                this.intTotal = 0
                if(res.data) {
                    let num = 0
                    let data=res.data;
                   // this.userList.map((item , index) => {
                    //  res.data.map(item2 => { //此出用this 代表 res.data 非本身
                    
                    for(var index in  this.userList ){   
                         this.userList[index].intTotal = 0                   
                        for(var index2 in data){
                            let item2=data[index2];   
                            if(item2.strFromOpenId ===   this.userList[index].strOpenId) {   
                                this.userList[index].strContent = item2.strContent; 
                                this.userList[index].intTotal+=1; 
                                this.intTotal+=1
                            }
                        } 

                    }  
                }
            } 
            // setTimeout(() => {
            //     this.getUnReadRecord();
            // }, 10000); 


            // if(res.success) {
            //     this.intTotal = res.intTotal
            //     if(res.data) {
            //         let num = 0
            //         this.userList.map((item , index) => {
            //             this.userList[index].intTotal = 0
            //             res.data.map(item2 => {
            //                 if(item2.strFromOpenId === item.strOpenId) {
            //                     this.userList[index].intTotal++
            //                     this.userList[index].strContent = item2.strContent
            //                 }
            //             })
            //         })
                    
            //     }
            // } 
        },
        // 建立对话连接
        async setSaaSTalkOnOffLine (onLineOffLine) {
            const hideOpenId = wx.getStorageSync('hideOpenId')
            let par = {
                "strType": onLineOffLine,
                "strFromHeadIcon": this.userInfo.WXHeadImage ? this.userInfo.WXHeadImage : this.userInfo.photo ? this.baseUrl + this.userInfo.photo : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png',
                "strFromOpenId": hideOpenId,
                "strUserName": this.userInfo.Id ? (this.userInfo.WXNick ? this.userInfo.WXNick : this.userInfo.UserName) : '匿名用户'
            }
            const res = await api.setTalkConnect(par)
        },
        timeGetUnRead() {
            const _this = this
            TIMERS = setInterval(() => {
                _this.getUnReadRecord()
            }, 10000);
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
    },
    onUnload() {
        this.canSend = false
        clearInterval(TIMERS)
        this.setSaaSTalkOnOffLine('offLine')
    },
    // 页面隐藏/切入后台时触发
    onHide() { 
        this.canSend=false;
       clearInterval(TIMERS)
        this.setSaaSTalkOnOffLine('offLine')
    },
    // 页面显示/切入前台时触发。
     onShow() {  
        this.canSend=true;  
        this.setSaaSTalkOnOffLine('onLine')  
        if(this.userList.length!=0){
             this.getUnReadRecord();
             this.timeGetUnRead();
        } else { 
            let par = undefined;
            if(this.$route.query.strGroupName){ 
                api.gustServiceList( {strGroupName: this.$route.query.strGroupName}).then((res1)=>{
                    if(res1.data!=undefined){
                        this.userList = res1.data; 
                        this.getUnReadRecord();
                        this.timeGetUnRead();
                    } else {
                        this.$wx.showErrorToast('暂无客服')
                        setTimeout(() => {
                            this.$router.back()
                        }, 1500);
                    }
                //this.timeGetUnRead()
                })
            } else { 
                const hideOpenId = wx.getStorageSync('hideOpenId')
                api.getMyFriendList({strFromOpenId: hideOpenId}).then((res1)=>{
                    if(res1.data!=undefined){
                        this.userList = res1.data; 
                        this.getUnReadRecord();
                        this.timeGetUnRead();
                    } 
                    // this.timeGetUnRead()
                })

            }
            //如果strUserName 为手机号时 类型则会影响未读记录显示      
            for(var index in  this.userList){
                var tmp = this.userList[i];
                tmp.strUserName +=" ";
            }
        }
         
        //this.userList = JSON.parse(this.$route.query.userList) 
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
    width: 135rpx;
    background: #cccccc;
    border-radius: 50rpx;
    padding: 10rpx;
    line-height:30rpx;
    color: #fafafa;
    text-align: center;
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


