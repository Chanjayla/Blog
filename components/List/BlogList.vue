<template>

  <div class="article-list">
    <section class="article-list__item" v-for="item in dataList" :key="item.id">
      <!-- <a :href="`/article/${item.id}`" class="article-list__item__img">
        <img :src="item.imageURL" :alt="item.title" />
      </a> -->
      <nuxt-link :to="`/blog/${item._id}`" class="article-list__item__img">
        <img :src="item.preview_image" :alt="item.title" />
      </nuxt-link>
      <div class="article-list__item__msg">
        <p class="article-list__item__msg__date">{{item.publish_time | timestampToDate}}</p>
        <h2 class="article-list__item__msg__tit">{{item.title}}</h2>
        <p class="article-list__item__msg__type" v-for="tag in item.tags" :key="tag.id">{{tag.name}}</p>
        <p class="article-list__item__msg__desc">{{item.description}}</p>
      </div>
    </section>
    <section v-if="dataList.length === 0 || !dataList" class="article-list__no-data">
        暂无数据
    </section>
  </div>
</template>
<script>
export default {
  props: ['dataList']
}
</script>
<style lang="scss" scoped>
.article-list {
  width: 900px;
  &__item {
    display: flex;
    width: 900px;
    height: 330px;
    margin: 20px 0 40px 0;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
    overflow: hidden;
    &__img {
      position: relative;
      width: 500px;
      height: 100%;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
      background: #444;
      img {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        margin: auto;
        transition: transform .2s linear;
      }
    }
    &__img:hover img {
      transform: scale(1.1);
    }
    &__msg {
      width: 400px;
      box-sizing: border-box;
      padding: 30px;
      &__date, &__type{
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;
      }
      &__tit {
        margin-bottom: 10px;
        font-size: 20px;
        color: #444;
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
        line-height: 1.6;
        overflow: hidden;
        font-size: 16px;
        color: #666;
      }
    }
  }
  &__item:nth-child(odd) {
    flex-direction: row-reverse;
  }
  &__no-data {
    padding-top: 10px;
    color: $secondaryFontColor;
  }
}
</style>
