import {isYinXun} from '@/utils/apiUrl'
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