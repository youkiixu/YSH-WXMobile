const kiy = 'https://www.kiy.cn/'
const dev = 'http://192.168.30.31:3333'
const yinxun = 'http://yx15.kiy.cn/'
let ApiKiyUrl = kiy
// ApiKiyUrl = 'http://localhost:7634/'
// ApiKiyUrl = 'http://192.168.0.91:8008/'
// ApiKiyUrl = 'http://192.168.30.6:6348/'
// ApiKiyUrl = yinxun
// ApiKiyUrl = dev

let isYinXun = ApiKiyUrl === yinxun
module.exports = {
    ApiKiyUrl,
    isYinXun
}