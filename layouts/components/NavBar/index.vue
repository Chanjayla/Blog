<template>
    <div class="nav-container">
        <div class="nav-btn" @click="toggleSideBar">
            <i class="el-icon-s-operation"></i>
        </div>
        <BreadCrumb />
        <div class="nav-user">
            <span>{{ username }}</span>
            <img v-show="avatar" :src="avatar" :alt="username">
        </div>
    </div>
</template>
<script>
import BreadCrumb from '~/components/BreadCrumb'
import { mapState } from 'vuex'
export default {
    data() {
        return {

        }
    },
    mounted() {

    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('admin/toggleSideBar')
        }
    },
    components: {
        BreadCrumb
    },
    computed: {
        ...mapState({
            username: (state) => state.user.username,
            avatar: (state) => state.user.avatar
        })
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
    .nav-user {
        display: flex;
        position: absolute;
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        align-items: center;
        img {
            width: 36px;
            height: 36px;
            margin: 0 10px;
            border-radius: 50%;
        }
        span {
            font-size: 16px;
        }
    }
}
</style>