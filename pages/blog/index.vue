<template>
  <div class="home-box">
    <div class="home-box__timg"></div>
    <section class="home-box__content">
      <div class="home-box__content__tit">
        <i></i>
        <span>The Lastest</span>
      </div>
      <div class="home-box__content__list">
        <blog-list :dataList="lastestData" v-if="lastestData"></blog-list>
      </div>
      <div class="home-box__content__more">More</div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BlogList from '~/components/List/BlogList.vue'
import * as Article from '~/api/article'
import * as Component from '~/api/component'

export default {
  layout: 'blog',
  components: {
    BlogList
  },
  asyncData({ error }) {
    if (process.server) {
      return Promise.all([
        Article.getLatest(),
        Component.getAll()
      ])
        .then(res => {
          return {
            lastestData: res[0].data.data,
            componentsData: res[1].data
          }
        })
        .catch(err => {
          error({ statusCode: 400, message: err })
        })
    } else {
      return {
        lastestData: null,
        componentsData: null,
        isServer: false
      }
    }
  },
  mounted() {
    if (this.isServer === false) {
      Promise.all([
        Article.getLatest(),
        Component.getAll()
      ]).then(res => {
        this.lastestData = res[0].data.data
        this.componentsData = res[1].data
      })
    }
  },
  transition: 'blog'
}
</script>
<style lang="scss" scoped>
.home-box {
  width: 100%;
  &__timg {
    width: 100%;
    height: 62.4vw;
    background: url(/timg.jpeg);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: 0 0;
    background-size: 100%;
  }
  &__content {
    width: 100%;
    margin: 0 auto;
    &__tit {
      max-width: 1200px;
      height: 40px;
      line-height: 40px;
      margin: 40px auto 20px auto;
      color: rgb(102, 102, 102);
      font-weight: 600;
      border-bottom: 1px dashed rgb(230, 230, 230);
      font-size: 20px;
    }
    &__list {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
    &__more {
      width: 100px;
      height: 50px;
      line-height: 50px;
      font-family: Ubuntu, sans-serif;
      font-size: 20px;
      color: rgb(240, 82, 40);
      transition-property: transform;
      transition-duration: 0.25s;
      transition-timing-function: cubic-bezier(0.31, 0.32, 0.38, 2);
      transition-delay: 0s, 0s, 0.15s;
      transform: scale3d(1, 1, 1);
      cursor: pointer;
      margin: 20px auto;
      background: rgb(255, 255, 255);
      border: 2px solid rgb(240, 82, 40);
      border-radius: 25px;
      text-align: center;
      &:hover {
        transform: scale3d(1.1, 1.1, 1);
      }
    }
  }
}
</style>
