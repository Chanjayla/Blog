<template>
    <div class="login-container">
        <div class="login-box">
            <h1>Login Form</h1>
            <el-row>
                <el-col :span="24">
                    <el-form :model="loginForm" >
                        <el-form-item>
                            <el-input
                                v-model="loginForm.username"
                                placeholder="Username"
                                prefix-icon="el-icon-user-solid"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input
                                v-model="loginForm.password"
                                placeholder="Password"
                                prefix-icon="el-icon-lock"
                                :show-password="true"
                                type="password"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 100%;" @click="login">Login</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    layout: 'empty',
    components: {},
    mounted() {
        
    },
    methods: {
        login() {
            this.$store.dispatch('user/login', {
                username: this.loginForm.username,
                password: this.loginForm.password
            }).then(() => {
                this.$message({
                    message: '登录成功',
                    type: 'success'
                })
                this.loginForm.username = ''
                this.loginForm.password = ''
                setTimeout(() => {
                    this.$router.push('/admin/dashboard')
                },2000)
            }).catch((err) => {
                this.$message({
                    message: `登录失败,${err}`
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.login-container {
    width: 100%;
    height: 100vh;
    background: #2d3a4b;
    .login-box {
        position: absolute;
        min-width: 320px;
        max-width: 500px;
        height: 400px;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        padding: 0 50px;
        color: #fff;
        overflow: hidden;
        text-align: center;
        h1 {
            line-height: 1.6;
            margin-bottom: 30px;
        }
    }
}
</style>


