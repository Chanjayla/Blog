<template>
  <div class="music-box">
    <div class="music-box__header">
      <img src="/music_page_header.jpg" />
    </div>
    <section class="music-box__search"></section>
    
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
.music-box {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  padding-top: 510px;
  transition: all 0.2s ease;
  &__header {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 500px;
    overflow: hidden;
    @media screen and (max-width: 640px) {
      display: none;
    }
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
