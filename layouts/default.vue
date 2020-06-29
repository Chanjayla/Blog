<template>
  <div>
    <the-header></the-header>
    <nuxt class="main-box" />
    <the-footer></the-footer>
  </div>
</template>
<script lang="ts">
import theHeader from '~/components/TheHeader.vue'
import theFooter from '~/components/TheFooter.vue'
export default {
  components: {
    theHeader,
    theFooter
  }
}
</script>
<style lang="scss">
.main-box {
  min-height: calc(100vh - #{$headerHeight} - #{$footerHeight});
}
</style>
