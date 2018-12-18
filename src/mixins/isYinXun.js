import {isYinXun} from '@/utils/config'
export default {
    data () {
        return {
            isYinXun : false
        }
    },
    created () {
        this.isYinXun = isYinXun
    }
}