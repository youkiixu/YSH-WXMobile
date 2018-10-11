<template >
<view class="container">
    <div class="ad">
      <img class="ad-img" :src="baseUrl + '/Areas/wxMobile/Content/img/ad.png'" alt="">
    </div>
    <view class="catalog">
        <scroll-view class="nav menu-ul" scroll-y="true" scroll-with-animation="true" :scroll-into-view="navId">
            <view :class="currentIndex == index ? 'active item menu-item' : 'item menu-item' " v-for="(item, index) of list" :key="index" :id="'nav_' + index"
                 @click="selectMenu(index)">{{item.name}}</view>
        </scroll-view>
        <scroll-view class="cate foods-wrapper" scroll-y="true"  :scroll-into-view="contentId" scroll-with-animation="true" @scroll="onScroll">
            <view class="food-list-hook" v-for="( listItem , index1 ) of list" :key="index1" :id="'con_'+index1">
              <view class="hd">
                  <!-- <text class="line"></text> -->
                  <text class="txt">{{listItem.name}}分类</text>
                  <!-- <text class="line"></text> -->
              </view>
              <view class="bd">
                  <navigator @click="queryQuote(item)" :class="(index2+1) % 3 == 0 ? 'last item' : 'item'" v-for="(item, index2) of listItem.itemList"
                      :key="item.Code">
                      <img class="icon" :src="item.Image ?  baseUrl+ item.Images : 'http://www.kiy.cn/Areas/Mobile/Templates/Default/Images/default.png'"/>
                      <text class="txt">{{item.qName}}</text>
                  </navigator>
              </view>
            </view>
        </scroll-view>
    </view>
</view>
</template> 
<script>
import api from '@/utils/api'
function newObj (name) {
    this.desc = name;
    this.child = [];
}
export default {
  data () {
    return {
      list: [],
      currentIndex : 0,
      navId : '',
      contentId: '',
      navulHeight: 0,
      navItemHeight: 0,
      listHeight: [],
      baseUrl: ''
    }
  },
  mounted () {
    this.getQitem()
  },
  methods: {
      async getQitem () {
          const res = await api.getQitem({})
          this.baseUrl = res.RequestUrl
          this.qitemList = JSON.parse(res.data)
          console.log(this.qitemList.length)
          this.formatData()
      },
      formatData () {

          var categoryList = []
          var itemList = this.qitemList
          itemList.map(item => {
              categoryList.push(item.cName)
          })
          var r = categoryList.filter(function(element , index , self) {
              return self.indexOf(element) === index;
          })
          var arr = []
          r.map((item , i) => {
              var itemb = new Object();
              itemb.name = item
              itemb.itemList = []
              arr.push(itemb)
          })

          this.list = this.diff(itemList , arr)
          this.getFoodHeight()

      },
      diff (arr1 , arr2) {
        arr1.map(item => {
          arr2.map(item2 => {
            if(item2.name == item.cName){
              item2.itemList.push(item)
            }
          })
        })
        console.log(arr2)
        return arr2
      },
      getFoodHeight() {
        var query = wx.createSelectorQuery()
        let h = 0
        query.selectAll('.food-list-hook').boundingClientRect((rects) => {
          rects.forEach(rect => {
            h += rect.height
            this.listHeight.push(h)
          });
        })
        
        query.select('.foods-wrapper').boundingClientRect((rect) => {
          this.contentHeight = rect.height
        })
        query.select('.menu-ul').boundingClientRect((rect) => {
          this.navulHeight = rect.height
        })
        query.select('.menu-item').boundingClientRect((rect) => {
          this.navItemHeight = rect.height
        }).exec()
      },
      queryQuote(item) {
          this.$router.push({ path: '/pages/auto/queryquote', query: { pid: item.Code , title: item.qName  } })
      },
      selectMenu (index) {
        this.contentId = `con_${index}`
        this.navId = `con_${index}`
        this.currentIndex = index
      },
      onScroll(e) {
        this.contentId = ''
        let scrollTop = e.target.scrollTop
        let length = this.listHeight.length
        if(scrollTop >= this.listHeight[length - 1] - this.contentHeight) {
          return
        } else if(scrollTop > 0 && scrollTop < this.listHeight[0]){
          this.currentIndex = 0
        }
        for (let i = 0; i < length; i++) {
          if(scrollTop >= this.listHeight[i - 1] && scrollTop < this.listHeight[i]) {
            this.currentIndex = i
          }
        }
      }
  },
  watch: {
    currentIndex () {
      // console.log(this.currentIndex)
      if(this.contentHeight < this.navulHeight) {
        let h = this.currentIndex * this.navItemHeight
        if(h > this.contentHeight) {
          // 导航滑动
          this.navId = `nav_${this.currentIndex}`
        } else {
          this.navId = `nav_0`
        }
      }
    },
    list () {
      setTimeout(() => {
        this.getFoodHeight()
      }, 60);
    }
  },

  // 原生的分享功能
  onShareAppMessage: function () {
    return {
      title: 'sassShop',
      desc: '印生活SASS商城',
      path: '/pages/brand/brand'
    }
  },

}
</script>

<style>

page {
  height: 100%;
}

.container {
  background: #f9f9f9;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}


.catalog {
  flex: 1;
  width: 100%;
  background: #fff;
  display: flex;
  border-top: 1px solid #fafafa;
}

.catalog .nav {
  width: 180rpx;
  height: 100%;
  background: #f1f1f1;
}

.catalog .nav .item {
  text-align: center;
  line-height: 100rpx;
  width: 180rpx;
  height: 100rpx;
  color: #333;
  font-size: 28rpx;
  border-left: 6rpx solid #f1f1f1;
  overflow: hidden;
}

.catalog .nav .item.active {
  color: #20b2aa;
  font-size: 28rpx;
  border-left: 6rpx solid #20b2aa;
  background: #fff;
}

.catalog .cate {
  border-left: 1px solid #fafafa;
  flex: 1;
  height: 100%;
  padding: 0 40rpx 0 40rpx;
}

.banner {
  display: block;
  height: 222rpx;
  width: 100%;
  position: relative;
}

.banner .image {
  position: absolute;
  top: 30rpx;
  left: 0;
  border-radius: 4rpx;
  height: 192rpx;
  width: 100%;
}

.banner .txt {
  position: absolute;
  top: 30rpx;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
  left: 0;
  height: 192rpx;
  line-height: 192rpx;
  width: 100%;
}

.catalog .hd {
  height: 108rpx;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}

.catalog .hd .txt {
  font-size: 28rpx;
  text-align: left;
  color: #111111;
  font-weight: 700;
  padding: 0 10rpx;
  width: auto;
}

.catalog .hd .line {
  width: 40rpx;
  height: 1px;
  background: #d9d9d9;
}

.catalog .bd {
  height: auto;
  width: 100%;
  overflow: hidden;
}

.catalog .bd .item {
  display: block;
  float: left;
  height: 216rpx;
  width: 127rpx;
  margin-right: 50rpx;
}

.catalog .bd .item.last {
  margin-right: 0;
}

.catalog .bd .item .icon {
  height: 127rpx;
  width: 127rpx;
  border-radius: 50%;
  overflow: hidden;
}

.catalog .bd .item .txt {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #666666;
  font-weight: 500;
  height: 72rpx;
  width: 127rpx;
}
.ad {
  height: 332rpx;
  width: 750rpx;
}
.ad .ad-img {
  height: 332rpx;
  width: 750rpx;
}
</style>