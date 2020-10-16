<template>
    <div id="app" :class="`${themeName}`">
        <the-header :class="`${themeName}-header`"></the-header>
        <nuxt class="main-box" :class="`${themeName}-main`" />
        <loadingMask :status="loading" :class="`${themeName}-loading`"/>
        <the-footer :class="`${themeName}-footer`"></the-footer>
    </div>
</template>
<script>
import theHeader from './components/Header.vue'
import theFooter from './components/Footer.vue'
import loadingMask from '~/components/Loading/loading.vue'
import { mapState } from 'vuex'
export default {
    components: {
        theHeader,
        theFooter,
        loadingMask
    },
    computed: {
        ...mapState({
            themeName: (state) => state.app.themeName,
            loading: (state) => state.app.loading
        })
    },
    mounted() {
        const theme = sessionStorage.getItem('theme_id') || 0
        this.$store.dispatch('app/toggleTheme', theme)
    }
}
</script>
<style lang="scss">
@import '~/styles/blog.scss';
#app {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    background: $blogBgColor;
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
