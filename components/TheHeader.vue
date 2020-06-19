<template>
  <div class="app-header">
    <div class="app-header__menu">
      <ul>
        <li>
          <i class="iconfont icon-home"></i>
          <nuxt-link to="/">首页</nuxt-link>
        </li>
        <li>
          <i class="iconfont icon-pen"></i>
          <nuxt-link to="/article">文章</nuxt-link>
        </li>
        <li>
          <i class="iconfont icon-music"></i>
          <nuxt-link to="/music">音乐</nuxt-link>
        </li>
        <li>
          <i class="iconfont icon-games"></i>
          <nuxt-link to="/game">游戏</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang='ts'>

export default {

}
</script>
<style lang="scss" scoped>
.app-header {
  box-sizing: border-box;
  width: 100%;
  height: $headerHeight;
  line-height: $headerHeight;
  padding: 0 100px;
  border-bottom: 1px solid $borderColor;
  font-weight: 600;
  color: $normalFontColor;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 40px -8px;
  background: rgba(255, 255, 255, 0.9);
  &__menu {
    ul {
      height: $headerHeight;
      list-style-type: none;
      font-size: 0;
      li {
        box-sizing: border-box;
        position: relative;
        display: inline-flex;
        padding: 0 20px;
        justify-content: center;
        align-items: center;
        height: $headerHeight;
        overflow: hidden;
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: $linkHoverColor;
          transition: transform 0.2s linear;
          transform: translateX(-100%);
        }
        &:hover::after {
          transform: translateX(0);
        }
        &:hover i {
          color: #00b2fe;
        }
        &:hover a{
          color: #00b2fe;
        }
        i {
          font-size: 18px;
          vertical-align: center;
        }
        a {
          margin-left: 10px;
          font-size: 16px;
        }
        .router-link-exact-active::after {
          transform: translateX(0);
        }
      }
    }
  }
}
</style>
