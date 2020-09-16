<template>
    <div class="side-bar" style="background: #304156">
        <el-menu
            class="el-menu-vertical"
            background-color="#304156"
            text-color="#bfcbd9"
            @select="handleSelect"
            :collapse="isCollapse"
        >
            <div v-for="route in routes" :key="route.name">
                <el-submenu v-if="!!route.children" :index="route.name">
                    <template slot="title">
                        <i :class="route.icon"></i>
                        <span slot="title">{{route.name}}</span>
                    </template>
                    <el-menu-item
                        :index="child.path"
                        v-for="child in route.children"
                        :key="child.name"
                    >
                        <i :class="child.icon"></i>
                        <span slot="title">{{child.name}}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="route.path">
                    <i :class="route.icon"></i>
                    <span slot="title">{{route.name}}</span>
                </el-menu-item>
            </div>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // activeRoute: null
        }
    },
    props: ['routes', 'isCollapse'],
    mounted() {
        // this.activeRoute = this.$route
    },
    computed: {

    },
    methods: {
        handleSelect(index, indexPath) {
            this.$router.push(index)
        }
    }
}
</script>
<style lang="scss" scoped>
.side-bar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    transition: all 0.2s ease;
    z-index: 99;
    .el-menu-vertical {
        min-height: 100%;
    }
}
</style>