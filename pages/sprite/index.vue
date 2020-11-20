<template>
    <div class="fnt-pane">
        <div class="mask"></div>
        <Sprite />
    </div>
</template>
<script>
import Sprite from '~/components/Sprite'
export default {
    layout: 'blog',
    components: {
        Sprite
    }
}
</script>
<style lang="scss" scoped>
.fnt-pane {
    box-sizing: border-box;
    .mask {
        width: 100%;
        height: $headerHeight;
    }
}
</style>