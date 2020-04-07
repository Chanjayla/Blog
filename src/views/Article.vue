<template>
  <div class="article-box">
    <infinite-list class="article-box__list">
      <template #item>
        <div class="article-box__list__item" v-for="item in articleData" :key="item.id">
          <h2 class="article-box__list__item__tit" v-textdetail>{{ item.title }}</h2>
          <p class="article-box__list__item__desc" v-textdetail>{{ item.abstractContent }}</p>
          <div class="article-box__list__item__label">
            {{ item.timestamp | timestampToDate }}
          </div>
          <div class="article-box__list__item__img">
            <img :src="item.imageURL" alt="">
          </div>
        </div>
      </template>
      <template #tombstone>
        <div class="article-box__list__tombstone"></div>
      </template>
    </infinite-list>
    <div class="article-box__sub-box">
      <person-card></person-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PersonCard from '../components/PersonCard.vue'
import InfiniteList from '../components/InfiniteList.vue'
import { getArticles } from '../api/articles'
import { textdetail } from '../directives'
@Component({
  components: {
    PersonCard,
    InfiniteList
  },
  directives: {
    textdetail
  }
})
export default class Article extends Vue {
  private articleData = []

  created () {
    this.getArticleData()
  }
  getArticleData() {
     getArticles({}).then((res) => {
      if (res.data) {
        this.articleData = res.data.list
      }
    })
  }
}
</script>
<style lang="scss">
.article-box {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 10px 300px 0 10px;
  transition: all .2s ease;
  @media screen and (max-width: 640px) {
    padding-right: 10px;
  }
  &__list {
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    &__item {
      box-sizing: border-box;
      position: absolute;
      min-height: 150px;
      margin: 30px;
      padding: 10px 150px 10px 10px;
      border-bottom: 1px solid $borderColor;
      transition: color .2s ease;
      cursor: pointer;
      &:hover {
        color: $linkHoverColor;
      }
      &__tit {
        @include text-overflow(2);
        margin-bottom: 5px;
      }
      &__desc {
        @include text-overflow(3);
        color: $secondaryFontColor;
        font-size: 15px;
        line-height: 1.6;
        margin-bottom: 5px;
      }
      &__label {
        color: $secondaryFontColor;
        font-size: 14px;
        line-height: 2;
      }
      &__img {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 120px;
        height: 120px;
        overflow: hidden;
        img {
          height: 100%;
        }
      }

    }
    &__tombstone {
      background: #000;
    }
  }
  &__sub-box {
    position: absolute;
    width: 250px;
    right: 10px;
    top: 10px;
    @media screen and (max-width: 640px) {
      display: none;
    }
  }
}
</style>
