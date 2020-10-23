<template>
    <div class="article-box">
        <div class="article-box__header"></div>
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
            <tag-cloud></tag-cloud>
        </div>
    </div>
</template>
<script>
import BlogList from '~/components/List/BlogList.vue'
import TagCloud from '~/components/TagCol/index.vue'
import { transScroll } from '~/utils'
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
        }
    },
    asyncData({ error }) {
        if (process.server) {
            return Article.getPage({
                page: 1,
                pageSize: 10,
            })
                .then((res) => {
                    return {
                        articleData: res.data.data,
                        total: res.data.total,
                        isServer: true,
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
            Article.getPage({
                page: this.page,
                pageSize: this.pageSize,
            }).then((res) => {
                this.articleData = res.data.data
                this.total = res.data.total
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
