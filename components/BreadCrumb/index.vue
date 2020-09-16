<template>
    <div class="breadcrumb">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item
                v-for="item in breadcrumb"
                :key="item.path"
                :to="item.path"
            >{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<script>
import { pathMap } from '~/config/adminRoutes'
export default {
    data() {
        return {
            breadcrumb: []
        }
    },
    mounted() {
        this.breadcrumb = this.getRoutePath()
    },
    methods: {
        getRoutePath() {
            const paths = [pathMap['/admin/dashboard']]
            this.$route.path !== '/admin/dashboard' &&
                paths.push(pathMap[this.$route.path])
            return paths
        }
    },
    watch: {
        $route(route) {
            this.breadcrumb = this.getRoutePath()
        }
    }
}
</script>
<style lang="scss" scoped>
.breadcrumb {
    margin-left: 15px;
    color: #666;
}
</style>