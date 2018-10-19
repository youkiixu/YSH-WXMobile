module.exports = [
  {
    path: '/pages/index/index',
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
    path: 'pages/comment/comment',
    name: 'comment',
    config: {
      navigationBarTitleText: '商品评论'
    }
  },
  {
    path: 'pages/comment/commentPost',
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
    path: 'pages/goods/goods',
    name: 'goods',
    config: {
      navigationBarTitleText: '商品详情'
    }
  },
  {
    path: 'pages/ucenter/order',
    name: 'order',
    config: {
      navigationBarTitleText: '我的订单'
    }
  },
  {
    path: 'pages/ucenter/orderDetail',
    name: 'orderDetail',
    config: {
      navigationBarTitleText: '订单详情'
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
    path: 'pages/ucenter/address',
    name: 'address',
    config: {
      navigationBarTitleText: '地址管理'
    }
  },
  {
    path: 'pages/ucenter/addressAdd',
    name: 'addressAdd',
    config: {
      navigationBarTitleText: '编辑地址'
    }
  },
  { 
    path: 'pages/ucenter/express',
    name: 'express',
    config: {
      navigationBarTitleText: '物流查询'
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
    path: 'pages/shopping/checkout',
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
    path: 'pages/shopping/address',
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
    path: 'pages/auto/autoquote',
    name: 'autoquote',
    config: {
      navigationBarTitleText: '自助报价',
      disableScroll: true
    }
  },
  {
    path: 'pages/auto/queryquote',
    name: 'queryquote',
    config: {
      navigationBarTitleText: '商品报价',
      disableScroll: true
    }
  },
  {
    path: 'pages/auto/quoteList',
    name: 'quoteList',
    config: {
      navigationBarTitleText: '厂家报价'
    }
  }
]
