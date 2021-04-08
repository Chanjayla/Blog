<template>
    <div class="profile-box">
        <el-form>
            <el-form-item class="form-item">
                <div class="avatar" @click="showDrawer">
                    <img :src="avatar" alt="" />
                    <span>
                        <i class="el-icon-edit"></i>
                    </span>
                </div>
            </el-form-item>
            <el-form-item label="Name" class="form-item">
                <MDInput name="name" ref="name" :value="name" />
            </el-form-item>
            <el-form-item label="Password" class="form-item">
                <MDInput
                    name="pwd"
                    ref="pwd"
                    :readonly="true"
                    value="********"
                />
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" round @click="sendModify">Save</el-button>
            <el-button type="primary" round @click="modifyPwd"
                >ChangePwd</el-button
            >
        </div>
        <el-drawer
            :visible.sync="drawer"
            :with-header="false"
            size="40%"
            @close="closeDrawer"
        >
            <div style="height: 100vh; overflow: auto">
                <PicList
                    @select="selectOnline"
                    filter="image"
                    :hiddenName="true"
                />
            </div>
        </el-drawer>
        <el-dialog
            title="Change Password"
            :visible.sync="pwdDialogVisible"
            width="30%"
        >
            <el-form>
                <el-form-item label="Old Password">
                    <el-input
                        v-model="oldPwd"
                        placeholder="Old Password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="New Password">
                    <el-input
                        v-model="newPwd"
                        placeholder="New Password"
                        type="password"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Confirm Password">
                    <el-input
                        v-model="confirmPwd"
                        placeholder="Confirm Password"
                        type="password"
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="pwdDialogVisible = false">Close</el-button>
                <el-button type="primary" @click="modifyPwd">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import MDInput from '~/components/Input/MDInput'
import PicList from '~/components/List/PicList'
import * as User from '~/api/user'
export default {
    layout: 'admin',
    data() {
        return {
            inSelectStatus: false,
            drawer: false,
            name: '',
            avatar: '',
            id: '',
            pwdDialogVisible: false,
            oldPwd: '',
            newPwd: '',
            confirmPwd: '',
        }
    },
    mounted() {
        setTimeout(() => {
            this.name = this.$store.state.user.username
            this.avatar = this.$store.state.user.avatar
            this.id = this.$store.state.user.id
        }, 0)
    },
    components: {
        MDInput,
        PicList,
    },
    computed: {},
    methods: {
        sendModify() {
            if (this.id) {
                User.modify({
                    id: this.id,
                    name: this.$refs['name'].currentValue,
                    avatar: this.avatar,
                }).then((res) => {
                    if (res.data.code === 0) {
                        const username = this.$refs['name'].currentValue
                        sessionStorage.setItem('cms_username', this.name)
                        sessionStorage.setItem('cms_avatar', this.avatar)
                        this.$store.commit('user/SET_MESSAGE', {
                            username: username,
                            avatar: this.avatar,
                        })
                        this.$message({
                            type: 'success',
                            message: '更新成功',
                        })
                    } else {
                        this.$message({
                            type: 'fail',
                            message: '更新失败',
                        })
                    }
                })
            }
        },
        modifyPwd() {
            if (this.id) {
                if (this.pwdDialogVisible) {
                    if (!this.oldPwd || !this.newPwd || !this.confirmPwd) {
                        this.$message({
                            type: 'error',
                            message: 'Please input password',
                        })
                        return
                    }
                    if (this.newPwd !== this.confirmPwd) {
                        this.$message({
                            type: 'error',
                            message: 'NewPwd is not same with confirmPwd',
                        })
                        return
                    }
                    if (this.oldPwd === this.newPwd) {
                        this.$message({
                            type: 'error',
                            message: 'OldPwd is same with newPwd',
                        })
                        return
                    }
                    User.modifyPwd({
                        id: this.id,
                        oldPwd: this.oldPwd,
                        newPwd: this.newPwd,
                    }).then((res) => {
                        if (res.data.code === 200) {
                            this.pwdDialogVisible = false
                            this.$message({
                                type: 'success',
                                message: 'Change successFully',
                            })
                        } else {
                            this.$message({
                                type: 'error',
                                message: 'Change error',
                            })
                        }
                    })
                    this.newPwd = ''
                    this.oldPwd = ''
                    this.confirmPwd = ''
                } else {
                    this.pwdDialogVisible = true
                }
            }
        },
        selectOnline(path) {
            if (this.inSelectStatus) {
                this.avatar = path
            }
        },
        showDrawer() {
            this.inSelectStatus = true
            this.drawer = true
        },
        closeDrawer() {},
    },
}
</script>
<style lang="scss" scoped>
.profile-box {
    box-sizing: border-box;
    min-height: 300px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    background: #fff;
    border-radius: 5px;
    .avatar {
        position: relative;
        width: 100px;
        height: 100px;
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        img {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
        }
        span {
            display: none;
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background-color: rgba(0, 0, 0, 0.5);
            i {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 30px;
                height: 30px;
                font-size: 30px;
                color: #fff;
            }
        }
        &:hover span {
            display: block;
        }
    }
}
</style>