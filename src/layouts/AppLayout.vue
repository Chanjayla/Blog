<template>
  <div class="app-layout">
    <app-header class="app-layout__header"></app-header>
    <div class="app-layout__content">
        <router-view></router-view>
    </div>
    <app-footer class="app-layout__footer"></app-footer>
  </div>
</template>
<script>
import { Vue, Component } from 'vue-property-decorator'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
@Component({
  components: {
    AppHeader,
    AppFooter
  }
})
export default class AppLayout extends Vue {

}
</script>
<style lang="scss">
.app-layout {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 80px;
  // padding-bottom: 30px;
  &__header {
    position: absolute;
    top: 0;
    left: 0;
  }
  &__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  &__footer {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}

</style>
