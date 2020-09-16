<template>
    <div class="nav-container">
        <div class="nav-btn" @click="toggleSideBar">
            <i class="el-icon-s-operation"></i>
        </div>
        <BreadCrumb />
    </div>
</template>
<script>
import BreadCrumb from '~/components/BreadCrumb'
export default {
    methods: {
        toggleSideBar() {
            this.$store.dispatch('admin/toggleSideBar')
        }
    },
    components: {
        BreadCrumb
    }
}
</script>
<style lang="scss" scoped>
.nav-container {
    box-sizing: border-box;
    display: flex;
    position: relative;
    height: 50px;
    align-items: center;
    padding-left: 10px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .nav-btn {
        [class^='el-icon-'] {
            font-size: 20px;
            color: #444;
            cursor: pointer;
        }
    }
}
</style>