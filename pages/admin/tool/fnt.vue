<template>
    <div class="fnt-pane">
        <CssSprite />
    </div>
</template>
<script>
import CssSprite from '~/components/CssSprite'
export default {
    layout: 'admin',
    components: {
        CssSprite
    }
}
</script>
<style lang="scss" scoped>
.fnt-pane {
    box-sizing: border-box;
    padding: 10px;
}
</style>