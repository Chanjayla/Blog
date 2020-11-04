<template>
    <div class="rs-list">
        <div class="rs-list__mask" v-show="inSelectStatus"></div>
        <div class="rs-btn">
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
                <el-button size="small" type="primary" icon="el-icon-upload"
                    >upload</el-button
                >
            </el-upload>
            <el-button
                size="small"
                type="primary"
                icon="el-icon-delete"
                @click="deleteItems"
                >{{ inSelectStatus ? 'confirm' : 'delete' }}</el-button
            >
            <el-button
                size="small"
                type="primary"
                @click="selectAll"
                v-show="inSelectStatus"
                >all</el-button
            >
             <el-button
                size="small"
                type="primary"
                @click="exit"
                v-show="inSelectStatus"
                >cancel</el-button
            >
        </div>

        <div class="rs-box" :key="inSelectStatus" ref="rsBox">
            <div
                class="rs-item"
                v-for="(item, idx) in rsData"
                :key="item.path"
                :data-src="item.path"
                :data-idx="idx"
                @click="clickItem"
            >
                <template v-if="item.type.indexOf('image') > -1">
                    <img :src="item.path" :data-idx="idx" />
                </template>
                <template v-else>
                    <img src="~/assets/icons/file.svg" />
                </template>
                <!-- <span v-if="!hiddenName" class="name">{{ item.path }}</span> -->
                <!-- <div>
                    <button class="btn" @click="readItem" :data-idx="idx">
                        查看
                    </button>
                    <button
                        class="btn"
                        :data-clipboard-text="item.path"
                    >
                        复制
                    </button>
                </div> -->
            </div>
        </div>
        <div class="rs-show" v-show="selectedSrc" @click="hideMask">
            <img :src="selectedSrc" />
        </div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[50, 100]"
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
import { MessageBox } from 'element-ui'
export default {
    data() {
        return {
            page: 1,
            pageSize: 50,
            total: 0,
            rsData: [],
            selectedSrc: '',
            clipboard: null,
            clickTime: 0,
            inSelectStatus: false,
            deleteArr: [],
        }
    },
    mounted() {
        this.getRsPage()
        this.clipboard = new ClipboardJS('.btn')
        this.clipboard.on('success', () => {
            this.$message({
                type: 'success',
                message: '复制成功',
            })
        })
        this.clipboard.on('error', (e) => {
            this.$message('复制失败', e)
        })
    },
    destroyed() {
        this.clipboard.destroy()
    },
    computed: {
        itemStyle() {
            return this.deleteArr.indexOf()
        },
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
        clickItem(e) {
            let target = e.target
            let index = target.dataset.idx
            let itemTarget =
                target.tagName.toLocaleLowerCase() == 'img'
                    ? target.parentNode
                    : target
            if (!this.inSelectStatus) {
                const clickTime = Date.now() / 1000

                if (clickTime - this.clickTime < 0.5) {
                    this.clickTime = 0
                    if (this.rsData[index].type.indexOf('image') > -1) {
                        this.selectedSrc = this.rsData[index].path
                    } else {
                        window.open(this.rsData[index].path)
                    }
                } else {
                    this.clickTime = clickTime
                    this.$emit('select', target.src || target.dataset.src || '')
                }
            } else {
                const index =
                    target.dataset.idx &&
                    parseInt(target.dataset.idx) + this.pageSize * (this.page - 1)
                if (typeof index !== 'undefined') {
                    const arrIndex = this.deleteArr.indexOf(index)
                    if (arrIndex > -1) {
                        this.deleteArr.splice(arrIndex, 1)
                        itemTarget.className = 'rs-item'
                    } else {
                        this.deleteArr.push(index)
                        itemTarget.className = 'rs-item selected'
                    }
                }
            }
        },
        deleteItems() {
            if (!this.inSelectStatus) {
                this.inSelectStatus = true
            } else if (this.deleteArr.length > 0) {
                MessageBox.confirm(`Delete these files(${this.deleteArr.length})?`).then(() => {
                    this.requestDelete()
                }).finally(() => {
                    this.deleteArr = []
                    this.inSelectStatus = false
                })
                
            }
        },
        selectAll() {
            this.deleteArr = this.rsData.map((item, idx) => idx + this.pageSize * (this.page - 1))
            Array.prototype.slice.call(this.$refs['rsBox'].children).forEach(node => {
                node.className = 'rs-item selected'
            })
        },
        exit() {
            this.inSelectStatus = false
            this.deleteArr = []
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
        requestDelete() {
            Upload.del({
                arr: this.deleteArr
            }).then(res => {
                if(res.data.code === 0) {
                    this.getRsPage()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                }
            })
        }
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
            default: false,
        },
    },
}
</script>
<style lang="scss" scoped>
.rs-list {
    position: relative;
    box-sizing: border-box;
    padding: 10px;
    &__mask {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
    }
    .rs-btn {
        position: relative;
        display: flex;
        margin-bottom: 10px;
        & > * {
            margin-right: 5px;
        }
    }
    .rs-box {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        .rs-item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
            margin: 5px;
            align-items: center;
            justify-content: space-between;
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
                width: 100%;
                height: 100%;
                object-fit: cover;
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
            border: 5px solid $dangerColor;
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