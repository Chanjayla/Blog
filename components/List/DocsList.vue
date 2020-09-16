<template>

    <div class="docs-list" :style="`background-color: ${inSelectStatus?maskBgColor:''}`">
        <div @click="clickItem">
            <div
                class="docs-item"
                v-for="(item, index) in docsData"
                :key="item.name"
                :data-idx="index"
                :class="{selected: item.selected && inSelectStatus }"
            >
                <img src="~/assets/icons/md.svg" alt />
                <span>{{ item.name }}</span>
            </div>
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
        <Setting>
            <div class="drawer-item">
                <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="toggleSelectStatus"
                    style="margin-right: 10px;"
                ></el-button>
                <span v-show="!inSelectStatus">删除文档</span>
                <el-button v-show="inSelectStatus" size="mini" plain type="danger" @click="deleteDocs">确认</el-button>
                <el-button v-show="inSelectStatus" size="mini" plain @click="toggleSelectStatus">取消</el-button>
            </div>
        </Setting>
    </div>
</template>
<script>
import * as Docs from '~/api/docs'
import Setting from '~/components/Drawer/Setting'
import { maskBg } from '~/styles/variables.scss'
export default {
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            docsData: [],
            inSelectStatus: false,
            maskBgColor: maskBg,
        }
    },
    mounted() {
        this.getDocsPage()
    },
    methods: {
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.getDocsPage()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getDocsPage()
        },
        getDocsPage() {
            Docs.getPage({
                page: this.page,
                pageSize: this.pageSize,
            }).then((res) => {
                if (res.data.code === 0) {
                    this.docsData = res.data.data
                    this.total = res.data.total
                }
            })
        },
        toggleSelectStatus() {
            this.inSelectStatus = !this.inSelectStatus
        },
        clickItem(e) {
            let idx = e.target.dataset.idx || null
            if (!!idx) {
                this.inSelectStatus &&
                    (this.docsData[idx].selected = !this.docsData[idx].selected)
                !this.inSelectStatus &&
                    this.$router.push(
                        this.routerPath +  '?name=' + this.docsData[idx].name
                    )
                this.$forceUpdate()
            }
        },
        deleteDocs() {
            this.$confirm('确认要删除选中文档？', '删除文档', {
                type: 'warning'
            }).then(() => {
                const selectedItems = this.docsData.filter(item => !!item.selected).map(item => item.name)
                return Docs.del({
                    names: selectedItems
                })
            })
        }
    },
    props: {
        routerPath: {
            type: String,
            default: '/',
        },
    },
    components: {
        Setting,
    },
}
</script>
<style lang="scss" scoped>
.docs-list {
    box-sizing: border-box;
    padding: 10px;
    .docs-item {
        box-sizing: border-box;
        display: flex;
        height: 90px;
        margin: 10px 0;
        padding: 0 20px;
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
            height: 30px;
            margin-right: 20px;
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
</style>