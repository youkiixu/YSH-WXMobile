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
  return new Promise((reslove , reject) => {
    wx.showModal({
      title: data.title ? data.title : '提示',
      content: data.content ? data.content : '弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内',
      confirmText: data.confirmText ? data.confirmText : '确定',
      cancelText: data.cancelText ? data.cancelText : '取消',
      success: function (res) {
        if (res.confirm) {
          reslove()
        } else {
          reject()
        }
      }
    });
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

function toLogin(isBack) {
  showErrorToast('请先登陆')
  setTimeout(() => {
    if (isBack) {
      wx.navigateTo({
        url: '/pages/ucenter/login'
      })
    } else {
        wx.redirectTo({
          url: '/pages/ucenter/login'
        })
    }
  }, 1500);

}

function orderStatus(status) {
  switch (status) {
    case 1:
      return '待付款'
      break;
    case 2:
      return '待发货'
      break;
    case 3:
      return '待收货'
      break;
    case 4:
      return '已关闭'
      break;
    case 5:
      return '已完成'
      break;
    
    case 7:
      return '未评价'
    break;
    case 8:
      return '已审稿'
    break;
    case 0:
      return '待审稿'
    break;
    default:
      return '暂无状态'
      break;
  }
}

function getImagePath(path) {
  return `${path}/1_350.png`
}

// const baseUrl = 'http://192.168.0.91:8008/'
const baseUrl = 'http://www.kiy.cn/'

const wxFun = {
    showSuccessToast,
    showErrorToast,
    showLoading,
    hideLoading,
    showModal,
    showActionSheet,
    formatBoolToInt,
    toGoodsDetail,
    baseUrl,
    toLogin,
    orderStatus
}

export default wxFun
