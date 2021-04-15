<template>
    <div class="release-manager">
        <div class="release-manager__tit">All Release:</div>
        <div class="release-manager__row">
            <el-tag
                class="release-manager__item"
                v-for="item in releaseData"
                :key="item.id"
                closable
                @close="deleteRelease(item)"
                @click="handleClick(item)"
                >{{ item.title }}</el-tag
            >
            <el-button
                style="height: 32px; margin: 10px"
                size="small"
                @click="addRelease"
                >+ New Release</el-button
            >
        </div>
        <div class="release-manager__add">
            <div class="release-manager__add__item">
                <el-input
                    v-model="addTitle"
                    :show-word-limit="true"
                    maxlength="50"
                    size="medium"
                    placeholder="title"
                ></el-input>
            </div>
            <div class="release-manager__add__item">
                <el-input
                    v-model="addUrl"
                    :show-word-limit="true"
                    maxlength="50"
                    size="medium"
                    placeholder="url"
                ></el-input>
            </div>
            <div class="release-manager__add__item">
                <el-input
                    v-model="addDesc"
                    :show-word-limit="true"
                    maxlength="50"
                    size="medium"
                    placeholder="description"
                ></el-input>
            </div>
            <div class="release-manager__add__item">
                <el-button
                    type="primary"
                    icon="el-icon-document"
                    size="medium"
                    @click="showDrawer"
                    >选择图片</el-button
                >
                <br/>
                <img
                    :src="previewImage"
                    v-show="previewImage"
                />
            </div>
        </div>
        <div class="release-manager__tit">
            Detail: [ {{ selectedItem.title }} ]
        </div>
        <div class="release-manager__row">
            <table class="release-manager__table">
                <thead>
                    <td>标题</td>
                    <td>地址</td>
                    <td>描述</td>
                    <td>预览图</td>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ selectedItem.title }}</td>
                        <td>{{ selectedItem.url }}</td>
                        <td>{{ selectedItem.desc }}</td>
                        <td>
                            <img :src="selectedItem.image">
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <el-drawer
            :visible.sync="drawer"
            :with-header="false"
            size="40%"
            @close="closeDrawer"
        >
            <div style="height: 100vh; overflow: auto">
                <PicList
                    @select="selectPic"
                    filter="image"
                    :hiddenName="true"
                />
            </div>
        </el-drawer>
    </div>
</template>
<script>
import * as Release from '~/api/release'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    data() {
        return {
            addTitle: '',
            addUrl: '',
            addDesc: '',
            releaseData: [],
            selectedItem: {},
            clickTime: 0,
            previewImage: '',
            drawer: false,
        }
    },
    created() {
        this.getAllRelease()
    },
    components: {
        PicList: () => import('~/components/List/PicList')
    },
    computed: {},
    methods: {
        getAllRelease() {
            Release.getAll()
                .then((res) => {
                    if (res.data.code === 0) {
                        this.releaseData = res.data.data
                    }
                })
                .catch((e) => {
                    this.$message({
                        type: 'error',
                        message: '获取数据失败',
                    })
                })
        },
        deleteRelease(item) {
            this.$confirm('确认删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return Release.del({
                        id: item._id,
                    })
                })
                .then((res) => {
                    if (res.data.code === 0) {
                        this.$message({
                            message: '删除成功',
                            type: 'success',
                        })
                        this.getAllRelease()
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除失败',
                    })
                })
        },
        selectItem(item) {
            this.selectedItem = item
        },
        addRelease() {
            if (this.addTitle && this.addUrl) {
                Release.add({
                    title: this.addTitle,
                    url: this.addUrl,
                    image: this.previewImage || '',
                    desc: this.addDesc || ''
                })
                    .then((res) => {
                        if (res.data.code === 0) {
                            this.$message({
                                message: 'Add Success!',
                                type: 'success',
                            })
                            this.getAllRelease()
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error',
                            })
                        }
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            }
        },
        handleClick(item) {
            const clickTime = Date.now() / 1000
            if (clickTime - this.clickTime < 0.5) {
                this.clickTime = 0
                // this.modify(item)
            } else {
                this.selectItem(item)
                this.clickTime = clickTime
            }
        },
        showDrawer() {
            this.drawer = true
        },
        closeDrawer() {
            this.drawer = false
        },
        selectPic(path) {
            this.previewImage = path
            this.drawer = false
        },
    },
}
</script>
<style lang="scss" scoped>
.release-manager {
    box-sizing: border-box;
    padding: 10px;
    &__tit {
        margin: 10px 0;
        font-size: 14px;
    }
    &__row {
        display: flex;
        min-height: 30px;
        align-items: center;
        flex-wrap: wrap;
        border-radius: 5px;
        background: #fff;
    }
    &__item {
        margin: 10px;
        cursor: pointer;
        user-select: none;
    }
    &__table {
        width: 100%;
        padding: 10px;
        img {
            max-width: 100px;
        }
    }
    &__add {
        margin: 5px 0;
        &__item {
            min-height: 40px;
            margin: 5px 0;
            img {
                margin-top: 5px;
            }
        }
    }
}
</style>