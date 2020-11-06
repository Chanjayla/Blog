<template>
    <div class="app-header">
        <div
            class="mask app-header__mask"
            :class="`${themeName}-mask`"
            :style="isTop ? 'background: transparent;' : ''"
        ></div>
        <div class="app-header__tit">
            Genos's Blog
            <i :class="themeId > 0 ? 'night' : 'noon'" @click="changeTheme"></i>
        </div>
        <div class="app-header__menu">
            <div
                v-if="isMobile"
                class="mobile-nav-btn"
                :class="{ 'mobile-nav-btn-active': navOpen }"
                @click="touchNav"
            >
                <i></i>
                <i></i>
                <i></i>
            </div>

            <ul
                :class="{
                    'mobile-nav-active': navOpen,
                    'mobile-nav': isMobile,
                }"
            >
                <li
                    v-for="route in routes"
                    :key="route.path"
                    :class="{ active: route.path == activeRoute }"
                >
                    <i :class="`iconfont ${route.icon}`"></i>
                    <nuxt-link :to="route.path">{{ route.name }}</nuxt-link>
                </li>
            </ul>
            <Search />
        </div>
    </div>
</template>
<script>
import Sticky from '~/components/Sticky'
import Search from '~/components/Search'
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
                // {
                //     path: '/blog/about',
                //     name: 'About',
                //     icon: 'icon-tag',
                // },
                // {
                //     path: '/component',
                //     name: 'Component',
                //     icon: 'icon-3801wenjian',
                // },
            ],
            activeRoute: '',
            activeRouteName: '',
            isTop: true,
            navOpen: false,
        }
    },
    mounted() {
        this.activeRoute = this.$route.path
        document.addEventListener('scroll', this.setTop.bind(this))

    },
    destroyed() {
        document.removeEventListener('scroll', this.setTop.bind(this))
    },
    watch: {
        $route() {
            this.activeRoute = this.$route.path
            this.activeRouteName = this.$route.name
        },
    },
    methods: {
        changeTheme() {
            this.$store.dispatch('app/toggleTheme', 1 - this.themeId)
        },
        touchNav() {
            this.navOpen = !this.navOpen
        },
        setTop(e) {
            const scrollTop =
                pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop
            if(this.activeRouteName === 'blog-id') {
                this.isTop = false
                return
            }
            if (scrollTop > 30) {
                this.isTop = false
            } else {
                this.isTop = true
            }
        },
    },
    computed: {
        ...mapState({
            themeId: (state) => state.app.themeId,
            themeName: (state) => state.app.themeName,
            isMobile: (state) => state.app.isMobile,
        }),
        mobileNavStyle() {
            return this.isMobile ? 'mobile-nav-list' : ''
        },
    },
    components: {
        Sticky,
        Search,
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
        width: 100%;
        transition: all 0.2s ease;
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
        display: flex;
        justify-content: center;
        align-items: center;
        @media screen and (max-width: $mobileWidth) {
            flex-direction: row-reverse;
        }
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
        .mobile-nav {
            position: fixed;
            top: $headerHeight;
            right: 0;
            transform: translateX(100%);
            transition: transform 250ms ease 0s;
            li {
                display: block;
                height: 30px;
                line-height: 30px;
                &::after {
                    display: none;
                }
            }
        }
        .mobile-nav-active {
            transform: translateX(0);
        }
        .mobile-nav-btn {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 15px;
            height: 12px;
            margin-left: 10px;
            i {
                display: block;
                width: 15px;
                height: 2px;
                transition: all 0.2s ease;
                background: #fff;
            }
        }
        .mobile-nav-btn-active {
            i:nth-child(1) {
                transform: rotate(45deg) translate(.2rem, .26rem);
            }
            i:nth-child(2) {
                transition: all 0.1s ease;
                visibility: hidden;
            }
            i:nth-child(3) {
                transform: rotate(-45deg) translate(.2rem, -.26rem);
            }
        }
    }
}
</style>
