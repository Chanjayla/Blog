<template>
  <div class="app-header">
    <div class="app-header__menu">
      <ul>
        <li>
          <router-link to="/" >首页</router-link>
        </li>
        <li>
          <router-link to="/article/front">前端</router-link>
        </li>
        <li>
          <router-link to="/article/server">后端</router-link>
        </li>
        <li>
          <router-link to="/article/game">游戏</router-link>
        </li>
      </ul>
    </div>
    <div class="app-header__admin-box"></div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'

@Component({})
export default class AppHeader extends Vue {
  mounted (): void {
    // this.routeName = this.$route.params.id
  }

  @Watch('$route')
  routeChange (to: Route): void {
    // this.routeName = to.params.id
  }
}
</script>
<style lang="scss" scoped>
.app-header {
  box-sizing: border-box;
  width: 100%;
  height: 80px;
  line-height: 80px;
  padding: 0 100px;
  background: $headerBgColor;
  border-bottom: 1px solid $borderColor;
  font-size: 18px;
  font-weight: 600;
  color: $normalFontColor;
  overflow: hidden;
  &__menu {
    height: 80px;
    ul {
      list-style-type: none;
      li {
        display: inline-block;
        a {
          box-sizing: border-box;
          display: inline-block;
          height: 80px;
          padding: 0 30px;
          transition: border-width .2s ease;
        }
        .router-link-exact-active {
            color: $linkHoverColor;
            border-bottom: 4px solid $linkHoverColor;
        }
      }
    }
  }
}
</style>
