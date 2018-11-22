let TIMER = null;
export default {
  created() {
    console.log('created from mixin')
  },
  methods: {
    // 渲染ui
    renderUI(item, time) {
      const _this = this
      const hideOpenId = wx.getStorageSync('hideOpenId')
      let _type = false
      if (item.strFromOpenId != item.strToOpenId) {
        if (item.strFromOpenId === hideOpenId) {
          _type = true
        }
      } else {
        _type = item.bCustomer
      }
      var temp = {
        userImgSrc: this.sendToHead ? this.sendToHead : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png',
        textMessage: item.strContent,
        dataTime: item.dCreateTime,
        msg_type: 'text',
        type: _type,
        item: item
      };
      // type = true 在右边
      // 没有time就刷新高度，拉到最底部，有time保留现在的位置
      if (time) {
        const oldWxchatLists = this.wxchatLists
        let arr = []
        arr.push(temp)
        this.wxchatLists = arr.concat(oldWxchatLists)
      } else {
        this.wxchatLists.push(temp)
        this.setChatHeight()
      }
    },
    loadProduct() {
      var temp = {
        msg_type: 'product',
        type: 1
      };
      this.wxchatLists.push(temp)
      this.setChatHeight()
    },
    setChatHeight(newList) {
      let len = 0
      if (newList) {
        len = newList.length
      } else {
        len = this.wxchatLists.length + 1
      }
      const height = len * 87
      this.chatValHeight = newList ? height : this.chatHeight + height
    },
    // 选中要聊天的人
    selectCustomer(item) {
      console.log(item)
      const DETAIL = item.mp.detail
      const sendToUser = this.userChatList[DETAIL.target.dataset.id]
      this.initData(sendToUser)
      // 保存一次formId
      this.formSubmit(item)
    },
    async formSubmit(e) {
      const formId = e.mp.detail.formId
      const hideOpenId = wx.getStorageSync('hideOpenId')
      if (formId === 'the formId is a mock one' || !hideOpenId) return
      await api.saaSSaveFormId({
        form_id: formId,
        strOpenId: hideOpenId
      })
    },
    // 下拉翻页
    async scrolltoupper(e) {
        if (this.isTop || this.isScrolltoupper) return
        this.isScrolltoupper = true
        this.$wx.showLoading('正在加载')
        await Promise.all([
          this.loadHistory(this.wxchatLists[0].dataTime)
        ])
        this.$wx.hideLoading()
        this.isScrolltoupper = false
      },
    // 循环读读聊天数据
    timeListenMsg() {
      const _this = this
      TIMER = setInterval(() => {
        if (!_this.wxchatLists.length) {
          _this.listenMsg()
        } else {
          _this.listenMsg(_this.wxchatLists[_this.wxchatLists.length - 1].dataTime)
        }
      }, 5000)
    }
    
  },
  // 页面卸载时触发。如redirectTo或navigateBack到其他页面时。
  onUnload() {
      if (this.isInit) {
        clearInterval(TIMER)
        this.setSaaSTalkOnOffLine('offLine')
      }
    },
  // 页面隐藏/切入后台时触发
  onHide() {
    if (this.isInit) {
      clearInterval(TIMER)
      this.setSaaSTalkOnOffLine('offLine')
    }
  },
  // 页面显示/切入前台时触发。
  onShow() {
    if (this.isInit) {
      this.setSaaSTalkOnOffLine('onLine')
      this.timeListenMsg()
    }
  }
}