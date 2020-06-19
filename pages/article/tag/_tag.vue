<template>
  <div class="article-box">
    <div class="article-box__header"></div>
    <div class="article-box__left">
        <div class="article-box__left__tag">
            Tag: <span>{{ tag }}</span>
        </div>
      <card-block-list :dataList="articleData" v-if="articleData"></card-block-list>
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
import CardBlockList from '~/components/list/CardBlockList.vue'
import TagCloud from '~/components/block/TagCloud.vue'
import axios from 'axios'
import { transScroll } from '~/utils'
export default {
  components: {
    TagCloud,
    CardBlockList
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      articleData: null
    }
  },
  asyncData({ params, error }) {
    const tag = params.tag
    if (process.server) {
      return axios
        .post('/api/article/tag', {
          page: 1,
          pageSize: 10,
          tag: tag
        })
        .then(res => {
          return {
            articleData: res.data.data,
            total: res.data.total,
            isServer: true,
            tag: tag
          }
        })
        .catch(err => {
          error({ statusCode: 400, message: err })
        })
    } else {
      return {
        isServer: false,
        tag: tag
      }
    }
  },
  mounted() {
    if (this.isServer === false) {
      axios
        .post('/api/article/tag', {
          page: this.page,
          pageSize: this.pageSize,
          tag: this.tag
        })
        .then(res => {
          this.articleData = res.data.data
          this.total = res.data.total
        })
    }
  },
  methods: {
    changePage(currPage) {
      axios
        .post('/api/article/tag', {
          page: currPage,
          pageSize: this.pageSize,
          tag: this.tag
        })
        .then(res => {
          this.articleData = res.data.data
          transScroll(560, 300)
        })
    }
  }
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
    margin-right: 30px;
    margin-bottom: 30px;
    &__tag {
        padding-bottom: 10px;
        line-height: 1.5;
        margin-top: 30px;
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
  }
  &__pagination {
    text-align: center;
  }
}
</style>
