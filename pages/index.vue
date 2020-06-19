<template>
  <div class="home-box">
    <div class="home-box__timg"></div>
    <section class="home-box__content">
      <div class="home-box__content__tit">
        <i></i>
        <span>Components</span>
      </div>
      <div class="home-box__content__list">
        <card-inline-list :dataList="componentsData" v-if="componentsData"></card-inline-list>
      </div>
      <div class="home-box__content__tit">
        <i></i>
        <span>The Lastest</span>
      </div>
      <div class="home-box__content__list">
        <card-block-list :dataList="lastestData" v-if="lastestData"></card-block-list>
      </div>
      <div class="home-box__content__more">More</div>
    </section>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import CardBlockList from '~/components/list/CardBlockList.vue'
import CardInlineList from '~/components/list/CardInlineList.vue'
export default {
  components: {
    CardInlineList,
    CardBlockList
  },
  asyncData({ error }) {
    if (process.server) {
      return Promise.all([
        axios.get('/api/article/latest'),
        axios.get('/api/components')
      ])
        .then(res => {
          return {
            lastestData: res[0].data,
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
        axios.get('/api/article/latest'),
        axios.get('/api/components')
      ]).then(res => {
        this.lastestData = res[0].data
        this.componentsData = res[1].data
      })
    }
  }
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
    background-position: 0 0;
    background-size: 100%;
  }
  &__content {
    @media screen and (max-width: 1200px) {
      width: 100%;
    }
    @media screen and (min-width: 900px) {
      width: 900px;
    }
    margin: 0 auto;
    &__tit {
      width: 100%;
      height: 30px;
      line-height: 30px;
      margin: 40px 0 20px 0;
      padding-bottom: 10px;
      color: rgb(102, 102, 102);
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
