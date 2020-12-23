<template>
    <div class="login-bg">
        <div class="login-box">
            <h1>Login</h1>
            <el-row>
                <el-col :span="24">
                    <el-form :model="loginForm">
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
                            <vue-recaptcha
                                @verify="verifyHuman"
                                @expired="verifyExpired"
                                :sitekey="sitekey"
                                :loadRecaptchaScript="true"
                                recaptchaHost="recaptcha.net"
                            >
                            </vue-recaptcha>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="primary"
                                style="width: 100%"
                                @click="login"
                                >Login</el-button
                            >
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import VueRecaptcha from 'vue-recaptcha'
import { sitekey } from '~/config/recaptcha'
export default {
    layout: 'blog',
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
            },
            redirectPath: '/',
            sitekey: sitekey,
            verifyToken: '',
        }
    },
    components: {
        VueRecaptcha,
    },
    mounted() {
        this.redirectPath = this.$route.query.p || this.redirectPath
        this.$store.dispatch('app/toggleLoading', 2)
    },
    methods: {
        login() {
            if (this.verifyToken) {
                this.$store
                    .dispatch('user/login', {
                        username: this.loginForm.username,
                        password: this.loginForm.password,
                        recaptchaToken: this.verifyToken,
                    })
                    .then(() => {
                        this.$message({
                            message: '登录成功',
                            type: 'success',
                        })
                        this.loginForm.username = ''
                        this.loginForm.password = ''
                        this.$store.dispatch('app/toggleLoading', 1)
                        setTimeout(() => {
                            this.$router.push(this.redirectPath)
                        }, 1000)
                    })
                    .catch((err) => {
                        this.$message({
                            message: `登录失败,${err}`,
                        })
                    })
            } else {
                this.$message({
                    type: 'error',
                    message: `未验证`,
                })
            }
        },
        verifyHuman(response) {
            this.verifyToken = response
        },
        verifyExpired() {
            this.verifyToken = ''
        },
    },
}
</script>
<style lang="scss" scoped>
.login-box {
    position: absolute;
    min-width: 320px;
    max-width: 500px;
    height: 400px;
    padding: 0 50px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    text-align: center;
    h1 {
        line-height: 1.6;
        margin-bottom: 30px;
    }
}
</style>