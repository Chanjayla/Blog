<template>
  <div class="article-list">
    <section class="article-list__item" v-for="item in dataList" :key="item.id">
      <a :href="`/article/${item.id}`" class="article-list__item__img">
        <img :src="item.imageURL" :alt="item.title" />
      </a>
      <div class="article-list__item__msg">
        <p class="article-list__item__msg__date">{{item.timestamp | timestampToDate}}</p>
        <h2 class="article-list__item__msg__tit">{{item.title}}</h2>
        <p class="article-list__item__msg__type">{{item.type}}</p>
        <p class="article-list__item__msg__desc">{{item.abstractContent}}</p>
      </div>
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
  &__item {
    display: flex;
    width: 900px;
    height: 330px;
    margin: 20px 0 40px 0;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
    overflow: hidden;
    &__img {
      width: 500px;
      height: 100%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
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
        font-size: 18px;
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
        font-size: 18px;
        color: #666;
      }
    }
  }
  &__item:nth-child(odd) {
    flex-direction: row-reverse;
  }
}
</style>
