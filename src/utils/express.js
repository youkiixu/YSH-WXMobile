// var info = {
//   isYJPeiSong: detailInfo.IsYJPeiSong,
//   YjUse: detailInfo.YjUse,
//   useFreightTempalate: detailInfo.UseFreightTempalate,
//   productId: detailInfo.ProductId
// }
const YJPEISONG = {
  name: '印捷配送',
  value: 3
}

const DAIFA = {
    name: '代发快递',
    value: 1
}
const ZHIYOU = {
    name: '商家直邮',
    value: 0
}
// 弃用
const ZITI = {
    name: '仓库自提',
    value: 2
}
function selectExpress(info) {
  var arr = []
  if(info.openId) {
    console.log(`isYJPeiSong:${info.isYJPeiSong}`, `YjUse:${info.YjUse}`, `useFreightTempalate:${info.useFreightTempalate}`)
    if (info.isYJPeiSong != false && info.YjUse == 1) {
      arr.push(YJPEISONG.name)
      arr.push(DAIFA.name)
    }
    if (info.YjUse == 1 && info.isYJPeiSong == false) {
      if (info.useFreightTempalate == 1 && (info.productId == 61 || info.productId == 119 || info.productId == 121 || info.productId == 122)) {
        arr.push(ZHIYOU.name)
      } else {
        arr.push(DAIFA.name)
      }
    }
    if (info.useFreightTempalate == 1 && info.productId != 61 && info.productId != 119 && info.productId != 121 && info.productId != 122) {
      arr.push(ZHIYOU.name)
    }
    if (info.YjUse != 1 && info.useFreightTempalate != 1) {
      arr.push(ZHIYOU.name)
    }
  } else {
    // 未登录都显示代发快递
    arr.push(DAIFA.name)
  }


  return arr
}

function wuliuId(str) {
  switch (str) {
    case YJPEISONG.name:
      return YJPEISONG.value
      break;
    case DAIFA.name:
      return DAIFA.value
      break;
    case ZITI.name:
      return ZITI.value
      break;
    default: //商家直邮
      return ZHIYOU.value
      break;
  }
}

function checkYjUse(num) {
  // 0是商家只有，0以上都是印捷
  if (num == 0) {
    return 0
  } else {
    return 1
  }
}


const express = {
  wuliuId,
  checkYjUse,
  selectExpress
}

export default express
