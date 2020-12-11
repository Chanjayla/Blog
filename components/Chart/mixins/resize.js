import { throttle } from '~/utils/optimize'
export default {
    data() {
        return {
            resizeFunc: null,
            echartsInstance: null
        }
    },
    mounted() {
        if(typeof this.resize == 'function') {
            this.resizeFunc = throttle(this.resize.bind(this), 200)
        }
        window.addEventListener('resize', this.resizeFunc)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resizeFunc)
    },
    methods: {
        resize() {
            this.echartsInstance.resize({
                width: 'auto',
                height: 'auto'
            })
        }
    }
}