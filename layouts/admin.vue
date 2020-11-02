<template>
    <div class="admin-layout" id="app">
        <SideBar
            :routes="routesData"
            class="side-bar"
            :class="sideBarStyle"
            :isCollapse="!sidebar.isOpen"
        />
        <section :class="rightSideStyle" class="right-side">
            <NavBar class="app-nav" :class="navBarStyle" />
            <div class="app-main">
                <nuxt></nuxt>
            </div>
        </section>
    </div>
</template>
<script>
import SideBar from './components/SideBar'
import NavBar from './components/NavBar'
import '~/styles/element-ui.scss'
import { mapState } from 'vuex'
import routes from '~/config/adminRoutes'
export default {
    middleware: 'authenticated',
    data() {
        return {
            routesData: routes,
        }
    },
    mounted() {
        this.$store.commit('user/SET_MESSAGE', {
            username: sessionStorage.getItem('cms_username'),
            avatar: sessionStorage.getItem('cms_avatar'),
            id: sessionStorage.getItem('cms_id')
        })
    },
    components: {
        SideBar,
        NavBar,
    },
    computed: {
        ...mapState({
            sidebar: (state) => state.admin.sidebar,
            navbar: (state) => state.admin.navbar,
        }),
        rightSideStyle() {
            return {
                withSideBar: this.sidebar.isOpen,
            }
        },
        sideBarStyle() {
            return {
                openSideBar: this.sidebar.isOpen,
            }
        },
        navBarStyle() {
            return {
                'fixed-header': this.navbar.fixed,
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.admin-layout {
    width: 100vw;
    height: 100vh;
    overflow-y: auto;
    .side-bar {
        width: $sideBarWidth_c;
    }
    .openSideBar {
        width: $sideBarWidth;
    }
    .right-side {
        box-sizing: border-box;
        min-height: 100%;
        margin-left: $sideBarWidth_c;
        background: $adminViewBg;
        .app-nav {
            background: #fff;
        }
        .fixed-header {
            position: fixed;
            top: 0;
            z-index: 98;
            & + .app-main {
                margin-top: $navBarHeight;
            }
        }
        .fixed-header.app-nav {
            width: calc(100% - #{$sideBarWidth_c});
        }
    }
    .withSideBar {
        margin-left: $sideBarWidth;
        .fixed-header.app-nav {
            width: calc(100% - #{$sideBarWidth});
        }
    }
}

.app-main {
    box-sizing: border-box;
}
</style>