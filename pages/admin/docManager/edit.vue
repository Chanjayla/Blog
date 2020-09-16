<template>
    <div class="docs-edit">
        <Sticky style="margin-bottom: 10px;">
            <div class="handle-bar">
                <div class="handle-btn">
                    <el-button type="primary" @click="push">提交</el-button>
                </div>
                <div class="handle-btn">
                    <el-upload :show-file-list="false" action :before-upload="getMdFile" :on-change="getFileName">
                        <el-button type="primary">读取md文件</el-button>
                    </el-upload>
                </div>
            </div>
        </Sticky>
        <MarkdownEditor ref="markdownEditor" type="line" :accept="content" />
    </div>
</template>
<script>
import MarkdownEditor from '~/components/MarkdownEditor'
import Sticky from '~/components/Sticky'
import * as Docs from '~/api/docs'
import { transFileToText } from '~/utils'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    data() {
        return {
            name: '',
            content: ''
        }
    },
    mounted() {
        const name = this.$route.query.name
        if (name) {
            this.name = name
            Docs.get({
                name: name,
            }).then((res) => {
                if(res.data.code === 0) {
                    this.content = res.data.data
                } else {
                    this.$message({
                        type: 'error',
                        message: '获取信息失败'
                    })
                }
            })
        }
    },
    components: {
        MarkdownEditor,
        Sticky
    },
    methods: {
        getMdFile(file) {
            const isTextType = (type) => type.indexOf('text') > -1
            if (isTextType(file.type)) {
                transFileToText(file).then((text) => {
                    this.content = text
                })
            } else {
                this.$message({
                    type: 'error',
                    message: '请选择文本类文件'
                })
            }
        },
        getFileName(file, fileList) {
            this.name = file.name.substring(0, file.name.lastIndexOf('.'))
        } ,
        push() {
            this.$prompt('', '文档名称', {
                inputValue: this.name,
                confirmButtonText: '提交',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                return Docs.update({
                    name: value,
                    content: this.$refs['markdownEditor'].code
                })
            }).then(res => {
                if(res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '上传成功!'
                    })
                } else {
                    Promise.reject(res.data.msg)
                }
            }).catch(err => {
                if(err == 'cancel') {
                    this.$message('取消上传')
                } else {
                    this.$message('error:', err)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.docs-edit {
    box-sizing: border-box;
    padding: 20px;
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
    overflow-x: auto;
    .handle-btn {
        margin-right: 10px;
    }
}
</style>