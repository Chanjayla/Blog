<template>
    <div style="width: 100%; overflow-x: hidden">
        <el-table
            :key="key"
            :data="tableData"
            style="width: 100%; border-radius: 5px"
            :size="tableSize"
            :max-height="isFixedTableHead ? 800 : 'auto'"
        >
            <el-table-column
                v-for="head in tableHead"
                :key="head"
                :label="head"
                :prop="transHead[head].name"
                :min-width="transHead[head].width"
            >
            </el-table-column>
            <el-table-column width="100" label="SetTop">
                <template slot-scope="scope">
                    <el-switch
                        v-model="switchArr[scope.$index]"
                        @change="setTop"
                        :active-value="scope.row._id + '-1'"
                        :inactive-value="scope.row._id + '-0'"
                    >
                    </el-switch>
                </template>
            </el-table-column>
            <template v-if="isFixedOperation">
                <el-table-column width="160" label="Operation" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                            >Edit</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            >Delete</el-button
                        >
                    </template>
                </el-table-column>
            </template>
            <template v-else>
                <el-table-column width="160" label="Operation">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)"
                            >Edit</el-button
                        >
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                            >Delete</el-button
                        >
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[5, 10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin: 10px 0"
        ></el-pagination>
        <Setting>
            <div
                class="drawer-item"
                v-for="(head, key) in transHead"
                :key="key"
            >
                <span>{{ key }}</span>
                <el-switch v-model="head.show" @change="flushTable"></el-switch>
            </div>
            <div class="drawer-item">
                <span>固定操作列</span>
                <el-switch
                    v-model="isFixedOperation"
                    @change="flushTable"
                ></el-switch>
            </div>
            <div class="drawer-item">
                <span>固定表头</span>
                <el-switch
                    v-model="isFixedTableHead"
                    @change="flushTable"
                ></el-switch>
            </div>
            <div class="drawer-item">
                <span>表格尺寸</span>
                <el-switch
                    v-model="tableSize"
                    active-value="small"
                    inactive-value="medium"
                    @change="flushTable"
                ></el-switch>
            </div>
        </Setting>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Setting from '~/components/Drawer/Setting'
import * as Article from '~/api/article'
const defaultOptions = []
export default {
    layout: 'admin',
    props: {
        tags: {
            type: Array,
            default: null,
        },
    },
    data() {
        return {
            tableSize: 'small',
            key: 1,
            checkAll: false,
            isIndeterminate: false,
            isFixedTableHead: false,
            isFixedOperation: false,
            tableData: null,
            transHead: {
                Cid: {
                    name: 'cid',
                    width: 50,
                    show: true,
                },
                Title: {
                    name: 'title',
                    width: 150,
                    show: true,
                },
                PreviewImage: {
                    name: 'preview_image',
                    width: 150,
                    show: true,
                },
                Author: {
                    name: 'author',
                    width: 100,
                    show: true,
                },
                Publish: {
                    name: 'publish_time',
                    width: 120,
                    show: true,
                },
                Tags: {
                    name: 'tags',
                    width: 120,
                    show: true,
                },
            },
            page: 1,
            pageSize: 20,
            total: 0,
            switchArr: [],
            canSetTop: true,
        }
    },
    mounted() {
        if (this.tags === null) {
            this.getArticleList()
        }
    },
    computed: {
        ...mapState({
            clientHeight: (state) => state.app.clientHeight,
        }),
        tableHead() {
            let headOptions = []
            for (let key in this.transHead) {
                this.transHead[key].show && headOptions.push(key)
            }
            return headOptions
        },
    },
    watch: {
        tags() {
            this.getArticleList()
        },
    },
    methods: {
        getArticleList() {
            Article.getPage({
                page: this.page,
                pageSize: this.pageSize,
                tags: this.tags || [],
            }).then((res) => {
                this.tableData = res.data.data.map((item) => {
                    item.publish_time = new Date(item.publish_time).toString()
                    item.tags = item.tags.join(',')
                    return item
                })
                this.total = res.data.total
                this.switchArr = this.tableData.map((item) =>
                    item.is_top ? item._id + '-1' : item._id + '-0'
                )
            })
        },
        handleEdit(index, row) {
            this.$router.push('/admin/articleManager/edit?id=' + row._id)
        },
        handleDelete(index, row) {
            this.$confirm(`Delete this article?`).then(() => {
                Article.del({
                    id: row._id,
                }).then((res) => {
                    if (res.data.code === 0) {
                        this.getArticleList()
                    } else {
                        this.$message({
                            type: 'error',
                            message: '删除失败',
                        })
                    }
                })
            })
        },
        flushTable() {
            this.key += 1
        },
        handleSizeChange(pageSize) {
            this.pageSize = pageSize
            this.getArticleList()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getArticleList()
        },
        setTop(val) {
            if (!this.canSetTop) return
            const arr = val.split('-')
            const id = arr[0]
            const is_top = arr[1] == 1 ? true : false
            this.canSetTop = false
            Article.setTop({
                id,
                is_top,
            }).then((res) => {
                this.canSetTop = true
                if (res.data.code === 0) {
                    this.$message({
                        type: 'success',
                        message: is_top
                            ? 'Set top success'
                            : 'Cancel top success',
                    })
                } else {
                    this.$message({
                        type: 'error',
                        message: is_top ? 'Set top fail' : 'Cancel top fail',
                    })
                }
            })
        },
    },
    components: {
        Setting,
    },
}
</script>
<style lang="scss" scoped>
.table-options {
    margin: 10px 0;
}
.table-options-tit {
    margin: 10px 0;
}
.table-detail {
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0;
    label {
        width: 90px;
        color: #99a9bf;
    }
    .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
}
.el-checkbox {
    font-size: 12px !important;
    font-weight: normal;
}
</style>
