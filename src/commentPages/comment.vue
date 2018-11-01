<template >
<view class="comments">
    <view class="h">
        <view :class="commentType == 1 ? 'active item' : 'item'" @click="switchTab(1)">
            <view class="txt">好评({{goodComment}})</view>
        </view>
        <view :class="commentType == 2 ? 'active item' : 'item'" @click="switchTab(2)">
            <view class="txt">中评({{comment}})</view>
        </view>
        <view :class="commentType == 3 ? 'active item' : 'item'" @click="switchTab(3)">
            <view class="txt">差评({{badComment}})</view>
        </view>
        <view :class="commentType == 4 ? 'active item' : 'item'" @click="switchTab(4)">
            <view class="txt">有图({{hasPicCount}})</view>
        </view>
    </view>
  <view class="b">
    <view class="item" v-for="(item, index) in comments" :key="item.id" :data-index="index">
      <view class="info">
        <view class="user">
          <img :src="item.defalutHead"/>
          <text>{{item.strName}}</text>
        </view>
        <view class="time">{{item.FinishDate}}</view>
      </view>
      <view class="comment">{{item.ReviewContent}}</view>
      <view class="imgs" v-if="item.Images">
        <image class="img" v-for="(iitem, iindex) in item.AppendImages" :key="iindex" :src="iitem"  @click="previewImage(item.AppendImages , iindex)"/>
      </view>
      <view class="customer-service" v-if="item.ReplyContent != '暂无回复'">
        <text class="u">卖家回复：</text>
        <text class="c">{{item.ReplyContent}}</text>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import api from '@/utils/api';
// import util from '@/utils/util';
// import wx from 'wx';
// import getCurrentPages from 'wxFunction';

export default {
  data () {
    return {
      comments: [],
      allCommentList: [],
      picCommentList: [],
      typeId: 0,
      ProductId: 0,
      pageNo:0,
      showType: 0,
      goodComment: 0,
      badComment: 0,
      comment: 0,
      hasPicCount: 0,
      allPage: 1,
      picPage: 1,
      size: 15,
      commentType: 1,
    }
  },
  computed: {
    baseUrl ()   {
        return this.$wx.baseUrl
    }
  },
  async mounted () {
    await Promise.all([
      this.getCommentCount(),
      this.getCommentList()
    ]);
  },

  methods: {
    // 获得 评论数量
    async getCommentCount () {
      this.ProductId = this.$route.query.valueId      
      const res = await api.getCommentCount({ ProductId: this.ProductId });
      if (res.success === true) {
        this.allCount = res.Comments;
      }
    },

    // 获得 评论详情
    async getCommentList () {
      this.ProductId = this.$route.query.valueId     
      this.pageNo++
      const res = await api.getCommentList({ ProductId: this.ProductId , pageNo: this.pageNo  , pageSize: this.size, commentType: this.commentType});      
      if (res.success) {
       var commentList = []
       res.comments.map(item => {
           if(item.Images) {
               item.AppendImages = []
                let images = item.Images.split(',')
                images.map(str => {
                    item.AppendImages.push(this.baseUrl + str)
                })
           }
           item.strName = item.UserName.substr(0, 7) + '****'
           item.defalutHead = `http://www.kiy.cn/Areas/wxMobile/Content/img/detailpage/${Math.floor(Math.random() * 7 + 1)}.png`
           commentList.push(item)
       })

       this.comments = this.comments.concat(commentList)  

       this.goodComment = res.goodComment
       this.comment = res.comment
       this.badComment = res.badComment
       this.hasPicCount = res.hasImages  
      }
    },
    // “全部”和“有图”切换
    switchTab (num) {
      this.commentType = num
      this.comments = []
      this.pageNo = 0
      this.getCommentList();
    },
    previewImage (images , index) {
        wx.previewImage({
            urls: images,
            current: images[index]
        })
    }
  },
    // 小程序原生下拉刷新
  onPullDownRefresh: function() {
    this.comments = []
    this.pageNo = 0
    this.getCommentCount()
    this.getCommentList()
    wx.stopPullDownRefresh()
  },
  // 原生的触底加载
  onReachBottom: function () {
    this.getCommentList();
  }
}
</script>

<style scoped>
.comments{
    width: 750rpx;
    height: auto;
    background: #fff;
    margin: 20rpx 0;
}

.comments .h{
    position: fixed;
    left:0;
    top:0;
    z-index: 1000;
    width: 100%;
    display: flex;
    background: #fff;
    height: 84rpx;
    border-bottom: 1px solid rgba(0,0,0,.15);
}

.comments .h .item{
    display: inline-block;
    height: 82rpx;
    flex: 1;
    text-align: center;
}

.comments .h .item .txt{
    display: inline-block;
    height: 82rpx;
    line-height: 82rpx;
    color: #333;
    font-size: 30rpx;
    width: 100%;
}

.comments .h .item.active .txt{
    color: #20b2aa;
    border-bottom: 4rpx solid #20b2aa;
}

.comments .b{
    margin-top: 90rpx;
    height: auto;
    width: 750rpx;
    padding: 0 20rpx;
    box-sizing: border-box;
}

.comments .b.no-h{
    margin-top: 0;
}

.comments .b .item{
    height: auto;
    width: 710rpx;
    overflow: hidden;
    border-bottom: 1px solid #d9d9d9;
    padding-bottom: 10rpx;
}

.comments .info{
    height: 60rpx;
    width: 100%;
    padding: 12rpx 0 12rpx 0;
}

.comments .user{
    float: left;
    width: auto;
    height: 67rpx;
    line-height: 67rpx;
    font-size: 0;
}

.comments .user image{
    float: left;
    width: 67rpx;
    height: 67rpx;
    margin-right: 17rpx;
    border-radius: 50%;
}

.comments .user text{
    display: inline-block;
    width: auto;
    height: 66rpx;
    overflow: hidden;
    font-size: 29rpx;
    line-height: 66rpx;
}

.comments .time{
    display: block;
    float: right;
    width: auto;
    height: 67rpx;
    line-height: 67rpx;
    color: #7f7f7f;
    font-size: 25rpx;
    margin-right: 30rpx;
}

.comments .comment{
    width: 710rpx;
    line-height: 45.8rpx;
    font-size: 29rpx;
    margin-bottom: 16rpx;
}

.comments .imgs{
    width: 710rpx;
    /* height: 150rpx; */
    margin-bottom: 25rpx;
}

.comments .imgs .img{
    height: 150rpx;
    width: 150rpx;
    margin-right: 28rpx;
}

.comments .spec{
    width: 710rpx;
    height: 25rpx;
    font-size: 24rpx;
    color: #999;
}

.comments .spec .item{
    color: #7f7f7f;
    font-size: 25rpx;
}

.comments .customer-service{
    width: 690rpx;
    height: auto;
    overflow: hidden;
    margin-top: 40rpx;
    background: rgba(0,0,0,.03);
    padding: 21rpx;
}

.comments .customer-service .u{
    font-size: 24rpx;
    color: #333;
    line-height: 37.5rpx;
}

.comments .customer-service .c{
    font-size: 24rpx;
    color: #999;
    line-height: 37.5rpx;
}
</style>
