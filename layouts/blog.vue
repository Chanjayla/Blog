<template>
    <div id="app">
        <the-header></the-header>
        <nuxt class="main-box" />
        <the-footer></the-footer>
    </div>
</template>
<script lang="ts">
import theHeader from './components/Header.vue'
import theFooter from './components/Footer.vue'
export default {
    components: {
        theHeader,
        theFooter,
    },
}
</script>
<style lang="scss" scoped>
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
    min-height: calc(100vh - #{$headerHeight} - #{$footerHeight});
}
</style>
