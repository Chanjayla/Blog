<template>
  <div ref="infiniteBox"
       class="infinite-box"
       @scroll="scrollHandler">
    <div v-for="item in itemData"
         :key="item.id"
         :class="`infinite-box__list__item ${item.visible?'':'hidden'}`"
         :style="`transform: translateY(${item.y}px);`"
         :data-id="item.id"
         :data-inity="item.y">
      <h2 class="infinite-box__list__item__tit"
          v-textdetail>
        {{ item.title }}
      </h2>
      <p class="infinite-box__list__item__desc">
        {{ item.abstractContent }}
      </p>
      <div class="infinite-box__list__item__label">
        {{ item.timestamp | timestampToDate }}
      </div>
      <div class="infinite-box__list__item__img">
        <img :src="item.imageURL"
             alt="">
      </div>
    </div>
    <div v-for="(stone,idx) in tombstoneData"
         :key="`stone${idx}`"
         :class="`infinite-box__list__tombstone ${stone.visible?'':'hidden'}`"
         :style="`transform: translateY(${stone.y}px);`"></div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { getArticles } from '../api/articles'
import { debounce, throttle } from '../utils/optimize'
import { textdetail } from '../directives'
import { AxiosPromise } from 'axios'
const DataProps = Vue.extend({
  props: {
    itemHeight: {
      type: Number,
      default: 150
    }
  }
})

@Component({
  directives: {
    textdetail
  }
})
export default class InfiniteList extends DataProps {
  private listData = []
  private itemData = []
  private tombstoneData = []
  private boxHeight = 0
  private paneHeight = 0
  private itemPos = 0
  private tombstoneHead = 0
  private border = 0
  private recordScroll = 0
  private start = 0
  private end = 0
  private buffer = 0
  private page = 1
  private pageSize = 10
  private scrollDebounce: Function
  private locateThrottle: Function

  mounted() {
    this.init()
  }
  init() {
    // 参数初始化
    this.boxHeight = this.$refs.infiniteBox.clientHeight || 0
    this.pageSize = Math.ceil(this.boxHeight / this.itemHeight) * 3
    this.border = this.paneHeight = this.pageSize * (this.itemHeight + 10)
    this.itemPos = this.end = this.pageSize - 1
    this.buffer = this.itemHeight * 5
    // 滚动和重定位函数进行构成防抖、节流函数
    this.scrollDebounce = debounce((e) => {
      const scrollTop = e.target && e.target.scrollTop
      if (scrollTop > this.recordScroll && scrollTop + this.boxHeight > this.border - this.buffer) {
        const num = Math.floor((scrollTop - this.recordScroll) / this.itemHeight)
        this.border = scrollTop + this.boxHeight
        this.scrollDown(num)
      } else if (scrollTop < this.recordScroll && this.start >= 0 && scrollTop < this.border - this.paneHeight + this.buffer) {
        const num = Math.floor((this.recordScroll - scrollTop) / this.itemHeight)
        this.border = scrollTop + this.paneHeight
        this.scrollUp(num)
      }
      this.recordScroll = scrollTop
    }, 200)
    this.locateThrottle = throttle(() => {
      if (this.$refs.infiniteBox) {
        const list = this.$refs.infiniteBox.children
        let i = (this.itemPos + 1) % this.pageSize
        let offset = 0
        while (i !== this.itemPos) {
          offset += list[i].clientHeight + 10
          this.itemData[(i + 1) % this.pageSize].y = this.itemData[i].y + list[i].clientHeight + 10
          i = (i + 1) % this.pageSize
        }
        this.paneHeight = offset + list[i].clientHeight + 10
        this.border = this.itemData[i].y + list[i].clientHeight + 10
        console.log('paneHeight:', this.paneHeight)
        console.log('border:', this.border)
      }
    }, 500)
    // dom模块初始化定位并隐藏
    this.initTombstone()
    this.initItemData()
  }
  initItemData(): void{
    for (let i = 0; i < this.pageSize; ++i) {
      this.itemData.push({
        y: (this.itemHeight + 10) * i,
        visible: false
      })
    }
  }
  initTombstone(): void {
    for (let i = 0; i < this.pageSize; ++i) {
      this.tombstoneData.push({
        y: (this.itemHeight + 10) * i,
        visible: true
      })
    }
  }
  locate() {
    this.locateThrottle()
  }
  scrollHandler(e): void {
    this.scrollDebounce(e)
  }
  scrollDown(num: number): void {
    num = num || 1
    for (let i = 0; i < num; i++) {
      const newPos = (this.itemPos + 1) % this.pageSize
      this.end++
      this.start++
      this.fillTombstone(this.itemPos, 1)
      this.itemPos = newPos
      this.itemData[newPos].y = this.itemData[newPos].y + this.paneHeight
      this.itemData[newPos].visible = false
    }
  }
  scrollUp(num: number): void {
    num = num || 1
    const offset = this.start >= num ? num : this.start
    for (let i = 0; i < offset; i++) {
      const newPos = this.itemPos - 1 < 0 ? this.pageSize - 1 : this.itemPos - 1
      this.end--
      this.start--
      this.fillTombstone(this.itemPos, -1)
      this.itemData[this.itemPos] = this.itemData[this.itemPos].y - this.paneHeight > 0 ? (this.itemData[this.itemPos].y - this.paneHeight) : 0
      this.itemData[this.itemPos] = this.itemData[this.itemPos].visible = false
      this.itemPos = newPos
    }
  }

  fillTombstone(pos: number, direct: -1|1): void {
    this.tombstoneData[pos] = {
      y: this.itemData[pos].y + (this.itemHeight + 10) * direct,
      visible: true
    }
  }
  fetchData(page) {
    return new Promise((resolve) => {
      if (this.end > this.listData.length) {
        getArticles({
          page: page,
          limit: this.pageSize
        }).then((res) => {
          if (res.data) {
            for (let i = 0; i < this.pageSize; ++i) {
              this.listData[i + page * this.pageSize] = res.data.list[i]
            }
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  }
}

</script>

<style lang="scss" scoped>
.infinite-box {
  position: relative;
  height: 100%;
  overflow-y: auto;
  &__list {
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    &__item {
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      min-height: 150px;
      padding: 10px 150px 10px 10px;
      border-bottom: 1px solid $borderColor;
      background: #fff;
      transition: all .2s ease;
      cursor: pointer;
      z-index: 3;
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
      position: absolute;
      left: 0;
      right: 0;
      height: 150px;
      margin: 10px;
      border-radius: 5px;
      background: rgba(0,0,0,.5);
      transition: all .2s 1s ease;
      z-index: 2;
    }
    .hidden {
      visibility: hidden;
      transform: scale(.8);
      opacity: 0;
      z-index: -1;
    }
  }
}
::-webkit-scrollbar {
    display: none;
}
::-webkit-scrollbar-thumb {
    display: none;
}
</style>
