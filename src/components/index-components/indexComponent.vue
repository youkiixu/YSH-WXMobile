<template>
    <view class="component">
        <indexTitle v-if="item.type === 2" :content="item.content"></indexTitle>
        <indexNaV v-if="item.type === 8" :content="item.content"></indexNaV>
        <indexGoods v-if="item.type === 4" :content="item.content"></indexGoods>
        <indexAd v-if="item.type === 9" :content="item.content"></indexAd>
        <indexLine v-if="item.type === 11" :content="item.content"></indexLine>
    </view>
</template>

<script>
import indexAd from '@/components/index-components/indexAd'
import indexGoods from '@/components/index-components/indexGoods'
import indexNaV from '@/components/index-components/indexNaV'
import indexTitle from '@/components/index-components/indexTitle'
import indexLine from '@/components/index-components/indexLine'
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
    }

}
</script>
<style scoped>
    .component {
        width: 750rpx;
        height: auto;
    }
</style>