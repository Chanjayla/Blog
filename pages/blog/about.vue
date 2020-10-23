<template>
    <div class="about-box">
        <div class="about-box__header">
            <div class="mask"></div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'blog',
    transition: 'blog',
    mounted() {
        this.$store.dispatch('app/toggleLoading', 2)
    },
}
</script>
<style lang="scss" scoped>
.about-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding-top: 510px;
    transition: all 0.2s ease;
    @media screen and (max-width: 640px) {
        min-width: 0;
    }
    &__header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 21vw;
        background-image: url(/about_page_header.webp);
        background-attachment: fixed;
        background-size: 100%;
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5;
        }
    }
}
</style>
