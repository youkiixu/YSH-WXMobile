
const OrderTypes = {
  // [Description("组合购")]
  Collocation : 1,
    // [Description("限时购")]
  LimitBuy : 2,
    // [Description("拼团")]
  FightGroup : 3,
}

const PaymentTypes = {
  /// <summary>
  /// 未付款时的默认状态
  /// </summary>
  // [Description("")]
  None : 0,
    // [Description("线上支付")]
  Online : 1,
    /// <summary>
    /// 平台确认收款之类的
    /// </summary>
    // [Description("线下支付")]
  Offline : 2,

    // [Description("货到付款")]
  CashOnDelivery :3,
}

const OrderOperateStatus = {
  /// <summary>
  /// 待付款
  /// </summary>
  // [Description("待付款")]
  WaitPay : 1,
    /// <summary>
    /// 待发货
    /// </summary>
    // [Description("待发货")]
  WaitDelivery : 2,

    /// <summary>
    /// 待收货
    /// </summary>
    // [Description("待收货")]
  WaitReceiving : 3,

    /// <summary>
    /// 已关闭
    /// </summary>
    // [Description("已关闭")]
  Close : 4,

    /// <summary>
    /// 已完成
    /// </summary>
    // [Description("已完成")]
  Finish : 5,

    ///// <summary>
    ///// 用户申请取消订单
    ///// </summary>
    //[Description("申请取消")]
    //CloseByUser,

    /// <summary>
    /// 收货完成，已付定金待完全付款
    /// </summary>
    //[Description("已收货待付款")]
    //WaitPayAll,

    // [Description("未评价")]
  UnComment : 7,

    /// <summary>
    /// 待审稿
    /// </summary>
    // [Description("待审稿")]
  UnAudited :0,
    /// <summary>
    /// 已审稿
    /// </summary>
    // [Description("已审稿")]
  Audited : 8
}

const Remindtypes = {
  // [Description("商家直邮")]
  DirectMail : 0,
    // [Description("代发快递")]
  AgentExpress : 1,
    // [Description("自提")]
  SelfExtraction : 2,
    // [Description("印捷配送")]
  Distribution : 3,
    // [Description("代发物流")]
  AgentLogistics : 4,
}


const orderInfoStatus = {
  OrderTypes,
  PaymentTypes,
  OrderOperateStatus
}

export default orderInfoStatus
