<template>
    <div class="setting">
        <img v-if="!isTop" src="~/assets/icons/top.svg" @click="goTop">
    </div>
</template>

<script>
import { transScroll } from '~/utils'
export default {
    data() {
        return {
            isTop: true
        }
    },
    mounted() {
        document.addEventListener('scroll', this.checkScrollTop.bind(this))
    },
    beforeDestroy() {
         document.removeEventListener('scroll', this.checkScrollTop.bind(this))
    },
    methods: {
        goTop() {
            transScroll(0)
        },
        checkScrollTop() {
           if(document.documentElement.scrollTop > 300) {
               this.isTop = false
           } else {
               this.isTop = true
           }
        }
    }
}
</script>
<style lang="scss" scoped>
.setting {
    position: fixed;
    right: 10px;
    bottom: 60px;
    z-index: 2;
    img {
        width: 30px;
        height: 30px;
        cursor: pointer;
    }
}
</style>