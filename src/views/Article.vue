<template>
  <div class="article-list">
    <div class="article-list__item" v-for="item in articleData" :key="item.id">
      <h2 class="article-list__item__tit" v-textdetail>{{ item.title }}</h2>
      <p class="article-list__item__desc" v-textdetail>{{ item.abstractContent }}</p>
      <div class="article-list__item__label">
        {{ item.timestamp | timestampToDate }}
      </div>
      <div class="article-list__item__img">
        <img :src="item.imageURL" alt="">
      </div>
    </div>
    <div class="article-list__sub-box">
      <person-card></person-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PersonCard from '../components/PersonCard.vue'
import { getArticles } from '../api/articles'
import { textdetail } from '../directives'
@Component({
  components: {
    PersonCard
  },
  directives: {
    textdetail
  }
})
export default class Article extends Vue {
  private articleData = []
  mounted () {
    getArticles({}).then((res) => {
      if (res.data) {
        this.articleData = res.data.list
      }
    })
  }
}
</script>
<style lang="scss">
.article-list {
  position: relative;
  box-sizing: border-box;
  padding: 10px 300px 50px 10px;
  transition: all .2s ease;
  @media screen and (max-width: 640px) {
    padding-right: 10px;
  }
  &__item {
    box-sizing: border-box;
    position: relative;
    margin: 30px;
    padding-right: 150px;
    padding-bottom: 10px;
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
      right: 0;
      top: 10px;
      width: 120px;
      height: 120px;
      overflow: hidden;
      img {
        height: 100%;
      }
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
