<template>
    <view class="input-flex-column">
        <view class="input-text-voice-super">
            <input v-if="inputObj.inputStatus==='text'"
                   class="chat-input-style"
                   maxlength="500" confirm-type="send" v-model.lazy="textMessage" confirm-hold="true" @confirm="chatInputSendTextMessage" @focus="chatInputBindFocusEvent" @blur="chatInputBindBlurEvent" @input="chatInputGetValueEvent" placeholder='想和TA说点什么呢？' cursor-spacing='20'/>
            <view hover-class="press-style-opacity">
                <image class="extra-btn-style"
                       src="../static/images/chat/extra.png" @click="chatInputExtraClickEvent" />
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data () {
        return {
            inputObj: {
                inputStatus: 'text'
            },
            textMessage: ''
        }
    },
    methods: {
        chatInputSendTextMessage(e) {
            const val = e.mp.detail.value
            this.textMessage = ''
            this.$emit('onSend' , val)
        },
        chatInputBindFocusEvent () {

        },
        chatInputBindBlurEvent () {

        },
        chatInputGetValueEvent () {

        },
        chatInputExtraClickEvent () {

        }
    }
}
</script>
<style scoped>
input{
    padding-top: 10rpx;
    padding-bottom:10rpx;
    width: 100%;
}

.extra-btn-style{
    width: 56rpx;
    height: 56rpx;
    padding:20rpx 24rpx;
    display: flex;
    flex-shrink:0;
}
.input-text-voice-super{
    display: flex;
    flex-direction: row;
    background-color: white;
    width: 100%;
    align-items: center;
    height:100rpx;
}
.input-flex-column{
    width:100%;
    /* display: flex; */
    flex-direction:column;
    position: fixed;
    left: 0;
    bottom: 0;
    border-top: 1rpx solid #ebebeb;
}

.list-divide-line {
    width: 100%;
    height: 1rpx;
    background-color: #dddddd;
}

.chat-input-style{
    /* border:1rpx solid #1e1e1e; */
    /* margin-top:14rpx;
    margin-bottom: 13rpx; */
    padding:10rpx;
    height: 56rpx;
    line-height: 1;
    background-color: #fff;
    font-size: 32rpx;
    color: #1e1e1e;
}

.chat-input-send-button-style{
    width: 100rpx;
    padding: 15rpx 0;
    font-size: 30rpx;
    text-align: center;
    margin: 0 10rpx;
    border-radius: 10rpx;
    display: none;
}
.btn-voice-press{
    border:1rpx solid #1e1e1e;
    background-color: #fff;
    border-radius: none;
}
</style>


