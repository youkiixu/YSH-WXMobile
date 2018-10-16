<template>
    <web-view :src="quoteUrl"  @message="bindmessage"></web-view>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    data () {
        return {
            quoteUrl: '',
            qitemCode: '',
            isDetail :  false, //是否从单个商品详情页过来,默认false
            detailCommon: false,
            ProductId: '',
            title: ''
        }
    },
    mounted () {
        if (this.$route.query.pid) {
            this.quoteUrl = 'https://www.kiy.cn//m-mobile/autobaojia/index?pid=' + this.$route.query.pid
            this.qitemCode = this.$route.query.pid
            this.isDetail = this.$route.query.isDetail ? this.$route.query.isDetail : false
            this.ProductId = this.$route.query.ProductId ? this.$route.query.ProductId : ''
            this.detailCommon = this.$route.query.detailCommon ? this.$route.query.detailCommon : false
            this.title = this.$route.query.title
            wx.setNavigationBarTitle({
                title: this.$route.query.title
            })
        }
    },
    methods: {
        ...mapActions(['getProSearchRst']),
        bindmessage (e) {
            var _this = this;
            var skuInfo = e.mp.detail.data[0]
            var par = {
                qitemCode: Number(this.qitemCode),
                dataStr: skuInfo,
                quoteJson: '',
                isDetail: this.isDetail == 'true' ? true : false,
                ProductId: Number(this.ProductId),
                title: this.title,
                detailCommon: this.detailCommon  == 'true' ? true : false,//是不是从detail页面过来,true不加载detail页,false加载
            }
            
            this.getProSearchRst(par)
            
        }
    }
    
}
</script>

<style scoped>

</style>

