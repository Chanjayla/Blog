<template>
    <div ref="infiniteBox" class="infinite-box" @scroll="scrollHandler">
        <div
            v-for="item in itemData"
            :key="item.id"
            :class="`infinite-box__list__item ${
                item.visible ? '' : 'infinite-box__list__hidden'
            }`"
            :style="`transform: translateY(${item.y}px);`"
            :data-id="item.id"
            :data-inity="item.y"
        >
            <h2 class="infinite-box__list__item__tit">
                {{ item.title || '' }}
            </h2>
            <p class="infinite-box__list__item__desc">
                {{ item.abstractContent || '' }}
            </p>
            <div class="infinite-box__list__item__label">
                {{ item.timestamp | timestampToDate }}
            </div>
            <div class="infinite-box__list__item__img">
                <img :src="item.imageURL" alt />
            </div>
        </div>

        <div
            v-for="(stone, idx) in tombstoneData"
            :key="`stone${idx}`"
            :class="`infinite-box__list__tombstone ${
                stone.visible ? '' : 'infinite-box__list__hidden'
            }`"
            :style="`transform: translateY(${stone.y}px);${
                stone.height ? 'height: ' + stone.height + 'px' : ''
            }`"
        >
            <div class="infinite-box__list__tombstone__mark"></div>
            <div class="infinite-box__list__tombstone__mark"></div>
            <div class="infinite-box__list__tombstone__mark-short"></div>
            <div class="infinite-box__list__tombstone__mark-img"></div>
        </div>

        <div class="infinite-box__list__page">
            <div class="infinite-box__list__page__text"></div>
        </div>
    </div>
</template>
<script>
import * as Article from '~/api/article'
import { debounce, throttle } from '~/utils'

export default {
  props: {
    itemHeight: {
      type: Number,
      default: 160
    }
  },
  data() {
    return {
      infiniteBox : null,
      total : -1,
      isReachBottom : false,
      listData : [],
      itemData : [],
      offsetArr : [],
      tombstoneData : [],
      boxHeight : 0,
      paneHeight : 0,
      itemPos : 0,
      tombstoneHead : 0,
      border : 0,
      recordScroll : 0,
      start : 0,
      recordLocateStart : 0,
      end : 0,
      buffer : 0,
      pageSize : 10,
      isRendering : false,
      scrollDebounce: null,
      locateThrottle: null,
      renderThrottle: null,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    // 参数初始化
    this.infiniteBox = this.$refs.infiniteBox
    this.boxHeight = this.infiniteBox.clientHeight || 0
    this.pageSize = Math.ceil(this.boxHeight / this.itemHeight) * 3
    this.border = this.paneHeight = this.pageSize * (this.itemHeight + 10)
    this.itemPos = this.end = this.pageSize - 1
    this.buffer = this.itemHeight * 5
    // 滚动和重定位函数进行构成防抖、节流函数
    this.scrollDebounce = debounce(e => {
      const scrollTop = e.target && e.target.scrollTop
      /* 向下滑动且可视边界超过数据边界-缓冲区时扩大数据边界 */
      if (
        !this.isReachBottom &&
        scrollTop > this.recordScroll + this.itemHeight / 2 &&
        scrollTop + this.boxHeight > this.border - this.buffer
      ) {
        const num = Math.floor(
          (scrollTop - this.recordScroll) / this.itemHeight
        )
        this.scrollDown()
        this.recordScroll = scrollTop
      } else if (
        scrollTop < this.recordScroll &&
        this.start > 0 &&
        scrollTop < this.border - this.paneHeight + this.buffer
      ) {
        const num = Math.floor(
          (this.recordScroll - scrollTop) / this.itemHeight
        )
        this.scrollUp()
        this.recordScroll = scrollTop
      }
    }, 16)
    this.locateThrottle = throttle(() => {
      if (!this.isRendering && this.infiniteBox) {
        const list = this.infiniteBox.children
        let i = (this.itemPos + 1) % this.pageSize
        let heightStore = 0
        let count = 0
        let cHeight = 0
        const offset = this.getScrollOffset(this.start - this.recordLocateStart)
        this.itemData[i].y = this.start > 0 ? this.itemData[i].y - offset : 0
        this.itemData[i].visible = true
        this.tombstoneData[i].visible = false
        this.recordLocateStart = this.start
        while (i !== this.itemPos) {
          cHeight = list[i].clientHeight
          heightStore += cHeight + 10
          this.itemData[(i + 1) % this.pageSize].y =
            this.itemData[i].y + cHeight + 10
          this.itemData[(i + 1) % this.pageSize].visible = true
          this.tombstoneData[(i + 1) % this.pageSize].y = this.itemData[
            (i + 1) % this.pageSize
          ].y
          this.tombstoneData[(i + 1) % this.pageSize].visible = false
          this.offsetArr[count++] = cHeight - this.itemHeight
          i = (i + 1) % this.pageSize
        }
        this.paneHeight = heightStore + cHeight + 10
        this.border = this.itemData[i].y + cHeight + 10 - offset
        this.$forceUpdate()
      }
    }, 500)
    this.renderThrottle = throttle(() => {
      let i = this.itemPos
      let count = this.start
      do {
        i = (i + 1) % this.pageSize
        this.itemData[i] = {
          ...this.itemData[i],
          ...this.listData[count++]
        }
        this.$forceUpdate()
      } while (i !== this.itemPos)
      this.isRendering = false
      this.locate()
    }, 1000)
    // dom模块初始化定位并隐藏
    this.initTombstone()
    this.initItemData()
    this.renderList()
  },
  initItemData() {
    for (let i = 0; i < this.pageSize; ++i) {
      this.itemData.push({
        y: (this.itemHeight + 10) * i,
        visible: false
      })
    }
  },
  initTombstone() {
    for (let i = 0; i < this.pageSize; ++i) {
      this.tombstoneData.push({
        y: (this.itemHeight + 10) * i,
        visible: true
      })
    }
  },
  renderList() {
    const page = Math.floor(this.end / this.pageSize) + 1
    this.fetchData(page).then(() => {
      this.renderThrottle()
    })
  },
  locate() {
    this.locateThrottle()
  },
  scrollHandler(e) {
    this.scrollDebounce(e)
  },
  scrollDown() {
    if (this.total < 0 || this.end <= this.total) {
      const newPos = (this.itemPos + 1) % this.pageSize
      this.end++
      this.start++
      this.tombstoneData[newPos] = {
        y: this.itemData[this.itemPos].y + this.itemHeight + 10,
        visible: true
      }
      this.itemData[newPos] = {
        y: this.itemData[this.itemPos].y + this.itemHeight + 10,
        visible: false
      }
      this.itemPos = newPos
      this.border = this.tombstoneData[newPos].y + this.itemHeight
      this.$forceUpdate()
      this.renderList()
    } else {
      this.isReachBottom = true
    }
  },
  scrollUp() {
    const offset = this.start >= 1 ? 1 : this.start
    const newPos = this.itemPos - 1 < 0 ? this.pageSize - 1 : this.itemPos - 1
    this.isReachBottom = false
    this.end--
    this.start--
    this.tombstoneData[newPos] = {
      y:
        this.itemData[(this.itemPos + 1) % this.pageSize].y -
        this.itemHeight -
        10,
      visible: true
    }
    this.itemData[this.itemPos] = {
      y:
        this.itemData[(this.itemPos + 1) % this.pageSize].y -
        this.itemHeight -
        10,
      visible: false
    }
    this.border = this.border - this.itemHeight
    this.itemPos = newPos
    this.$forceUpdate()
    this.renderList()
  },
  fetchData(page) {
    this.isRendering = true
    return new Promise(resolve => {
      if (this.end > this.listData.length) {
        for (let i = 0; i < this.pageSize; ++i) {
          this.listData[i + (page - 1) * this.pageSize] = null
        }
        Article.getPage({
          page: page,
          pageSize: this.pageSize
        }).then(res => {
          if (res.data) {
            for (let i = 0; i < this.pageSize; ++i) {
              this.listData[i + (page - 1) * this.pageSize] = res.data.data[i]
            }
            this.total = res.data.total
            if(this.total < this.pageSize) {
              this.itemData.splice(this.total-1, this.pageSize-this.total)
              this.tombstoneData.splice(this.total-1, this.pageSize-this.total+1)
              this.$forceUpdate()
            }
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  },
  getScrollOffset(count) {
    if (count > 0) {
      const arr =
        this.offsetArr.length > 2 ? this.offsetArr.splice(0, count) : [0, 0]
      return arr.reduce((val1, val2) => {
        return val1 + val2
      })
    } else {
      return 0
    }
  }
  }
}

</script>

<style lang="scss" scoped>
.infinite-box {
    position: relative;
    height: 200px;
    margin-top: 100px;
    overflow-y: auto;
    &__list {
        position: relative;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        background: #fff;
        &__item {
            box-sizing: border-box;
            position: absolute;
            width: 100%;
            min-height: 150px;
            padding: 10px 150px 10px 10px;
            border-radius: 5px;
            border-bottom: 1px solid $borderColor;
            background: #fff;
            transition: all 0.2s ease;
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
            box-sizing: border-box;
            position: absolute;
            left: 0;
            right: 0;
            height: 150px;
            margin: 0 10px;
            padding-right: 150px;
            border-radius: 5px;
            transition: opacity 0.2s ease;
            z-index: 2;
            &__mark {
                width: 100%;
                height: 30px;
                margin: 5px 0;
                background: #eee;
                border-radius: 5px;
            }
            &__mark-short {
                width: 50%;
                height: 30px;
                margin: 5px 0;
                background: #eee;
                border-radius: 5px;
            }
            &__mark-img {
                position: absolute;
                width: 120px;
                height: 120px;
                right: 10px;
                top: 0;
                background: #eee;
                border-radius: 5px;
            }
        }
        &__hidden {
            opacity: 0;
            z-index: -1;
        }
    }
}
.list-enter-active,
.list-leave-active {
    transition: transform 1s;
}

::-webkit-scrollbar {
    display: none;
}
::-webkit-scrollbar-thumb {
    display: none;
}
</style>
