<template>
    <web-view :src="webUrl"  @message="bindmessage"></web-view>
</template>
<script>
import api from '@/utils/api'
import { mapState, mapActions } from 'vuex'
export default {
    data () {
        return {
            webUrl: ''
        }
    },
    computed: {
        ...mapState([
        'userInfo'
        ])
    },
    mounted () {
        
        // this.webUrl = 'http://localhost:7634/m-Mobile/Product/Detail/' + 61
        // this.webUrl = 'http://192.168.0.91:8008/m-Mobile/Product/Detail/' + 61
        if (this.$route.query.data) {
            const data = JSON.parse(this.$route.query.data);
            wx.setNavigationBarTitle({
                title: data.ProductName
            })
            // data.ProductId = 146
            this.webUrl = this.$wx.baseUrl + 'm-Mobile/Product/Detail/' + data.ProductId
        }
    },
    methods: {
        ...mapActions(['submitByProductId']),
        async bindmessage (e) {
            if(this.userInfo.Id) {
                if(e.mp.detail.data[0].skuIds) {
                    var skuInfo = e.mp.detail.data[0]
                    console.log(skuInfo)
                    // this.submitByProductId(skuInfo)
                }
            } else {
                this.$wx.showErrorToast('请先登陆')
            }
        }
    }
}
</script>
<style scoped>

</style>



