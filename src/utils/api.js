import request from './request'
import pub from './pub'
import  {ApiKiyUrl , isYinXun}  from './config'


const indexData = isYinXun ? 't1' : 't6'
const api = {
  isYinXun : isYinXun,
  //获取sass首页
  getSassIndex: (paramObj) => request.post('/Wxmobile/JsonAjax/Hi_Ajax_GetTemplateByID?client=' + indexData, paramObj, {
    baseURL: ApiKiyUrl
  }),
  getOpenId: (paramObj) => request.post('/Wxmobile/Share/GetSmallUserOpenId', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取sass分类
  getSassCategory: (paramObj) => request.post('/Wxmobile/Category', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取印捷地址
  getYinJieRegion: (paramObj) => request.get(`/common/RegionAPI/GetRegion?id=${paramObj.id}`, null, {
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
  verificationCode: (paramObj) => request.post('/Wxmobile/LoginRegisterTransfer/VerificationCode', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // SASS搜索
  search: (paramObj) => request.post('/Wxmobile/Search', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 自动报价列表
  getQitem: (paramObj) => request.get('/Wxmobile/Product/GetQitem', null, {
    baseURL: ApiKiyUrl
  }),
  // 标准品跳转到下单页
  submitByProductId: (paramObj) => request.get('/Wxmobile/Orders/SubmitByProductId', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 非标品跳到下单页面
  SubmitByProductId2: (paramObj) => request.post('/Wxmobile/Orders/SubmitByProductId2', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 标准品提交订单
  submitOrderByProductId: (paramObj) => request.post('/Wxmobile/Orders/SubmitOrderByProductId', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 非标品提交订单
  submitOrderByProductId2: (paramObj) => request.post('/Wxmobile/Orders/SubmitOrderByProductId2', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取标准品
  getGetSKUInfo: (paramObj) => request.post('/Wxmobile/Product/GetSKUInfo', paramObj, {
    baseURL: ApiKiyUrl
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
  // 判断商品是否已收藏
  IsCollection: (paramObj) => request.post('/Wxmobile/Collection/IsCollection', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 取消收藏
  CancelConcernProducts: (paramObj) => request.post('/Wxmobile/Collection/CancelConcernProducts', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取收藏列表
  GetFavoriteProductList: (paramObj) => request.post('/Wxmobile/Collection/GetFavoriteProductList', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 非标品单个商品报价
  getOpenQuote: (paramObj) => request.post('/Wxmobile/Quote/OpenQuote', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 购物车去下单页
  submitByShoppingCart: (paramObj) => request.post('/Wxmobile/Orders/SubmitByShoppingCart', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 购物车提交订单
  submitOrderByShoppingCart2: (paramObj) => request.post('/Wxmobile/Orders/SubmitOrderByShoppingCart2', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 根据产品Id获取qid
  getProductQitemCode: (paramObj) => request.post('/Wxmobile/Product/GetProductQitemCode', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取购物车数量
  getShoppingCartCount: (paramObj) => request.post('/Wxmobile/ShoppingCart/GetShoppingCartCount', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 绑定商家客服
  addCustomerService: (paramObj) => request.post('/Wxmobile/CustomerService/Add', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取店铺客服
  getCustomerService: (paramObj) => request.post('/Wxmobile/CustomerService/GetCustomerService', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 快捷登录
  quickLogin: (paramObj) => request.post('/Wxmobile/LoginRegisterTransfer/QuickLogin', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 根据用户OpenId获取是否有店铺信息
  getUserShopInfo: (paramObj) => request.post('/Wxmobile/userinfos/GetShopInfo', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 绑定微信客服
  bindSaaSWxCusService: (paramObj) => pub.getAjaxData('BindSaaSWxCusService', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 客户登陆: {
  //   "key": "setSaaSTalkOnOffLine",
  //   "strType": "onLine",
  //   "bCustomer": true,
  //   "strOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  //   "strGroupCode": "oRex35EywKDhC1hSspu2_fiyYxus",
  //   "sign": "cejGtqyIv/gNeJ8PQvoMOfQ6TBWYexXS9GhSDM1w2uXGjRAZqDns8Ig/iDCmXtLL4op87zoWKUwGXFelqnmt+cK8ZqhmITRgNlYU6iIH0aSbIM5Ly2y2xa0/QpK9Ypq96y4HmSItAVkwhLUalTK9+nA3/gbR/Ce5g909BSj8uiQ="
  // }
  // 客服登陆: {
  //   "key": "setSaaSTalkOnOffLine",
  //   "strType": "onLine",
  //   "strGroupCode": "YSH00000007佛山彩印通",
  //   "strOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  // }
  setSaaSTalkOnOffLine: (paramObj) => pub.getAjaxData('setSaaSTalkOnOffLine', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 自言自语: {
  //   "bCustomer": true,
  //   "page": "/index/index?a=b&c=d1231",
  //   "strContent": "测试",
  //   "strFromName": "Youki",
  //   "strFromOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  //   "strToName": "Youki1",
  //   "strToOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  // }
  SaaSTalkEachOther: (paramObj) => pub.getAjaxData('SaaSTalkEachOther', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 保存formId新增时参数 key=SaaSSaveFormId,form_id,strOpenId,bUse(默认未使用),strWxAppid(可空，控制获取默认小程序appid)
  saaSSaveFormId: (paramObj) => pub.getAjaxData('SaaSSaveFormId', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取可用formId,strOpenId, one (可空，存在值时获取单个formId，不存在值时获取列表)
  saaSQueryEnableFormId: (paramObj) => pub.getAjaxData('SaaSQueryEnableFormId', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 聊天记录查询key = SaaSTalkRecordList
  // rule(获取规则) -- -- -- -- -- -- -- > （大于号, 意思往后查）。 < (默认, 小于号 往上翻)
  // dCreateTime(聊天时间) -- -- -- -- > (默认当前时间, 格式: yyyy - MM - dd HH: mm: ss.fff))
  // strFromOpenId: (我)
  // strToOpenId: 对方
  saaSTalkRecordList: (paramObj) => pub.getAjaxData('SaaSTalkRecordList', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 聊天人查询 key = CustServiceList
  // strGroupName: (组名, eg: 佛山彩印通), strGroupCode(组code, ) strGroupName与strGroupCode二选一， 两者存在取strGroupCode 作为值
  // strGroupName与strGroupCode 不能同时为空
  // strOpenId: 用户openid 可空
  // bCustomer: 是否客户(默认为客服)
  gustServiceList: (paramObj) => pub.getAjaxData('CustServiceList', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取未读信息接口 {
  //   "key": "UnReadRecord",
  //   "strOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  // }
  getUnReadRecord: (paramObj) => pub.getAjaxData('UnReadRecord', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 建立聊天对话{
  //   "key": "setTalkConnect",
  //   "strFromHeadIcon": null,
  //   "strFromOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  //   "strToOpenId": "oRex35JorwOYDZ5U4EZGj_4UjZ6E",
  // }
  setTalkConnect: (paramObj) => pub.getAjaxData('setTalkConnect', paramObj, {
    baseURL: ApiKiyUrl
  }),
  // 获取好友列表 {
  //   "key": "getMyFriendList",
  //   "strFromOpenId": "oRex35EywKDhC1hSspu2_fiyYxus",
  // }
  getMyFriendList:(paramObj)  => pub.getAjaxData('getMyFriendList', paramObj, {
    baseURL: ApiKiyUrl
  }),
}

export default api
