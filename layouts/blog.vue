<template>
    <div id="app" :class="`${themeName}`">
        <the-header :class="`${themeName}-header`"></the-header>
        <nuxt class="main-box" :class="`${themeName}-main`" />
        <loadingMask :status="loadingStatus" :class="`${themeName}-loading`"/>
        <setting></setting>
        <the-footer :class="`${themeName}-footer`"></the-footer>
        <template v-if="csrAplayer">
            <component :is="csrAplayer"></component>
        </template>
        <template v-else>
             <i class="iconfont icon-music aplayer-on" @click="openAplayer"></i>
        </template>
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
            loadingStatus: 0,
            csrAplayer: null
        }
    },
    components: {
        theHeader,
        theFooter,
        loadingMask,
        setting,
    }, 
    watch: {
        loading() {
            this.loadingStatus = this.loading
        }
    },
    mounted() {
        // this.csrAplayer = () => import('~/components/Music/aplayer.vue')
    },
    computed: {
        ...mapState({
            themeName: (state) => state.app.themeName,
            loading: (state) => state.app.loading
        })
    },
    methods: {
        openAplayer() {
            this.csrAplayer = () => import('~/components/Music/aplayer.vue')
        }
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
    padding-bottom: 30px;
}
.main-box {
    margin: 0 auto;
    min-height: calc(100vh - #{$footerHeight});
}
.aplayer-on {
    position: fixed;
    width: 50px;
    height: 50px;
    bottom: 10px;
    left: 10px;
    font-size: 30px;
    color: #ccc;
    cursor: pointer;
    &:hover {
        color: #00b2ff;
    }
}
</style>
