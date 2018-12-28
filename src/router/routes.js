module.exports = [{
    path: 'pages/index/index',
    name: 'index',
    config: {
      enablePullDownRefresh: true
    }
  },
  {
    path: 'pages/catalog/catalog',
    name: 'catalog',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '分类'
    }
  },
  {
    path: 'pages/cart/cart',
    name: 'cart',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '购物车'
    }
  },
  {
    path: 'pages/ucenter/index',
    name: 'ucenter',
    config: {
      navigationBarTitleText: '个人中心'
    }
  },
  // 上面5个是tabBar
  {
    path: 'pages/category/category',
    name: 'category',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '分类'
    }
  },
  {
    path: 'commentPages/comment',
    subPackage: true,
    name: 'comment',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '商品评论'
    }
  },
  {
    path: 'commentPages/commentPost',
    subPackage: true,
    name: 'commentPost',
    config: {
      navigationBarTitleText: '提交评论'
    }
  },
  {
    path: 'pages/search/search',
    name: 'search',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '搜索'
    }
  },
  {
    path: 'goodsPages/goods',
    subPackage: true,
    name: 'goods',
    config: {
      navigationBarTitleText: '商品详情'
    }
  },
  {
    path: 'orderPages/order',
    subPackage: true,
    name: 'order',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '我的订单'
    }
  },
  {
    path: 'orderPages/orderDetail',
    subPackage: true,
    name: 'orderDetail',
    config: {
      navigationBarTitleText: '订单详情'
    }
  },
  {
    path: 'orderPages/express',
    subPackage: true,
    name: 'express',
    config: {
      navigationBarTitleText: '物流查询'
    }
  },
  {
    path: 'pages/ucenter/collect',
    name: 'collect',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '我的收藏'
    }
  },
  {
    path: 'addressPages/address',
    subPackage: true,
    name: 'address',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '地址管理'
    }
  },
  {
    path: 'addressPages/addressAdd',
    subPackage: true,
    name: 'addressAdd',
    config: {
      navigationBarTitleText: '编辑地址'
    }
  },
  {
    path: 'pages/ucenter/login',
    name: 'login',
    config: {
      navigationBarTitleText: '登陆'
    }
  },
  {
    path: 'shoppingPages/checkout',
    subPackage: true,
    name: 'checkout',
    config: {
      navigationBarTitleText: '确认订单'
    }
  },
  {
    path: 'pages/cart/cartCheckout',
    name: 'cartCheckout',
    config: {
      navigationBarTitleText: '确认订单'
    }
  },
  {
    path: 'shoppingPages/address',
    subPackage: true,
    name: 'address',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '地址管理'
    }
  },
  {
    path: 'pages/pay/pay',
    name: 'pay',
    config: {
      navigationBarTitleText: '支付'
    }
  },
  {
    path: 'pages/pay/payResult',
    name: 'payResult',
    config: {
      navigationBarTitleText: '支付结果'
    }
  },
  {
    path: 'autoPages/autoquote',
    subPackage: true,
    name: 'autoquote',
    config: {
      navigationBarTitleText: '自助报价',
      disableScroll: true
    }
  },
  {
    path: 'goodsPages/queryquote',
    subPackage: true,
    name: 'queryquote',
    config: {
      navigationBarTitleText: '商品报价',
      disableScroll: true
    }
  },
  {
    path: 'autoPages/quoteList',
    subPackage: true,
    name: 'quoteList',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '厂家报价'
    }
  },
  // {
  //   path: 'wxchat/sellerChat',
  //   subPackage: true,
  //   name: 'sellerChat',
  //   config: {
  //     enablePullDownRefresh: false,
  //     navigationBarTitleText: '与客户聊天'
  //   }
  // },
  // {
  //   path: 'wxchat/customerChat',
  //   subPackage: true,
  //   name: 'customerChat',
  //   config: {
  //     enablePullDownRefresh: false,
  //     navigationBarTitleText: '与商家聊天'
  //   }
  // },
  // {
  //   path: 'wxchat/selectChat',
  //   subPackage: true,
  //   name: 'selectChat',
  //   config: {
  //     enablePullDownRefresh: false,
  //     navigationBarTitleText: '选择人员'
  //   }
  // },
  {
    path: 'wxchat/bindSeller',
    subPackage: true,
    name: 'bindSeller',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: '成为客服'
    }
  },

  {
    path: 'wxchat/wxChat',
    subPackage: true,
    name: 'wxChat',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: '聊天界面'
    }
  },
  {
    path: 'wxchat/userList',
    subPackage: true,
    name: 'userList',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: '人员列表'
    }
  },
  {
    path: 'pages/ucenter/settledIn',
    name: 'settledIn',
    config: {
      enablePullDownRefresh: false,
      navigationBarTitleText: '申请入驻'
    }
  },
  {
    path: 'walletPages/wallet',
    subPackage: true,
    name: 'wallet',
    config: {
      navigationBarTitleText: '预存款钱包'
    }
  },
  {
    path: 'walletPages/activityDeposit',
    subPackage: true,
    name: 'activityDeposit',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '活动充值'
    }
  },
  {
    path: 'walletPages/detail',
    subPackage: true,
    name: 'detail',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '账单详情'
    }
  },
  {
    path: 'walletPages/deposit',
    subPackage: true,
    name: 'deposit',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '预存款充值'
    }
  },
  {
    path: 'walletPages/activityWallet',
    subPackage: true,
    name: 'activityWallet',
    config: {
      enablePullDownRefresh: true,
      navigationBarTitleText: '自营耗材预存钱包'
    }
  }
]
