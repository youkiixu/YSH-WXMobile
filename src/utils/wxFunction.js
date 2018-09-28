function showSuccessToast(msg) {
  wx.showToast({
    title: msg
  })
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function showLoading(msg) {
  wx.showLoading({
    title: msg ? msg : '正在加载...',
    mask: true
  })
}
 
function hideLoading(msg) {
  wx.hideLoading()
}

function showModal(data = {}) {
  wx.showModal({

  })
}
function showActionSheet(arr) {
  return new Promise((reslove, reject) => {
    wx.showActionSheet({
        itemList: arr,
        success: function(res) {
            reslove(res)
        }
    })
  })
}

function formatBoolToInt(object) {
  for (const key in object) {
    if (String(object[key]) == 'true') {
      object[key] = 1
    }
    if (String(object[key]) == 'false') {
      object[key] = 0
    }
  }
  return object
}

function toGoodsDetail (item , vm) {
  // 标准品false , vm是this
  if (item.IsCustom) {
    vm.$router.push({
      path: '/pages/auto/queryquote',
      query: {
        pid: item.QitemCode
      }
    })
  } else {
    vm.$router.push({
      path: '/pages/goods/goods',
      query: {
        data: JSON.stringify(item)
      }
    })
  }
}




const wxFun = {
    showSuccessToast,
    showErrorToast,
    showLoading,
    hideLoading,
    showModal,
    showActionSheet,
    formatBoolToInt,
    toGoodsDetail
}

export default wxFun
