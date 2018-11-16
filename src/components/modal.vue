<template>
<div>
    <view class="i-modal-mask i-class-mask {{ visible ? 'i-modal-mask-show' : '' }}"></view>
    <view class="i-class i-modal {{ visible ? 'i-modal-show' : '' }}">
        <view class="i-modal-main">
            <view class="i-modal-content">
                <view class="i-modal-title" wx:if="{{ title }}">{{ title }}</view>
                <view class="i-modal-body"><slot></slot></view>
                <view class="i-modal-actions" wx:if="{{ actions.length }}">
                    <block wx:if="{{ actionMode === 'horizontal' }}">
                        <i-grid i-class="i-modal-grid">
                            <i-grid-item i-class="{{ actions.length === (index + 1) ? 'i-modal-grid-item-last' : 'i-modal-grid-item' }}" wx:for="{{ actions }}" wx:key="{{ item.name }}">
                                <template is="button" data="{{ item, index }}"></template>
                            </i-grid-item>
                        </i-grid>
                    </block>
                    <block wx:else>
                        <view class="i-modal-action-vertical" wx:for="{{ actions }}" wx:key="{{ item.name }}">
                            <template is="button" data="{{ item, index }}"></template>
                        </view>
                    </block>
                </view>
                <view class="i-modal-actions" wx:else>
                    <i-grid i-class="i-modal-grid" wx:if="{{ showOk || showCancel }}">
                        <i-grid-item i-class="i-modal-grid-item" wx:if="{{ showCancel }}">
                            <i-button i-class="i-modal-btn-cancel" long type="ghost" bind:click="handleClickCancel">{{ cancelText }}</i-button>
                        </i-grid-item>
                        <i-grid-item i-class="i-modal-grid-item-last" wx:if="{{ showOk }}">
                            <i-button i-class="i-modal-btn-ok" long type="ghost" bind:click="handleClickOk">{{ okText }}</i-button>
                        </i-grid-item>
                    </i-grid>
                </view>
            </view>
        </view>
    </view>
</div>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean,
            value: false
        },
        title: {
            type: String,
            value: ''
        },
        showOk: {
            type: Boolean,
            value: true
        },
        showCancel: {
            type: Boolean,
            value: true
        },
        okText: {
            type: String,
            value: '确定'
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        // 按钮组，有此值时，不显示 ok 和 cancel 按钮
        actions: {
            type: Array,
            value: []
        },
        // horizontal || vertical
        actionMode: {
            type: String,
            value: 'horizontal'
        }
    }
};
</script>
<style scoped>
.i-modal {
  position: fixed;
  overflow: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
  display: flex;
  outline: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  transform: translateZ(1px);
  opacity: 0;
  visibility: hidden;
}
.i-modal-show {
  visibility: visible;
  opacity: 1;
}
.i-modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  transition: all 0.2s ease-in-out;
  opacity: 0;
  visibility: hidden;
}
.i-modal-mask-show {
  opacity: 1;
  visibility: visible;
}
.i-modal-main {
  width: 270px;
  position: relative;
}
.i-modal-content {
  border-radius: 7px;
  padding-top: 15px;
  position: relative;
  background-color: #fff;
  border: 0;
  background-clip: padding-box;
  text-align: center;
  height: 100%;
  overflow: hidden;
}
.i-modal-body {
  max-height: 100px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #80848f;
  height: 100%;
  line-height: 1.5;
  overflow: auto;
}
.i-modal-title {
  padding: 6px 15px 15px;
  margin: 0;
  font-size: 18px;
  line-height: 1;
  color: #1c2438;
  text-align: center;
}
.i-modal-actions {
  margin: 0 1px;
}
.i-modal-action-vertical {
  position: relative;
}
.i-modal-action-vertical:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  transform: scale(0.5);
  transform-origin: 0 0;
  pointer-events: none;
  box-sizing: border-box;
  border: 0 solid #e9eaec;
  border-top-width: 1px;
}
.i-modal-grid {
  border-radius: 0 0 7px 7px;
  border-left: none;
}
.i-modal-grid-item,
.i-modal-grid-item-last {
  padding: 0;
  border-bottom: none;
}
.i-modal-grid-item-last {
  border-right: none;
}
.i-modal-btn-ok {
  color: #2d8cf0 !important;
}
.i-modal-btn-loading {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
  width: 12px;
  height: 12px;
  background: 0 0;
  border-radius: 50%;
  border: 2px solid #e5e5e5;
  border-color: #666 #e5e5e5 #e5e5e5 #e5e5e5;
  animation: btn-spin 0.6s linear;
  animation-iteration-count: infinite;
}
.i-modal-btn-text {
  display: inline-block;
  vertical-align: middle;
}
.i-modal-btn-icon {
  font-size: 14px !important;
  margin-right: 4px;
}
@keyframes btn-spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>


