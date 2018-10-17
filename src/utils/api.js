import request from './request'

let ApiKiyUrl = 'http://192.168.0.91:8008/'
// const ApiKiyUrl = 'http://localhost:7634/'
// ApiKiyUrl = 'https://www.kiy.cn/'

const api = {
  //获取sass首页
  getSassIndex: (paramObj) => request.post('/JsonAjax/Hi_Ajax_GetTemplateByID?client=t1' , paramObj , {
    baseURL: ApiKiyUrl
  }),
  // 获取sass分类
  getSassCategory: (paramObj) => request.post('/Wxmobile/Category' , paramObj , {
    baseURL: ApiKiyUrl
  }),
  // 获取印捷地址
  getYinJieRegion: (paramObj) => request.get(`/common/RegionAPI/GetRegion?id=${paramObj.id}` , null , {
    baseURL: ApiKiyUrl
  }),
  // 获取SASS用户地址
  getSassUserAddress: (paramObj) => request.post('/Wxmobile/UserInfos/GetAddress', paramObj, {
    baseURL: ApiKiyUrl
  }),
  
  // 修改sass登陆用户地址
  ModifySassUserAddress: (paramObj) => request.post('/Wxmobile/UserInfos/ModifyUserAddress', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 小程序登陆地址
  sassLoginUrl: ApiKiyUrl + '/Wxmobile/LoginRegisterTransfer/Login',
  // 获取sassopenId
  getSmallUserOpenId: ApiKiyUrl + '/Wxmobile/Share/GetSmallUserOpenId',
  // sass登陆
  sassLogin: (paramObj) => request.post('/Wxmobile/LoginRegisterTransfer/Login', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // SASS注册
  sassRegister: (paramObj) => request.post('/Wxmobile/LoginRegisterTransfer/Register', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取短信验证码
  verificationCode: (paramObj) => request.post('/Wxmobile/LoginRegisterTransfer/VerificationCode', paramObj , {
    baseURL: ApiKiyUrl
  }),
  // SASS搜索
  search: (paramObj) => request.post('/Wxmobile/Search' , paramObj , {
    baseURL: ApiKiyUrl
  }),
  // 自动报价列表
  getQitem: (paramObj) => request.get('/Wxmobile/Product/GetQitem', null, {
    baseURL: ApiKiyUrl
  }),
  // 标准品跳转到下单页
  submitByProductId: (paramObj) => request.get('/Wxmobile/Orders/SubmitByProductId' , paramObj , {
    baseURL: ApiKiyUrl
  }),
  // 非标品跳到下单页面
  SubmitByProductId2: (paramObj) => request.post('/Wxmobile/Orders/SubmitByProductId2', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 标准品提交订单
  submitOrderByProductId: (paramObj) => request.post('/Wxmobile/Orders/SubmitOrderByProductId' , paramObj , {
    baseURL : ApiKiyUrl
  }),
  // 非标品提交订单
  submitOrderByProductId2: (paramObj) => request.post('/Wxmobile/Orders/SubmitOrderByProductId2', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取标准品
  getGetSKUInfo: (paramObj) => request.post('/Wxmobile/Product/GetSKUInfo' , paramObj , {
    baseURL : ApiKiyUrl
  }),
  getGoodsDetail: (paramObj) => request.post('/Wxmobile/Product/Detail', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 非标品报价参数
  getProSearchRst: (paramObj) => request.post('/Wxmobile/Product/ProSearchRst', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 非标品商品详情
  getProductDesc: (paramObj) => request.post('/Wxmobile/Product/GetProductDesc', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取印捷提点运费
  getYJFreightCalculate: (paramObj) => request.post('/Wxmobile/Product/GetYJFreightCalculate', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取印捷运费
  getCalculateFreight: (paramObj) => request.post('/Wxmobile/Product/GetCalculateFreight', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取购物车列表
  getShoppingCartList: (paramObj) => request.post('/Wxmobile/ShoppingCart/GetShoppingCartList', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取用户订单列表
  getUserOrderList: (paramObj) => request.get('/Wxmobile/UserOrder/Index', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取订单详细
  getUserOrderDetail: (paramObj) => request.get('/Wxmobile/UserOrder/OrderDetail', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 添加/修改/删除购物车信息
  modifyShoppingCart: (paramObj) => request.post('/Wxmobile/ShoppingCart/ModifyShoppingCart', paramObj, {
    baseURL: ApiKiyUrl
  }),
  //  查询印捷快递信息
  getYinJieExpress: (paramObj) => request.get('/Common/ExpressData/GetLogisInfo', paramObj, {
    baseURL: ApiKiyUrl
  }),
  //  查询印捷快递信息
  getDefaluExpress: (paramObj) => request.get('/Common/ExpressData/Search', paramObj, {
    baseURL: ApiKiyUrl
  }),

  // 评论列表
  getCommentList: (paramObj) => request.get('/Wxmobile/Product/GetCommentByProduct', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 评论总数
  getCommentCount: (paramObj) => request.get('/Wxmobile/Product/GetCommentsNumber', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 会员取消订单
  setOrderClose: (paramObj) => request.post('/Wxmobile/UserOrder/CloseOrder', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 添加或修改用户地址信息
  modifyUserAddress: (paramObj) => request.post('/Wxmobile/UserInfos/ModifyUserAddress', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 检测二维码是否付款
  checkSQRCode: (paramObj) => request.post('/Wxmobile/Pay/CheckSQRCode', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取支付二维码
  getSaaSQRCode: (paramObj) => request.post('/Wxmobile/Pay/GetSaaSQRCode', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 退出登陆
  loginOut: (paramObj) => request.post('/Wxmobile/LoginRegisterTransfer/LoginOut', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 设默认地址
  setDefaultShippingAddress: (paramObj) => request.post('/Wxmobile/UserInfos/SetDefaultShippingAddress', paramObj, {
    baseURL: ApiKiyUrl
  }),
   // 添加收藏
   AddFavoriteProduct: (paramObj) => request.post('/Wxmobile/Collection/AddFavoriteProduct', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 取消收藏
  CancelConcernProducts: (paramObj) => request.post('/Wxmobile/Collection/CancelConcernProducts', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取收藏列表
  GetFavoriteProductList: (paramObj) => request.post('/Wxmobile/Collection/GetFavoriteProductList', paramObj, {
    baseURL: ApiKiyUrl
  })
}

export default api
