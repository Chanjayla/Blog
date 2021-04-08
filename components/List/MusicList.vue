<template>
    <div
        class="rs-panel"
        :style="`background: ${
            inSelectStatus ? 'rgba(0,0,0,0.5)' : 'transparent'
        }`"
    >
        <div class="rs-btn">
            <el-upload
                v-if="canUpload"
                action="/resource/upload/audio"
                name="resource"
                multiple
                :limit="3"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :show-file-list="false"
                accept="audio/mp3,audio/flac"
                :data="uploadData"
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
        <div class="rs-list">
            <div @click="clickItem" ref="rsBox" :key="listKey">
                <div
                    class="rs-item"
                    v-for="(item, index) in rsData"
                    :key="item.name"
                    :data-idx="index"
                    :class="{ selected: inSelectStatus && item.selected }"
                >
                    <img :src="item.image || ''" :data-idx="index" />
                    <div class="msg" :data-idx="index">
                        <span>{{ item.title }}</span>
                        <span>{{ item.artist }}</span>
                    </div>
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
            :page-sizes="[50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin: 10px 0"
        ></el-pagination>
    </div>
</template>
<script>
import * as Resource from '~/api/resource'
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            rsData: [],
            selectedSrc: '',
            clipboard: null,
            clickTime: 0,
            inSelectStatus: false,
            deleteArr: [],
            listKey: 1,
            uploadData: {}
        }
    },
    mounted() {
        this.getRsPage()
    },

    computed: {},
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
            Resource.getPage({
                page: this.page,
                pageSize: this.pageSize,
                type: 'audio',
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
                    parseInt(target.dataset.idx) +
                        this.pageSize * (this.page - 1)
                if (typeof index !== 'undefined') {
                    const arrIndex = this.deleteArr.indexOf(index)
                    if (arrIndex > -1) {
                        this.rsData[index].selected = false
                        this.deleteArr.splice(index, 1)
                    } else {
                        this.rsData[index].selected = true
                        this.deleteArr.push(index)
                        this.listKey++
                    }
                    console.log(this.deleteArr)
                }
            }
        },
        deleteItems() {
            if (!this.inSelectStatus) {
                this.inSelectStatus = true
            } else if (this.deleteArr.length > 0) {
                this.$confirm(`Delete these files(${this.deleteArr.length})?`)
                    .then(() => {
                        this.requestDelete()
                    })
                    .finally(() => {
                        this.deleteArr = []
                        this.inSelectStatus = false
                    })
            }
        },
        selectAll() {
            this.deleteArr = this.rsData.map(
                (item, idx) => idx + this.pageSize * (this.page - 1)
            )
            for (let i = 0; i < this.rsData.length; ++i) {
                this.rsData[i].selected = true
            }
            this.listKey++
        },
        exit() {
            this.inSelectStatus = false
            this.deleteArr = []
            for (let i = 0; i < this.rsData.length; ++i) {
                this.rsData[i].selected = false
            }
            this.listKey++
        },
        hideMask() {
            this.selectedSrc = ''
        },
        handleSuccess(res) {
            if (res.code === 0) {
                this.rsData.unshift(res.msg)
            }
        },
        beforeUpload(file) {
            return new Promise(resolve => {
                var reader = new FileReader()
                reader.onload =  (e) => {
                    var audio = document.createElement('audio')
                    audio.src = e.target.result
                    audio.load()
                    audio.oncanplay = () => {
                        this.uploadData.duration = audio.duration
                        resolve()
                    }
                    
                }
                reader.readAsDataURL(file)
            })
        },
        requestDelete() {
            Resource.del({
                arr: this.deleteArr.map((val) => this.rsData[val]['_id']),
                type: 'audio',
            }).then((res) => {
                if (res.data.code === 0) {
                    this.getRsPage()
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.msg,
                    })
                }
            })
        },
    },
    props: {
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
.rs-panel {
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
    .rs-list {
        box-sizing: border-box;
        padding: 0 10px;
        .rs-item {
            box-sizing: border-box;
            display: flex;
            height: 90px;
            margin: 10px 0;
            padding: 0 10px;
            align-items: center;
            border-radius: 10px;
            border: 2px solid $borderColor;
            background: #fff;
            transition: all 0.2s ease;
            cursor: pointer;
            &:hover {
                border-color: $linkHoverColor;
            }
            img {
                height: 70px;
                margin-right: 20px;
            }
            .msg {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                height: 100%;

                span:nth-child(2) {
                    font-size: 14px;
                    color: #999;
                }
            }
        }
        .selected {
            border-color: $dangerColor;
            &:hover {
                border-color: $dangerColor;
            }
        }
        i {
            font-size: 24px;
            color: $secondaryFontColor;
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