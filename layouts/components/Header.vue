<template>
        <div class="app-header">
            <div class="app-header__mask" :class="`${themeName}-mask`"></div>
            <div class="app-header__tit">
                Genos's Blog
                <i :class="themeId?'night':'noon'" @click="changeTheme"></i>
            </div>
            <div class="app-header__menu">
                <ul>
                    <li
                        v-for="route in routes"
                        :key="route.path"
                        :class="{active: route.path == activeRoute}"
                    >
                        <i :class="`iconfont ${route.icon}`"></i>
                        <nuxt-link :to="route.path">{{route.name}}</nuxt-link>
                    </li>
                </ul>
            </div>
        </div>
</template>
<script>
import Sticky from '~/components/Sticky'
import { mapState } from 'vuex'
import { headerColor, normalFontColor } from '~/styles/variables.scss'
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
                // {
                //     path: '/component',
                //     name: 'Component',
                //     icon: 'icon-3801wenjian',
                // },
            ],
            activeRoute: '',
        }
    },
    mounted() {
        this.activeRoute = this.$route.path
    },
    watch: {
        $route() {
            this.activeRoute = this.$route.path
        },
    },
    methods: {
        changeTheme() {
            this.$store.dispatch('app/toggleTheme', normalFontColor)
        },
    },
    computed: {
        ...mapState({
            themeId: (state) => state.app.themeId,
            themeName: (state) => state.app.themeName
        }),
    },
    components: {
        Sticky,
    },
}
</script>
<style lang="scss" scoped>
.app-header {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: fixed;
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
    &__mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    background-image: url('data:image/png;base64,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');
    background-repeat: repeat;
    transition: height .2s ease;
    z-index: -1;
    }
    &__tit {
        display: flex;
        align-items: center;
        font-weight: 600;
        font-size: 20px;
        .noon {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-left: 10px;
            border-radius: 50%;
            background: #fff;
            overflow: hidden;
            cursor: pointer;
            &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: -24px;
                left: -24px;
                border-radius: 50%;
                background: #000;
                transition: all 0.2s linear;
            }
        }
        .night {
            position: relative;
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-left: 10px;
            border-radius: 50%;
            background: #fff;
            overflow: hidden;
            cursor: pointer;
            &::before {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                top: -10px;
                left: -10px;
                border-radius: 50%;
                background: #000;
                transition: all 0.2s linear;
            }
        }
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
                    font-size: 14px;
                    vertical-align: center;
                }
                a {
                    margin-left: 10px;
                    font-size: 14px;
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
