let ApiKiyUrl = 'https://www.kiy.cn/'
// ApiKiyUrl = 'http://localhost:7634/'
// ApiKiyUrl = 'http://192.168.0.91:8008/'
// ApiKiyUrl = 'http://192.168.30.6:6348/'
ApiKiyUrl = 'http://yx15.kiy.cn/'

let isYinXun = ApiKiyUrl != 'https://www.kiy.cn/'
module.exports = {
    ApiKiyUrl,
    isYinXun
}