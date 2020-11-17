<template>
    <div class="article-box">
        <div class="article-box__header"></div>
        <div class="article-box__left">
            <div class="article-box__left__tag">
                Tag: <span v-for="tag in tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="article-box__left__box">
                <BlogList :dataList="articleData" v-if="articleData"></BlogList>
            </div>
            <el-pagination
                class="article-box__pagination"
                layout="prev, pager, next"
                :total="total"
                @current-change="changePage"
                v-if="total > pageSize"
            ></el-pagination>
        </div>
        <tag-cloud></tag-cloud>
    </div>
</template>
<script>
import { transScroll } from '~/utils'
import * as Article from '~/api/article'
export default {
    layout: 'blog',
    components: {
        TagCloud: () => import('~/components/TagCol/index.vue'),
        BlogList: () => import('~/components/List/BlogList.vue'),
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            articleData: null,
        }
    },
    asyncData({ params, error }) {
        const tags = params.tag
        if (process.server) {
            return Article.getByTag({
                page: 1,
                pageSize: 10,
                tags: tags.split('|'),
            })
                .then((res) => {
                    return {
                        articleData: res.data.data,
                        total: res.data.total,
                        isServer: true,
                        tags: tags.split('|'),
                    }
                })
                .catch((err) => {
                    // error({ statusCode: 400, message: err })
                })
        } else {
            return {
                isServer: false,
                tags: tags.split('|'),
            }
        }
    },
    mounted() {
        if (this.isServer === false) {
            Article.getByTag({
                page: this.page,
                pageSize: this.pageSize,
                tags: this.tags,
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
            Article.getByTag({
                page: currPage,
                pageSize: this.pageSize,
                tags: this.tags,
            }).then((res) => {
                this.articleData = res.data.data
                transScroll(560, 300)
            })
        },
    },
}
</script>
<style lang="scss" scoped>
.article-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    min-width: 1200px;
    margin: 0 auto;
    padding-top: 510px;
    transition: all 0.2s ease;
    @media screen and (max-width: $mobileWidth) {
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
    }
    &__tags {
        width: 300px;
        height: 300px;
        background: #000;
        @media screen and (max-width: $mobileWidth) {
            display: none;
        }
    }
    &__left {
        margin-right: 30px;
        margin-bottom: 30px;
        &__tag {
            padding-bottom: 10px;
            line-height: 1.5;
            margin-top: 20px;
            font-weight: bold;
            font-size: 24px;
            border-bottom: 1px dashed rgb(230, 230, 230);
            span {
                display: inline-block;
                font-size: 18px;
                color: rgb(0, 150, 94);
                background-color: rgba(0, 150, 94, 0.1);
                padding: 5px 10px;
                border-radius: 5px;
            }
        }
        &__box {
            width: 900px;
        }
    }
    &__pagination {
        text-align: center;
    }
}
</style>
