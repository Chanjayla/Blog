<template>
  <div class="article-box">
    <infinite-list></infinite-list>
    <div class="article-box__sub-box">
      <person-card></person-card>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import PersonCard from '../components/PersonCard.vue'
import InfiniteList from '../components/InfiniteList.vue'

@Component({
  components: {
    PersonCard,
    InfiniteList
  }
})
export default class Article extends Vue {

}
</script>
<style lang="scss" scoped>
.article-box {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  padding: 10px 300px 0 10px;
  transition: all .2s ease;
  @media screen and (max-width: 640px) {
    padding-right: 10px;
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
