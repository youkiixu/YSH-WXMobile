<template>
    <web-view :src="quoteUrl"  @message="bindmessage"></web-view>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    data () {
        return {
            quoteUrl: '',
            qitemCode: ''
        }
    },
    mounted () {
        if (this.$route.query.pid) {
            this.quoteUrl = 'https://www.kiy.cn//m-mobile/autobaojia/index?pid=' + this.$route.query.pid
            this.qitemCode = this.$route.query.pid
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
                quoteJson: ''
            }
            this.getProSearchRst(par)
            
        }
    }
    
}
</script>

<style scoped>

</style>

