<template>

  <div class="list-box">
    <a
      class="list-box__item"
      v-for="item in dataList"
      :key="item.id"
      :href="item.url||''"
      :style="`background-image:url(${item.image})`"
      :data-title="item.title"
      :data-desc="item.desc"
    >
      <span class="list-box__item__mask"></span>
    </a>
  </div>
</template>
<script>

export default {
  props: ['dataList']
}
</script>
<style lang="scss" scoped>
.list-box {
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  padding-left: 20px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  &__item {
    display: inline-block;
    position: relative;
    width: 300px;
    height: 160px;
    margin: 0 10px;
    box-shadow: rgba(0, 0, 0, 0.3) 1px 1px 3px;
    overflow: hidden;
    background-size: cover;
    border-radius: 10px;
    &::before,
    &::after {
      box-sizing: border-box;
      position: absolute;
      padding: 0 10px;
      width: 100%;
      transition: all .2s linear;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      z-index: 2;
    }
    &::before {
      content: attr(data-title);
      left: 0;
      top: 20px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      background: #000;
      transform: scale(1.2);
      opacity: 0;
      font-size: 20px;
    }
    &::after {
      content: attr(data-desc);
      left: 0;
      bottom: 20px;
      transform: scale(1.2);
       opacity: 0;
      font-size: 14px;
      color: #f5f5f5;
    }
    &__mask {
      visibility: hidden;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: rgba(0, 0, 0, 0.3);
      transition: opacity 0.5s ease;
      opacity: 0;
    }
    &:hover &__mask {
      visibility: visible;
      opacity: 1;
      z-index: 1;
    }
    &:hover::before {
       opacity: 1;
      transform: scale(1);
    }
    &:hover::after {
       opacity: 1;
      transform: scale(1);
    }
  }
}
</style>
