<script>
import { mapActions , mapMutations } from 'vuex'
import util from '@/utils/util'
import api from '@/utils/api'
import wx from 'wx'
export default {
  mpType: 'app',
  async mounted () {
    // this.newOpenIdlogin()
    await Promise.all([
      this.oldOpenIdLogin()
    ])
  },
  methods: {
    ...mapActions([
      // 'getIndexData',
      'sassLogin'
    ]),
    ...mapMutations([
      'setYinXunShopInfo'
    ]),
    newOpenIdlogin () {
      // 直接用新的Openid尝试登录
      const _this = this
      let code = null; 
        util.login().then((res) => {
          code = res.code;
        }).then((userInfo) => {
          const miniProgram = wx.getAccountInfoSync()
          util.request(api.getSmallUserOpenId, {
            code: code,
            appid: miniProgram.miniProgram.appId
          }, 'POST').then(res => {
            if (res.success) {
                wx.setStorageSync('openId', res.openId);
                _this.sassLogin({
                  openId: res.openId
                })
            }
          }).catch((err) => {
            console.log('获取openid失败')
          });
        }).catch((err) => {
          console.log('获取code失败')
        })
    },
    oldOpenIdLogin() {
      // 判断存的OpenId是否跟当前的微信用户一致 , 
      
      let oldOpenId = wx.getStorageSync('openId')
      if(oldOpenId) {
        this.getOpenId(oldOpenId)
      } else {
        this.getOpenId()
      }
    },
    getOpenId(oldOpenId) {
      const _this = this
      let code = null; 
      util.login().then((res) => {
          code = res.code;
        }).then((userInfo) => {
          const miniProgram = wx.getAccountInfoSync()
          util.request(api.getSmallUserOpenId, {
            code: code, 
            appid: miniProgram.miniProgram.appId
          }, 'POST').then(res => {
            if (res.success) {
              if(api.isYinXun) {
                //如果有shopId就把shopId存储起来，以后每次请求都传这个值,取消了这个必传项
                // if(res.shopId) {
                //   wx.setStorageSync('shopId', res.shopId)
                // }
                this.setYinXunShopInfo({
                  shopId: res.shopId,
                  logo: res.logo,
                  shopName: res.shopName
                })
              }
              // 设置全局的OpenId,必须用到openId的地方就用这个
              wx.setStorageSync('hideOpenId', res.openId);
              if(res.openId == oldOpenId) {
                wx.setStorageSync('openId', res.openId);
                _this.sassLogin({
                  openId: res.openId
                })
              } else {
                wx.removeStorageSync('openId')
              }
            }
          }).catch((err) => {
            console.log(err)
            console.log('获取openid失败')
          });
        }).catch((err) => {
          console.log(err);
          
          console.log('获取code失败')
        })
    }
  }
}
</script>

<style>
.container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
</style>
