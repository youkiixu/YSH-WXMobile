<template>
    <view class="component">
        <indexTitle v-if="item.type === 2" :content="item.content"></indexTitle>
        <indexNaV v-if="item.type === 8" :content="item.content"></indexNaV>
        <indexGoods v-if="item.type === 4" :content="item.content" @onClick="toDetail"></indexGoods>
        <indexAd v-if="item.type === 9" :content="item.content" @onClick="ADEvent"></indexAd>
        <indexLine v-if="item.type === 11" :content="item.content"></indexLine>
    </view>
</template>

<script>
import indexAd from '@/components/index-components/indexAd'
import indexGoods from '@/components/index-components/indexGoods'
import indexNaV from '@/components/index-components/indexNaV'
import indexTitle from '@/components/index-components/indexTitle'
import indexLine from '@/components/index-components/indexLine'
import api from '@/utils/api'
export default {
    name: 'indexComponet',
    props: {
        item: Object
    },
    components: {
        indexAd,
        indexGoods,
        indexNaV,
        indexTitle,
        indexLine
    },
    methods: {
        async toDetail(obj) {
            // 去商品详情页
            const ProductId = obj.item_id
            const res = await api.getProductQitemCode({Id : ProductId})
            if(res.success) {
                const pid = res.data
                const fid = res.ShopMapId
                if( pid != 0 ) {
                    this.$wx.toBaoJia({ pid: pid , ProductId , isDetail: true , ProductId: ProductId , fid: fid } , this)
                } else {
                    this.$wx.toDetail({id : ProductId , title: obj.title} , this)
                }
            } else {
                this.$wx.showErrorToast(res.msg)
            }
        },
        ADEvent(item) {
            const type = item.linkType
            switch (type) {
                case 1:
                    // 类型一是去商品详情页
                    const links = item.link.split('/')
                    const len = links.length
                    const par = {
                        item_id : links[len - 1],
                        title: item.title
                    }
                    this.toDetail(par)
                    break;
                case 10:
                    // 类型10是连接
                    
                    this.$router.push(item.link)
                    break;
                default:
                    this.$wx.showErrorToast('暂时没有' + item.title)
                    break;
            }
        },
        toSearch(keyword) {
            this.$router.push({
                path: '../../pages/search/search',
                query: {
                    keyword: keyword
                }
            })
        }
    }

}
</script>
<style scoped>
    .component {
        width: 750rpx;
        height: auto;
    }
</style>