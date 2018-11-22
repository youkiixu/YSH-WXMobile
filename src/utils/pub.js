import wx from 'wx'

function getAjaxData(strMethod, paramObj, options) {
    return new Promise((reslove , reject) => {
        let data = Object.assign(paramObj, {
          key: strMethod
        })
        // console.log(JSON.stringify(data))
        wx.request({
          url: options.baseURL + '/Wxmobile/Data/Mobile', 
          data: data,
          method: 'POST',
          header: {
            'content-type': 'application/text' 
          },
          success(res) {
            let par = res.data
            if (res.data.errMsg) {
              par = Object.assign(par, {
                success: false,
                msg: par.errMsg
              })
            } else {
                par = Object.assign(par, {
                  success: true
                })
                
            }
            reslove(par)
          },
          fail (err) {
            reject(err)
          }
        })
    })
}

const pub = {
    getAjaxData
}

export default pub