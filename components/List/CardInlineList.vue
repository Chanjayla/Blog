<template>

  <div class="list-box">
    <a
      class="list-box__item"
      v-for="item in dataList"
      :key="item.id"
      :href="item.source||''"
      :style="`background-image:url(${item.imageURL})`"
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  &__item {
    position: relative;
    width: 360px;
    height: 200px;
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
      transition: transform 0.4s linear;
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
      transform: translate(-100%, 0);
      font-size: 20px;
    }
    &::after {
      content: attr(data-desc);
      left: 0;
      bottom: 20px;
      transform: translate(100%, 0);
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
      transform: translate(0, 0);
    }
    &:hover::after {
      transform: translate(0, 0);
    }
  }
}
</style>
