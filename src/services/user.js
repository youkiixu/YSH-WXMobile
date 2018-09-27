/**
 * 用户相关服务
 */
import wx from 'wx';
import api from '@/utils/api';
import util from '@/utils/util';
/** 
 * 调用微信登录
 */
function loginByWeixin () {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      // return util.getUserInfo(); 
    }).then((userInfo) => {
      const miniProgram = wx.getAccountInfoSync()
      util.request(api.getSmallUserOpenId, {
        code: code,
        appid: miniProgram.miniProgram.appId
      }, 'POST').then(res => {
        if (res.success) {
          wx.setStorageSync('openId', res.openId);
          resolve(res);
        } else {
          reject(res);
        }
        // if (res.errno === 0) {
        //   // 存储用户信息
        //   wx.setStorageSync('userInfo', res.data.userInfo);
        //   wx.setStorageSync('token', res.data.token);
        //   resolve(res);
        // } else {
        //   reject(res);
        // }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}
/**
 * 判断用户是否登录
 */
function checkLogin () {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('token')) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        reject(false);
      });
    } else {
      reject(false);
    }
  });
}

const user = {
  loginByWeixin,
  checkLogin
}

export default user
