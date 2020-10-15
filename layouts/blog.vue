<template>
    <div id="app" :class="`${themeName}`">
        <the-header :class="`${themeName}-header`"></the-header>
        <nuxt class="main-box" :class="`${themeName}-main`" />
        <div class="main-mask" :class="loadingStyles">
            <p class="text">Loading...</p>
        </div>
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
            themeName: (state) => state.app.themeName,
            loading: (state) => state.app.loading
        }),
        loadingStyles() {
            const themeStyle = this.themeName + '-loading'
            let activeStyle = ''
            if(this.loading == 1) {
                activeStyle = 'loading-enter'
            } else if(this.loading == 2) {
                activeStyle = 'loading-end'
            }
            return [themeStyle, activeStyle]
        }
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
.main-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transform: translateX(100%);
    z-index: -1;
    .text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        font-size: 24px;
        opacity: 0;

    }
}
.loading-enter {
    transition: all .5s ease-in-out;
    transform: translateX(0);
    z-index: 98;
    .text {
        opacity: 1;
        transition: all .2s .5s ease;
    }
}
.loading-end {
    transition: all .5s ease-in-out;
    opacity: 0;
    z-index: 98;
}
</style>
