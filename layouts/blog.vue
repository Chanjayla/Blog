<template>
    <div id="app" :class="`${themeName}`">
        <the-header :class="`${themeName}-header`"></the-header>
        <nuxt class="main-box" :class="`${themeName}-main`" />
        <the-footer :class="`${themeName}-footer`"></the-footer>
    </div>
</template>
<script>
import theHeader from './components/Header.vue'
import theFooter from './components/Footer.vue'
import { mapState } from 'vuex'
export default {
    components: {
        theHeader,
        theFooter,
    },
    computed: {
        ...mapState({
            themeName: (state) => state.app.themeName
        }),
    },
    mounted() {
        const theme = sessionStorage.getItem('theme_id') || 0
        console.log(theme)
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
    min-height: calc(100vh - #{$headerHeight} - #{$footerHeight});
}

</style>
