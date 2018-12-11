import wx from 'wx'
function formatTime (date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}
/**
 * 封封微信的的request
 */
function request(url, data = {}, method = 'GET') {
  return new Promise(function (resolve, reject) {
    // console.log(data)
    // console.log(url)
    // console.log('请求url:', url);
    // console.log('请求data:', data);
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': 'application/json',
        'X-sassShop-Token': wx.getStorageSync('token')
      },
      success: function (res) {
        // console.log('请求成功，url:', url);
        // console.log('请求参数，data:', data);
        // console.log('返回参数, res:', res)
        if (res.statusCode === 200) {
          if (res.data.errno === 401) {
            // 需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              // 登录远程服务器
              request(api.AuthLoginByWeixin, {
                code: code,
                userInfo: userInfo
              }, 'POST').then(res => {
                if (res.errno === 0) {
                  // 存储用户信息
                  wx.setStorageSync('userInfo', res.data.userInfo);
                  wx.setStorageSync('token', res.data.token);
                  resolve(res);
                } else {
                  reject(res);
                }
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
        // console.log('请求失败，url', url);
        // console.log('请求参数，data:', data);
      }
    })
  });
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}
/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录远程服务器
          // console.log('微信登陆成功', res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}
/**
 * 调用微信获取用户信息接口，需要button授权
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              console.log('获取用户信息成功', res);
              resolve(res);
            },
            fail: function (err) {
              console.log('获取用户信息失败', err);
              reject(err);
            }
          })
        } else { // 没有授权
          // console.log('但获取用户信息失败，未同意button授权');
        }
      }
    })
  });
}

function redirect(url) {
  // 判断页面是否需要登录
  // if (false) {
  //   wx.redirectTo({
  //     url: '/pages/auth/login/login'
  //   });
  //   return false;
  // } else {
  wx.redirectTo({
    url: url
  });
  // }
}
function formatNumber (n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

// 验证手机号
function checkMobile (phoneNumber) {
  var isPhone = true
  var phoneReg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (!phoneReg.test(phoneNumber)) {
    isPhone =  false;
  } 
  return isPhone
}
// 精确乘法
function accMul(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {}
  try {
    m += s2.split(".")[1].length
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
// 精确加法
function addNum(num1, num2) {
  // var sq1, sq2, m;
  // try {
  //   sq1 = num1.toString().split(".")[1].length;
  // } catch (e) {
  //   sq1 = 0;
  // }
  // try {
  //   sq2 = num2.toString().split(".")[1].length;
  // } catch (e) {
  //   sq2 = 0;
  // }
  // m = Math.pow(10, Math.max(sq1, sq2));
  // return (num1 * m + num2 * m) / m;
  return (num1 * 3 + num2 * 3) / 3
}
// 获取图片

function getImagePathGroup(path) {
  var arr = []
  for (let index = 1; index < 6; index++) {
    arr.push(`${path}/${index}_350.png`)
  }
  return arr
}

/*获取当前页url*/
function getCurrentPageUrl(){
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length-1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
  }

// 去最后一个字符串
function delLastStr (str , point) {
  return (str.substring(str.length - 1) == point) ? str.substring(0, str.length - 1) : str;
}

function deepCopy(params) {
   const objectStr = JSON.stringify(params)
   return JSON.parse(objectStr)
}

	function encode(input) {
	  return encodeURIComponent(input);
	}

	function decode(input) {
	  return decodeURIComponent(input)
  }
  // /goodsPages/goods?data={"ProductId":4911,"ProductName":"普通KT板小边条 KT板卡条 塑料kt展条 KT板收边条 相框小边条","code":undefined}
  // /goodsPages/goods?data={"ProductId":4911,"ProductName":"普通KT板小边条 KT板卡条 塑料kt展条 KT板收边条 相框小边条"}&&skuId=4911_1212_1222_0_0_0_0_1328
  //ProductId , ProductName , code , IsCustom ,  dataStr
  function getGoodsUrl(param) {
    // 非标报价id , 标准品为0
    const par = {
      ProductId: param.ProductId,
      ProductName: param.ProductName ? param.ProductName : '',
      code: param.code
    }
    // let urlPath = '/goodsPages/goods?data=' + JSON.stringify(par)
    let urlPath = `/goodsPages/goods?data={'ProductId':${par.ProductId},'ProductName':'${par.ProductName}','code':${par.code}}`
    if (param.IsCustom) { 
      urlPath += '&&proSearchParam=' + encode(param.dataStr)
    }
    if (!param.IsCustom && param.skuId) {
      urlPath += '&&skuId=' + param.skuId
    }

    console.log(urlPath)
    return urlPath
  }

  function getSearchUrl(keyword) {
    let urlPath = '/pages/search/search'
    if (keyword) {
      urlPath += `?keyword=${keyword}`
    }
    return urlPath
  }

  function getCateGoryUrl (cid) {
    let urlPath = 'pages/category/category'
    if(cid) {
      urlPath += `?Id=${cid}`
    }
    return urlPath
  }

  // function getCustomerChat (item , that , productInfo , replace) {
  //   // 客服的信息
  //   var par = [{
  //     bCustomer: false,
  //     strGroupCode: item.strGroupCode,
  //     strHeadIcon: that.userInfo.WXHeadImage ? that.userInfo.WXHeadImage : that.userInfo.photo ? that.$wx.baseUrl + that.userInfo.photo : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png',
  //     strOpenId: item.strFromOpenId,
  //     strUserName: that.userInfo.Id ? (that.userInfo.WXNick ? that.userInfo.WXNick : that.userInfo.UserName) : '匿名游客',
  //     strUserText: '客服'
  //   }]
  //   if(replace === 'replace') {
  //     par[0].strUserName = that.sendToName
  //     par[0].strHeadIcon = that.strHeadIcon
  //   }

  //   let urlPath = 'wxchat/customerChat?sellers=' + JSON.stringify(par) + '&&data=' + productInfo
  //   return urlPath
  // }
  // function getSellerChat(item, that, productInfo) {
  //   // 客户的信息
  //   var par = [{
  //     bCustomer: true,
  //     strGroupCode: item.strGroupCode,
  //     strHeadIcon: that.userInfo.WXHeadImage ? that.userInfo.WXHeadImage : that.userInfo.photo ? that.$wx.baseUrl + that.userInfo.photo : 'http://www.kiy.cn/Areas/wxMobile/Content/img/userHead.png',
  //     strOpenId: item.strFromOpenId,
  //     strUserName: that.userInfo.Id ? (that.userInfo.WXNick ? that.userInfo.WXNick : that.userInfo.UserName) : '匿名游客',
  //     strUserText: '客户'
  //   }]
  //   let urlPath = 'wxchat/sellerChat?customers=' + JSON.stringify(par) + '&&data=' + productInfo
  //   return urlPath
  // }
  // customerChat
  function getWxChatUrl(item  , productInfo) {
    var par = [{
      strHeadIcon: item.strHeadIcon,
      strOpenId: item.strOpenId,
      strUserName: item.strUserName
    }]
    let urlPath = 'wxchat/wxChat?userList=' + JSON.stringify(par) + '&&data=' + productInfo
    return urlPath
  }

  function getUserListUrl(item  , productInfo) {
    let urlPath = 'wxchat/userList?data=' + productInfo
    return urlPath
  }

const util = {
  login,
  getUserInfo,
  request,
  formatTime,
  checkMobile,
  getImagePathGroup,
  accMul,
  addNum,
  deepCopy,
  encode,
  decode,
  getGoodsUrl,
  delLastStr,
  getSearchUrl,
  getCateGoryUrl,
  // getCustomerChat,
  // getSellerChat,
  getWxChatUrl,
  getUserListUrl,
  getCurrentPageUrl
}

export default util
