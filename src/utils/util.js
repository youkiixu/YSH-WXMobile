
function formatTime (date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
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

const util = {
  formatTime,
  checkMobile,
  accMul
}

export default util
