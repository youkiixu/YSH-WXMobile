module.exports = [
  {
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
      enablePullDownRefresh: true,
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
      navigationBarTitleText: '我的收藏'
    }
  },
  {
    path: 'addressPages/address',
    subPackage: true,
    name: 'address',
    config: {
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
      navigationBarTitleText: '厂家报价'
    }
  }
]
