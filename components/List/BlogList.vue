<template>

  <div class="article-list">
    <section class="article-list__item" v-for="item in dataList" :key="item.id">
      <!-- <a :href="`/article/${item.id}`" class="article-list__item__img">
        <img :src="item.imageURL" :alt="item.title" />
      </a> -->
      <nuxt-link :to="`/blog/${item._id}`" class="article-list__item__img">
        <img :src="item.preview_image" :alt="item.title" @error="loadDefaultImg" />
      </nuxt-link>
      <div class="article-list__item__msg">
        <p class="article-list__item__msg__date">
          <i class="el-icon-time"></i>
          {{item.publish_time | timestampToDate}}</p>
        <h2 class="article-list__item__msg__tit">{{item.title}}</h2>
        <p class="article-list__item__msg__desc">{{item.description}}</p>
        <p class="article-list__item__msg__type">
          <i class="iconfont icon-tag"></i>
          {{item.tags.join(' | ')}}</p>
      </div>
    </section>
    <section v-if="dataList.length === 0 || !dataList" class="article-list__no-data">
        暂无数据
    </section>
  </div>
</template>
<script>
export default {
  props: ['dataList'],
  methods: {
    loadDefaultImg(e) {
      e.target.src = "/empty.png"
    }
  }
}
</script>
<style lang="scss" scoped>
.article-list {
  width: 900px;
  &__item {
    display: flex;
    width: 900px;
    height: 300px;
    margin: 20px 0 40px 0;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
    overflow: hidden;
    &__img {
      position: relative;
      width: 475px;
      height: 100%;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
      background: #fff;
      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        margin: auto;
        transition: transform .2s linear;
      }
    }
    &__img:hover img {
      transform: scale(1.1);
    }
    &__msg {
      position: relative;
      width: 425px;
      box-sizing: border-box;
      padding: 30px;
      &__date{
        font-size: 14px;
        margin-bottom: 10px;
      }
      &__tit {
        margin-bottom: 10px;
        font-size: 27px;
        font-weight: bold;
        line-height: 2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &__desc {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        line-height: 1.8;
        overflow: hidden;
        font-size: 14px;
      }
      &__type {
        font-size: 14px;
        position: absolute;
        left: 30px;
        bottom: 10px;
        color: $secondaryFontColor;
      }
    }
  }
  &__item:nth-child(odd) {
    flex-direction: row-reverse;
  }
  &__no-data {
    padding-top: 10px;
  }
}
</style>
