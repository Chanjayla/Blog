<template>
    <div class="app-header">
        <div class="app-header__tit" :style="`color: ${theme.headerColor}`">
            Genos's Blog
        </div>
        <div class="app-header__menu">
            <ul>
                <li v-for="route in routes" :key="route.path" :class="{active: route.path == activeRoute}">
                    <i :class="`iconfont ${route.icon}`" :style="`color: ${theme.headerColor}`"></i>
                    <nuxt-link :to="route.path" :style="`color: ${theme.headerColor}`">{{route.name}}</nuxt-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    data() {
        return {
            routes: [
                {
                    path: '/blog',
                    name: 'Home',
                    icon: 'icon-home',
                },
                {
                    path: '/blog/list',
                    name: 'Blog',
                    icon: 'icon-pen',
                },
                {
                    path: '/component',
                    name: 'Component',
                    icon: 'icon-3801wenjian',
                },
            ],
            activeRoute: ''
        }
    },
    mounted() {
      this.activeRoute = this.$route.path

    },
    computed: {
        ...mapState({
            theme: (state) => state.app.theme
        })
    },
    watch: {
      $route() {
        this.activeRoute = this.$route.path
      }
    }
}
</script>
<style lang="scss" scoped>
.app-header {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: $headerHeight;
    padding: 0 20px;
    line-height: $headerHeight;
    font-weight: 600;
    background: transparent;
    white-space: nowrap;
    overflow-x: auto;
    z-index: 99;
    &__tit {
        color: $headerColor;
        font-weight: 600;
        font-size: 20px;
    }
    &__menu {
        ul {
            height: $headerHeight;
            list-style-type: none;
            font-size: 0;
            li {
                box-sizing: border-box;
                position: relative;
                display: inline-flex;
                padding: 0 10px;
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
                    transform: translateX(-110%);
                }
                &:hover::after {
                    transform: translateX(0);
                }
                &:hover i {
                    color: $linkHoverColor;
                }
                &:hover a {
                    color: $linkHoverColor;
                }
                i {
                    font-size: 16px;
                    vertical-align: center;
                    color: $headerColor;
                }
                a {
                    margin-left: 10px;
                    font-size: 14px;
                    color: $headerColor;
                }
            }
            .active {
              i {
                color: $linkHoverColor;
              }
              a {
                color: $linkHoverColor;
              }
              &::after {
                transform: translateX(0);
              }
            }
        }
    }
}
</style>
