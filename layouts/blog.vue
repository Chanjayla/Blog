<template>
    <div id="app" :class="`${themeName}`">
        <the-header :class="`${themeName}-header`"></the-header>
        <nuxt class="main-box" :class="`${themeName}-main`" />
        <loadingMask :status="loadingStatus" :class="`${themeName}-loading`"/>
        <setting></setting>
        <the-footer :class="`${themeName}-footer`"></the-footer>
    </div>
</template>
<script>
import theHeader from './components/BlogHeader.vue'
import theFooter from './components/BlogFooter.vue'
import loadingMask from '~/components/Loading/loading.vue'
import setting from '~/components/Setting/index.vue'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            loadingStatus: 0
        }
    },
    components: {
        theHeader,
        theFooter,
        loadingMask,
        setting
    },
    fetch() {
        this.loadingStatus = this.$store.state.app.loading
    },
    watch: {
        loading() {
            this.loadingStatus = this.loading
        }
    },
    computed: {
        ...mapState({
            themeName: (state) => state.app.themeName,
            loading: (state) => state.app.loading
        })
    }
}
</script>
<style lang="scss">
@import '~/styles/blog.scss';
#app {
    position: relative;
    @media screen and (min-width: $minViewWidth) {
        width: 100%;
    }
    @media screen and (max-width: $minViewWidth) {
        width: $minViewWidth;
    }
    @media screen and (max-width: $mobileWidth) {
        width: 100%;
    }
}
.main-box {
    margin: 0 auto;
    min-height: calc(100vh - #{$footerHeight});
}
</style>
