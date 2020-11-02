<template>
    <div class="article-box">
        <div class="article-box__header">
            <div class="mask"></div>
        </div>
        <div class="article-box__left">
            <blog-list :dataList="articleData" v-if="articleData"></blog-list>
            <el-pagination
                class="article-box__pagination"
                layout="prev, pager, next"
                :total="total"
                @current-change="changePage"
            ></el-pagination>
        </div>
        <div class="article-box__right">
            <tag-cloud :dataList="tagData"></tag-cloud>
        </div>
    </div>
</template>
<script>
import BlogList from '~/components/List/BlogList.vue'
import TagCloud from '~/components/TagCol/index.vue'
import { transScroll } from '~/utils'
import * as Tag from '~/api/tag'
import * as Article from '~/api/article'
export default {
    layout: 'blog',
    components: {
        TagCloud,
        BlogList,
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            articleData: null,
            tagData: null,
        }
    },
    asyncData({ error }) {
        if (process.server) {
            return Promise.all([
                Article.getPage({
                    page: 1,
                    pageSize: 10,
                    tags: [],
                }),
                Tag.getAll(),
            ])
                .then((res) => {
                    return {
                        articleData: res[0].data.data,
                        tagData: res[1].data.data,
                    }
                })
                .catch((err) => {
                    // error({ statusCode: 400, message: err })
                })
        } else {
            return {
                isServer: false,
            }
        }
    },
    mounted() {
        if (this.isServer === false) {
            return Promise.all([
                Article.getPage({
                    page: 1,
                    pageSize: 10,
                    tags: [],
                }),
                Tag.getAll(),
            ]).then((res) => {
                console.log(res)
                this.articleData = res[0].data.data
                this.total = res[0].data.total
                this.tagData = res[1].data.data
                this.$nextTick(() => {
                    this.$store.dispatch('app/toggleLoading', 2)
                })
            })
        } else {
            this.$store.dispatch('app/toggleLoading', 2)
        }
    },
    methods: {
        changePage(currPage) {
            Article.getPage({
                page: currPage,
                pageSize: this.pageSize,
            }).then((res) => {
                this.articleData = res.data.data
                transScroll(560, 300)
            })
        },
    },
    transition: 'blog',
}
</script>
<style lang="scss" scoped>
.article-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding-top: 510px;
    transition: all 0.2s ease;
    @media screen and (max-width: 640px) {
        min-width: 0;
    }
    &__header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 500px;
        background-image: url(/blog_page_header.jpg);
        background-attachment: fixed;
        background-size: cover;
        border-radius: 0 0 1em 1em;
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: .3;
        }
    }
    &__tags {
        width: 300px;
        height: 300px;
        background: #000;
        @media screen and (max-width: 640px) {
            display: none;
        }
    }
    &__left {
        margin-right: 50px;
        margin-bottom: 30px;
    }
    &__pagination {
        text-align: center;
    }
}
</style>
