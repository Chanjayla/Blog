<template>
    <div class="tag-manager">
        <div class="tag-manager__tit">All Tags:</div>
        <div class="tag-manager__row">
            <el-tag
                class="tag-manager__item"
                v-for="tag in tagsData"
                :key="tag.id"
                closable
                @close="deleteTag(tag)"
                @click="handleClick(tag)"
            >{{tag.name}}</el-tag>
            <el-button style="height: 32px;margin: 10px;" size="small" @click="addTag">+ New Tag</el-button>
        </div>
        <!-- <div class="tag-manager__tit" v-if="selectedTags.length > 0">Default Preview Image: [ {{selectedTags.join(',')}} ]</div>
        <div class="tag-manager__row" style="padding: 10px" v-if="selectedTags.length > 0">
            <el-upload
                    action="/upload/image"
                    name="preview"
                    :with-credentials="true"
                    accept="image/jpeg, image/png"
                    :on-success="uploadSuccess"
                    style="text-align: left;"
                >
                     <el-button size="small" type="primary">点击上传</el-button>
                     <div>
                         <img :src="previewImage" alt="">
                     </div>
                </el-upload>
        </div> -->
        <div class="tag-manager__tit">TAG: [ {{selectedTags.join(',')}} ]</div>
        <div class="tag-manager__row">
            <ArticleTable :tags="selectedTags" />
        </div>
    </div>
</template>
<script>
import ArticleTable from '~/components/Table/ArticleTable'
import * as Tag from '~/api/tag'
import { mapState } from 'vuex'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    components: {
        ArticleTable,
    },
    data() {
        return {
            tagsData: [],
            selectedTags: [],
            clickTime: 0,
            previewImage: ''
        }
    },
    created() {
        this.getAllTags()
    },
    computed: {

    },
    methods: {
        getAllTags() {
            Tag.getAll()
            .then((res) => {
                if (res.data.code === 0) {
                    this.tagsData = res.data.data
                }
            })
            .catch((e) => {
                this.$message({
                    type: 'error',
                    message: '获取标签失败',
                })
            })
        },
        deleteTag(tag) {
            Message.confirm('是否要删除此标签', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            })
                .then(() => {
                    return Tag.del({
                        cid: tag.cid,
                    })
                })
                .then(res => {
                    if(res.data.code === 0) {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getAllTags()
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '删除失败',
                    })
                })
        },
        selectTag(name) {
            const selectTagData = this.tagsData.find(tag => tag.name === name)
            this.selectedTags = [name]
            this.previewImage = selectTagData.defaultPreview
        },
        addTag() {
            this.$prompt('请输入新增标签名', '新增', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[\w\u4e00-\u9fa5]+/,
                inputErrorMessage: '标签名格式不正确',
            })
                .then(({ value }) => {
                    return Tag.add({
                        name: value,
                    })
                })
                .then(res => {
                    if(res.data.code === 0) {
                        this.$message({
                            message: '新增标签成功',
                            type: 'success'
                        })
                        this.getAllTags()
                    }
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '新增失败',
                    })
                })
        },
        modifyTag(tag) {
            this.$prompt('请输入新标签名', '更新', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /[\w\u4e00-\u9fa5]+/,
                inputErrorMessage: '标签名格式不正确',
            })
                .then(({ value }) => {
                    return Tag.modify({
                        cid: tag.cid,
                        name: value,
                    })
                })
                .then(res => {
                    if(res.data.code === 0) {
                        this.$message({
                            message: '修改标签成功',
                            type: 'success'
                        })
                        this.getAllTags()
                    }
                })
                .catch((err) => {
                    this.$message({
                        type: 'info',
                        message: '修改失败' + err,
                    })
                })
        },
        handleClick(tag) {
            const clickTime = Date.now() / 1000
            if(clickTime - this.clickTime < 0.5) {
                this.clickTime = 0
                this.modifyTag(tag)
            } else {
                this.selectTag(tag.name)
                this.clickTime = clickTime
            }
        },
        uploadSuccess(res) {
            if (res.code === 0) {
                Tag.modify({
                    name: this.selectedTags[0],
                    previewImage: res.path
                }).then(res => {
                    this.getAllTags()
                })
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.tag-manager {
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
}
</style>