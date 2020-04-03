<template>
  <div class="article-list">
    <div class="article-list__item" v-for="item in articleData" :key="item.id">
      <h2 class="article-list__item__tit">{{ item.title }}</h2>
      <p class="article-list__item__desc">{{ item.abstractContent }}</p>
      <div class="article-list__item__label">
        {{ item.timestamp | timestampToDate }}
      </div>
      <div class="article-list__item__img">

      </div>
    </div>
    <person-card></person-card>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PersonCard from '../components/PersonCard.vue'
import { getArticles } from '../api/articles'
@Component({
  components: {
    PersonCard
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

}
</style>
