<template>
    <div class="article-edit">
        <Sticky style="margin-bottom: 10px">
            <div class="handle-bar">
                <div class="handle-btn">
                    <el-button type="primary" @click="submitPublish"
                        >发布</el-button
                    >
                </div>
                <div class="handle-btn">
                    <el-upload
                        :show-file-list="false"
                        action
                        :before-upload="getMdFile"
                    >
                        <el-button type="primary">读取md文件</el-button>
                    </el-upload>
                </div>
            </div>
        </Sticky>

        <el-form>
            <el-form-item label="标题" class="form-item">
                <MDInput name="title" ref="title" :value="title" />
            </el-form-item>
            <el-form-item label="简介" class="form-item">
                <el-input
                    type="textarea"
                    v-model="desc"
                    show-word-limit
                    maxlength="200"
                    autosize
                ></el-input>
            </el-form-item>
            <el-form-item
                label="作者"
                style="display: inline-flex; margin-right: 10px"
            >
                <el-input v-model="author"></el-input>
            </el-form-item>
            <el-form-item
                label="标签"
                style="display: inline-flex; margin-right: 10px"
            >
                <el-select
                    v-model="selectTags"
                    multiple
                    default-first-option
                    @change="tagChange"
                    placeholder="请选择文章标签"
                >
                    <el-option
                        v-for="item in allTags"
                        :key="item"
                        :label="item"
                        :value="item"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日期" style="display: inline-flex">
                <el-date-picker
                    v-model="publish"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="12:00:00"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-document"
                    class="local-select"
                    @click="showDrawerToPreview"
                    >选择线上图片</el-button
                >
                <el-upload
                    drag
                    action="/upload/image"
                    :data="{ id: id }"
                    name="preview"
                    :with-credentials="true"
                    accept="image/jpeg, image/png"
                    list-type="picture"
                    :limit="1"
                    :on-success="uploadSuccess"
                    :on-remove="uploadRemove"
                    :file-list="pvImg"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将图片拖到此处，或
                        <em>点击上传缩略图</em>
                    </div>
                    <div class="el-upload__tip" slot="tip">
                        只能上传jpg/png文件
                    </div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <MarkdownEditor
                    ref="markdownEditor"
                    :accept="fileText"
                    @selectImage="showDrawerToMd"
                    @auto-save="autoSave"
                />
            </el-form-item>
        </el-form>
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
    </div>
</template>
<script>
import localforage from 'localforage'
import MDInput from '~/components/Input/MDInput'
import MarkdownEditor from '~/components/MarkdownEditor/index'
import Sticky from '~/components/Sticky'
import PicList from '~/components/List/PicList'
import { mapState } from 'vuex'
import { transFileToText } from '~/utils'
import * as Article from '~/api/article'
import * as Tag from '~/api/tag'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    data() {
        return {
            id: '',
            title: '',
            desc: '',
            publish: '',
            author: '',
            selectTags: '',
            articleTags: [],
            allTags: [],
            fileText: '',
            previewImage: '',
            drawer: false,
            draftShow: true,
            inSelectStatus: false,
            selectImgCb: null,
        }
    },
    mounted() {
        this.id = this.$route.query.id || ''
        if (this.id) {
            Article.getById({
                id: this.id,
            })
                .then((res) => {
                    if (res.code === 0 && res.data) {
                        this.desc = res.data.description
                        this.author = res.data.author || this.author
                        this.fileText = res.data.content
                        this.title = res.data.title
                        this.publish = new Date(res.data.publish_time)
                        this.previewImage = res.data.preview_image
                        this.selectTags = res.data.tags
                    }
                })
                .then(() => {
                    localforage.getItem(`${this.id}_draft`, (err, data) => {
                        if (data) {
                            this.fileText = data
                        }
                    })
                })
        } else {
            localforage.getItem(`new_draft`, (err, data) => {
                if (data) {
                    this.fileText = data
                }
            })
        }

        Tag.getAll().then((res) => {
            this.articleTags = res.data.data
            this.allTags = this.articleTags.map((tag) => tag.name)
        })
    },
    computed: {
        ...mapState({
            sidebar: (state) => state.app.sidebar,
        }),
        pvImg() {
            return this.previewImage
                ? [{ name: 'previewImage', url: this.previewImage }]
                : []
        },
    },
    components: {
        MDInput,
        MarkdownEditor,
        Sticky,
        PicList,
    },
    methods: {
        test() {
            console.log
        },
        tagChange(value) {
            this.selectTags = value
        },
        getMdFile(file) {
            const isTextType = (type) => type.indexOf('text') > -1
            if (isTextType(file.type)) {
                transFileToText(file).then((text) => {
                    this.fileText = text
                })
            }
        },
        submitPublish() {
            let data = {
                id: this.id,
                title: this.$refs['title'].currentValue,
                desc: this.desc,
                publish_time: this.publish,
                author: this.author,
                tags: this.selectTags,
                content: this.$refs['markdownEditor'].code,
                preview_image: this.previewImage,
            }
            this.validate(data)
                .then(() => {
                    return Article.add(data)
                })
                .then((res) => {
                    if (res.data.code === 0) {
                        localforage.removeItem(`${this.id || 'new'}_draft`)
                        this.$message({
                            type: 'success',
                            message: '上传成功',
                            duration: 2000,
                            onClose: () => {
                                this.$router.push('view')
                            },
                        })
                    } else {
                        return Promise.reject(res.data.msg)
                    }
                })
                .catch((e) => {
                    this.$message({
                        type: 'error',
                        message: `上传失败`,
                    })
                })
        },
        uploadSuccess(res) {
            if (res.code === 0) {
                this.previewImage = res.path
            }
        },
        uploadRemove() {
            this.previewImage = ''
        },
        validate(data) {
            return new Promise((resolve, reject) => {
                if (data.title.length < 3) {
                    reject('标题长度不能为空且长度不小于3')
                }
                if (!data.author) {
                    reject('发布者名称不能空')
                }
                if (data.tags && data.tags.length == 0) {
                    reject('请选择标签')
                }
                resolve()
            })
        },
        showDrawerToPreview() {
            this.inSelectStatus = true
            this.drawer = true
            this.selectImgCb = null
        },
        showDrawerToMd(cb) {
            this.inSelectStatus = false
            this.drawer = true
            this.selectImgCb = cb
        },
        closeDrawer() {
            this.inSelectStatus = false
        },
        selectOnline(path) {
            if (this.inSelectStatus) {
                this.previewImage = path
            }
            if (this.selectImgCb) {
                this.selectImgCb(path)
            }
        },
        autoSave(data) {
            if (this.id) {
                localforage.setItem(`${this.id}_draft`, data)
            } else {
                localforage.setItem(`new_draft`, data)
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.article-edit {
    box-sizing: border-box;
    padding: 20px 20px 20px 20px;
}
.form-item {
    box-sizing: border-box;
    padding: 10px;
    border: 2px solid transparent;
    border-radius: 5px;
    background: #fff;
}
.el-textarea ::v-deep {
    position: relative;
    textarea {
        padding-right: 40px;
        resize: none;
        border: none;
        border-radius: 0px;
        border-bottom: 1px solid #bfcbd9;
    }
}
.handle-bar {
    box-sizing: border-box;
    display: flex;
    width: 100%;
    padding: 10px;
    background: #fff;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    z-index: 99;
    .handle-btn {
        margin-right: 10px;
    }
}
.local-select {
    margin-bottom: 10px;
}
</style>