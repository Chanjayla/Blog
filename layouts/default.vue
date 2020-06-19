<template>
  <div>
    <the-header></the-header>
    <nuxt />
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
<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

</style>
