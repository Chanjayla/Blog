<template>
    <div>
        <div class="drawer" :class="{'drawerShow': drawerShow}">
            <div class="setting" @click="openDrawer">
                <i :class="iconClass"></i>
            </div>
            <h2>Global setting</h2>
            <div class="drawer-item">
                <span>fixed Navbar:</span>
                <el-switch v-model="navbarFixed" @change="navbarFixedChange"></el-switch>
            </div>
            <h2>Custom setting</h2>
            <slot>
                <div class="drawer-item">无</div>
            </slot>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            drawerShow: false,
            navbarFixed: false
        }
    },
    methods: {
        openDrawer() {
            this.drawerShow = !this.drawerShow
        },
        navbarFixedChange(value) {
            this.$store.dispatch('admin/setNavBarFixed', value)
        }
    },
    computed: {
        iconClass() {
            return this.drawerShow ? 'el-icon-close' : 'el-icon-setting'
        },
    },
}
</script>
<style lang="scss" scoped>
.setting {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -36px;
    bottom: 500px;
    width: 36px;
    height: 36px;
    border-bottom-left-radius: 30%;
    border-top-left-radius: 30%;
    background: #00b2ff;
    z-index: 99;
    cursor: pointer;
    i {
        font-size: 24px;
        color: white;
    }
}
.drawer {
    box-sizing: border-box;
    position: fixed;
    right: 0;
    top: 0;
    width: 200px;
    height: 100vh;
    padding: 20px 0 0 20px;
    transform: translateX(100%);
    transition: transform 0.2s ease;
    background: white;
    border-left: 1px solid #eee;
    z-index: 99;
    h2 {
        font-size: 14px;
    }
    &-item {
        display: flex;
        align-items: center;
        margin: 10px 0;
        font-size: 12px;
        color: $secondaryFontColor;
        span {
            float: left;
            width: 50%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
.drawerShow {
    transform: translateX(0);
}
</style>