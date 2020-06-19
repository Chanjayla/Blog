<template>
  <div class="article-box">
    <div class="article-box__header"></div>
    <div class="article-box__left">
      <card-block-list :dataList="articleData" v-if="articleData"></card-block-list>
      <el-pagination
        class="article-box__pagination"
        layout="prev, pager, next"
        :total="total"
        @current-change="changePage"
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
  asyncData({ error }) {
    if (process.server) {
      return axios
        .post('/api/article/page', {
          page: 1,
          pageSize: 10
        })
        .then(res => {
          return {
            articleData: res.data.data,
            total: res.data.total,
            isServer: true
          }
        })
        .catch(err => {
          error({ statusCode: 400, message: err })
        })
    } else {
      return {
        isServer: false
      }
    }
  },
  mounted() {
    if (this.isServer === false) {
      axios
        .post('/api/article/page', {
          page: this.page,
          pageSize: this.pageSize
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
        .post('/api/article/page', {
          page: currPage,
          pageSize: this.pageSize
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
  }
  &__pagination {
    text-align: center;
  }
}
</style>
