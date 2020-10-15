<template>
    <div class="rs-list">
        <el-upload
            v-if="canUpload"
            action="/upload/resource"
            name="resource"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :show-file-list="false"
        >
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div @click="selectItem">
            <div class="rs-item" v-for="(item,idx) in rsData" :key="item.path" :data-src="item.path">
                <template v-if="item.type.indexOf('image') > -1">
                    <img :src="item.path" />
                </template>
                <template v-else>
                    <img src="~/assets/icons/file.svg" alt />
                </template>
                <span v-if="!hiddenName" class="name">{{ item.path }}</span>
                <div>
                    <button class="btn" @click="readItem" :data-idx="idx">
                        查看
                    </button>
                    <button
                        class="btn"
                        :data-clipboard-text="item.path"
                    >
                        复制
                    </button>
                </div>
            </div>
        </div>
        <div class="rs-show" v-show="selectedSrc" @click="hideMask">
            <img :src="selectedSrc" />
        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin: 10px 0"
        ></el-pagination>
    </div>
</template>
<script>
import * as Upload from '~/api/upload'
import ClipboardJS from 'clipboard'
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            rsData: [],
            selectedSrc: '',
            clipboard: null,
        }
    },
    mounted() {
        this.getRsPage()
        this.clipboard = new ClipboardJS('.btn')
        this.clipboard.on('success', () => {
            this.$message({
                type: 'success',
                message: '复制成功'
            })
        })
        this.clipboard.on('error', (e) => {
            this.$message('复制失败', e)
        })
    },
    destroyed() {
        this.clipboard.destroy()
    },
    methods: {
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.getRsPage()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getRsPage()
        },
        getRsPage() {
            Upload.getPage({
                page: this.page,
                pageSize: this.pageSize,
                type: this.filter || '',
            }).then((res) => {
                if (res.data.code === 0) {
                    this.rsData = res.data.data
                    this.total = res.data.total
                }
            })
        },
        selectItem(e) {
            let target = e.target
            this.$emit('select', target.dataset.src || '' )
        },
        readItem(e) {
            let target = e.target
            let index = target.dataset.idx
            if(this.rsData[index].type.indexOf('image') > -1) {
                this.selectedSrc = this.rsData[index].path
            } else {
                window.open(this.rsData[index].path)
            }
            
        },
        hideMask() {
            this.selectedSrc = ''
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件`
            )
        },
        handleSuccess(res) {
            if (res.code === 0) {
                this.rsData.unshift({
                    path: res.path,
                    type: res.type,
                })
            }
        },
    },
    props: {
        filter: {
            type: String,
            default: '',
        },
        canUpload: {
            type: Boolean,
            default: true,
        },
        hiddenName: {
            type: Boolean,
            default: false
        }
    },
}
</script>
<style lang="scss" scoped>
.rs-list {
    box-sizing: border-box;
    padding: 10px;
    .rs-item {
        box-sizing: border-box;
        display: flex;
        height: 90px;
        margin: 10px 0;
        padding: 0 20px;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px;
        border: 2px solid $borderColor;
        background: #fff;
        transition: all 0.2s ease;
        cursor: pointer;
        overflow-y: hidden;
        overflow-x: auto;
        &:hover {
            border-color: $linkHoverColor;
        }
        img {
            height: 30px;
            margin-right: 20px;
        }
        .name {
            flex-grow: 1;
        }
        .btn {
            outline: none;
            border: 0;
            background: transparent;
            margin-right: 10px;
            &:hover {
                color: $linkHoverColor;
            }
            cursor: pointer;
        }
    }
    .selected {
        border-color: $linkHoverColor;
        &:hover {
            border-color: $linkHoverColor;
        }
    }
    i {
        font-size: 24px;
        color: $secondaryFontColor;
    }
    .rs-show {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        z-index: 999;
        img {
            position: absolute;
            max-width: 100%;
            max-height: 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>