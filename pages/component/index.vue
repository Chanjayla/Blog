<template>
  <div class="comp-box">
    <div class="comp-box__tags" @click="changeTags">
      <span v-for="tag in tags" :key="tag" :class="checkTag(tag)" :data-tag="tag">{{tag}}</span>
    </div>
    <div class="comp-box__tit">
      <i></i>
      <span>相关类型：{{ checkboxGroup.join(' ｜ ') }}</span>
    </div>
    <div class="comp-box__list">
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="(item, idx) in componentData" :key="item.name" :title="item.name" :name="idx+1" class="comp-box__list__item">
          <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
          <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
export default {
  asyncData() {
    return {}
  },
  data() {
    return {
      checkboxGroup: ['列表', '模块', '视频', '音频'],
      tags: ['列表', '模块', '视频', '音频'],
      activeNames: [],
      componentData: [{
          name: 'vue-infinite-list'
      }]
    }
  },
  mounted() {},
  methods: {
    changeTags(e) {
      const tag = e.target.dataset.tag
      if (!!tag) {
        const idx = this.checkboxGroup.indexOf(tag)
        idx > -1
          ? this.checkboxGroup.splice(idx, 1)
          : this.checkboxGroup.push(tag)
      }
    },
    checkTag(tag) {
      return this.checkboxGroup.indexOf(tag) > -1 ? 'active' : ''
    }
  }
}
</script>
<style lang="scss">
.comp-box {
  @media screen and (max-width: 1200px) {
    width: 100%;
  }
  @media screen and (min-width: 1200px) {
    width: 1200px;
  }
  margin: 30px auto 0 auto;
  &__tit {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin: 20px 0 20px 0;
    padding-bottom: 10px;
    color: rgb(102, 102, 102);
    font-size: 20px;
  }
  &__tags {
    span {
      display: inline-block;
      margin: 0 10px;
      font-size: 14px;
      color: #666;
      transition: color 0.2s ease;
      cursor: pointer;
      user-select: none;
    }
    .active {
      color: #409eff;
    }
  }
  &__list {
      &__item {
          font-size: 16px;
      }
  }
}
</style>