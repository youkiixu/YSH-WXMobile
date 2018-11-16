<template>
    <form @submit="formSubmit" report-submit="true">
        <div class="m-menu">
            <div  class="item" v-for="item of content.dataset" :key="item.id" @click="toDetail(item)">
                <button class="form_button" formType="submit">
                    <img :src="baseUrl+ item.pic" background-size="cover" />
                    <text>{{item.showtitle}}</text>
                </button>
            </div>
        </div>
    </form>
</template>

<script>
// 图片导航：8
export default {
    name: 'indexNav',
    props: {
        content: Object
    },
    computed: {
        baseUrl() {
            return this.$wx.baseUrl
        }
    },
    methods: {
        toDetail (item) {
            this.$emit('onClick' , item)
        },
        formSubmit(e) {
            const formId = e.mp.detail.formId
            this.$emit('formSubmit' , formId);
        }
    }
    
}
</script>
<style scoped>
    .m-menu {
        border-top-left-radius: 10rpx;
        border-top-right-radius: 10rpx;
        display: flex;
        height: 150rpx;
        width: 750rpx;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
    }

    .m-menu .item {
        flex: 1;
        display: block;
        padding: 20rpx 0;
    }

    .m-menu image {
        display: block;
        width: 70rpx;
        height: 70rpx;
        margin: 0 auto;
        margin-bottom: 12rpx;
    }

    .m-menu text {
        display: block;
        font-size: 24rpx;
        text-align: center;
        margin: 0 auto;
        line-height: 1;
        color: #666666;
    }
</style>


