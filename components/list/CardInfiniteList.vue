<template>
  <div ref="infiniteBox" class="infinite">
    <div class="infinite-box" @scroll="scrollHandler">
      <div
        v-for="item in itemData"
        :key="item.id"
        :class="`infinite-box__item ${item.visible?'':'infinite-box__hidden'}`"
        :style="`transform: translateY(${item.y}px);flex-direction:${item.reverse?'row-reverse':'row'}`"
        :data-id="item.id"
        :data-inity="item.y"
      >
        <router-link :to="`/article${item.id}`" class="infinite-box__item__img">
          <img :src="item.imageURL" :alt="item.title" />
        </router-link>
        <div class="infinite-box__item__msg">
          <p class="infinite-box__item__msg__date">
            <i class="iconfont icon-clock"></i>
            {{item.timestamp | timestampToDate}}
          </p>
          <h2 class="infinite-box__item__msg__tit">{{item.title}}</h2>
          <p class="infinite-box__item__msg__type">
            <i class="iconfont icon-3801wenjian"></i>
            {{item.tag}}
          </p>
          <p class="infinite-box__item__msg__desc">{{item.abstractContent}}</p>
        </div>
      </div>

      <div
        v-for="(stone,idx) in tombstoneData"
        :key="`stone${idx}`"
        :class="`infinite-box__tombstone ${stone.visible?'':'infinite-box__hidden'}`"
        :style="`transform: translateY(${stone.y}px);flex-direction:${stone.reverse?'row-reverse':'row'}`"
      >
        <div class="infinite-box__tombstone__mark-img">Image</div>
        <div class="infinite-box__tombstone__mark-box">
          <p class="infinite-box__tombstone__mark"></p>
          <p class="infinite-box__tombstone__mark"></p>
          <p class="infinite-box__tombstone__mark"></p>
          <p class="infinite-box__tombstone__mark"></p>
          <p class="infinite-box__tombstone__mark"></p>
          <p class="infinite-box__tombstone__mark"></p>
        </div>
      </div>
    </div>
    <div class="infinite-box__page">
      <div class="infinite-box__page__text">
        <p>{{page}}</p>
        <p>{{maxPage}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { debounce, throttle } from '~/utils'
const MARGIN = 30
export default {
  // props: {
  //   itemHeight: {
  //     type: Number,
  //     default: 330
  //   },
  //   dataFunc: {
  //     type: Function,
  //     default: () => {
  //       return function() {
  //         return new Promise(resolve => {
  //           resolve()
  //         })
  //       }
  //     }
  //   }
  // },
  props: ['dataFunc'],
  data() {
    return {
      itemHeight: 330,
      infiniteBox: null,
      total: -1,
      isReachBottom: false,
      listData: [],
      itemData: [],
      tombstoneData: [],
      boxHeight: 0,
      paneHeight: 0,
      itemPos: 0,
      tombstoneHead: 0,
      border: 0,
      recordScroll: 0,
      start: 0,
      recordLocateStart: 0,
      end: 0,
      buffer: 0,
      pageSize: 5,
      page: 1,
      maxPage: 1,
      scrollDebounce: null,
      renderThrottle: null
    }
  },

  mounted() {
    // 参数初始化
    this.infiniteBox = this.$refs.infiniteBox
    this.boxHeight = this.infiniteBox.clientHeight || 0
    this.pageSize = Math.ceil(this.boxHeight / this.itemHeight) * 3
    this.border = this.paneHeight = this.pageSize * (this.itemHeight + MARGIN)
    this.itemPos = this.end = this.pageSize - 1
    this.buffer = (this.itemHeight * this.pageSize) / 2
    console.log(this.infiniteBox, this.boxHeight, this.pageSize)
    // 滚动和重定位函数进行构成防抖、节流函数
    this.scrollDebounce = debounce(e => {
      if (this.total === -1) return
      const scrollTop = e.target && e.target.scrollTop
      // console.log(
      //   scrollTop,
      //   this.recordScroll,
      //   this.boxHeight,
      //   this.paneHeight,
      //   this.border,
      //   this.buffer,
      //   this.start
      // )
      /* 向下滑动且可视边界超过数据边界-缓冲区时扩大数据边界 */
      if (
        !this.isReachBottom &&
        scrollTop > this.recordScroll &&
        scrollTop + this.boxHeight > this.border - this.buffer
      ) {
        this.scrollDown()
      } else if (
        scrollTop < this.recordScroll &&
        this.start > 0 &&
        scrollTop - this.buffer < this.border - this.paneHeight
      ) {
        this.scrollUp()
      }
      this.recordScroll = scrollTop
    }, 16)

    this.renderThrottle = throttle(() => {
      let i = this.itemPos
      let count = this.start
      const arr = []
      do {
        i = (i + 1) % this.pageSize
        if (this.listData[count]) {
          this.itemData[i] = {
            ...this.itemData[i],
            ...this.listData[count++],
            visible: true
          }
          arr.push(i)
        }
      } while (i !== this.itemPos)
      this.$forceUpdate()
      this.$nextTick(() => {
        arr.forEach(index => {
          this.tombstoneData[index].visible = false
        })
        this.$forceUpdate()
      })
    }, 200)
    // dom模块初始化定位并隐藏
    this.initTombstone()
    this.initItemData()
    this.renderList()
  },
  methods: {
    initItemData() {
      for (let i = 0; i < this.pageSize; ++i) {
        this.itemData.push({
          y: (this.itemHeight + MARGIN) * i,
          visible: false,
          reverse: i % 2 === 0
        })
      }
    },
    initTombstone() {
      for (let i = 0; i < this.pageSize; ++i) {
        this.tombstoneData.push({
          y: (this.itemHeight + MARGIN) * i,
          visible: true,
          reverse: i % 2 === 0
        })
      }
    },
    renderList() {
      const page = Math.floor(this.end / this.pageSize) + 1
      this.$emit('load')
      this.fetchData(page).then(() => {
        this.$emit('finish')
        this.renderThrottle()
      })
    },
    scrollHandler(e) {
      this.scrollDebounce(e)
    },
    scrollDown() {
      if (this.total < 0 || this.end < this.total - 1) {
        const newPos = (this.itemPos + 1) % this.pageSize
        this.end++
        this.start++
        this.page = Math.floor(this.end / this.pageSize) + 1
        this.tombstoneData[newPos] = {
          y: this.itemData[this.itemPos].y + this.itemHeight + MARGIN,
          visible: true,
          reverse: !this.itemData[this.itemPos].reverse
        }
        this.itemData[newPos] = {
          y: this.itemData[this.itemPos].y + this.itemHeight + MARGIN,
          visible: false,
          reverse: !this.itemData[this.itemPos].reverse
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
      const newPos = this.itemPos - 1 < 0 ? this.pageSize - 1 : this.itemPos - 1
      this.isReachBottom = false
      this.end--
      this.start--
      this.page = Math.floor(this.end / this.pageSize) + 1
      this.tombstoneData[newPos] = {
        y:
          this.itemData[(this.itemPos + 1) % this.pageSize].y -
          this.itemHeight -
          MARGIN,
        visible: true,
        reverse: !this.itemData[(this.itemPos + 1) % this.pageSize].reverse
      }
      this.itemData[this.itemPos] = {
        y:
          this.itemData[(this.itemPos + 1) % this.pageSize].y -
          this.itemHeight -
          MARGIN,
        visible: false,
        reverse: !this.itemData[(this.itemPos + 1) % this.pageSize].reverse
      }
      this.border = this.border - this.itemHeight - MARGIN
      this.itemPos = newPos
      this.$forceUpdate()
      this.renderList()
    },
    fetchData(page) {
      return new Promise(resolve => {
        if (this.end > this.listData.length - 1) {
          const count =
            this.page === this.maxPage
              ? this.total % this.pageSize
              : this.pageSize
          for (let i = 0; i < count; ++i) {
            this.listData[i + (page - 1) * this.pageSize] = null
          }
          resolve()
          this.dataFunc({
            page: page,
            limit: this.pageSize
          }).then(res => {
            if (res.data) {
              for (let i = 0; i < res.data.list.length; ++i) {
                this.listData[i + (page - 1) * this.pageSize] = res.data.list[i]
                this.total = res.data.total
                this.maxPage = Math.ceil(this.total / this.pageSize)
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
}
</script>

<style lang="scss" scoped>
.infinite {
  position: relative;
  width: 950px;
  height: 100vh;
  background: #fff;
  transition: background 0.2s ease;
  @media screen and (max-width: 950px) {
    width: 100%;
  }
  &:hover {
    background: #fdfdfd;
  }
  .infinite-box {
    position: relative;
    width: 90%;
    height: 100%;
    padding: 0 10px;
    overflow-y: auto;

    &__item {
      box-sizing: border-box;
      position: absolute;
      display: flex;
      width: calc(100% - 20px);
      height: 330px;
      border-radius: 10px;
      border: 1px solid #eee;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 10px -8px;
      overflow: hidden;
      transition: all 0.2s ease;
      z-index: 3;
      background: #fff;
      &__img {
        width: 500px;
        height: 100%;
        overflow: hidden;
        @media screen and (max-width: 640px) {
          display: none;
        }
        img {
          width: 100%;
          height: 100%;
          transition: transform 0.2s linear;
        }
      }
      &__img:hover img {
        transform: scale(1.1);
      }
      &__msg {
        width: 400px;
        box-sizing: border-box;
        padding: 30px;
        &__date,
        &__type {
          font-size: 14px;
          color: #999;
          margin-bottom: 10px;
          i {
            color: #999;
          }
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
    &__tombstone {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 330px;
      box-sizing: border-box;
      position: absolute;
      left: 0;
      right: 0;
      border: 1px solid #eee;
      border-radius: 5px;
      transition: all 0.2s ease;
      box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
      overflow: hidden;
      z-index: 4;
      background: #fff;
      &__mark-box {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 400px;
        box-sizing: border-box;
        padding: 30px;
      }
      &__mark {
        width: 100%;
        height: 36px;
        margin: 5px 0;
        background: #eee;
        border-radius: 5px;
      }
      &__mark:nth-last-child(1) {
        width: 50%;
      }
      &__mark-img {
        @media screen and (max-width: 640px) {
          display: none;
        }
        width: 500px;
        height: 330px;
        line-height: 330px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        background: #eee;
        color: #999;
      }
    }
    &__hidden {
      opacity: 0;
      z-index: -1;
    }
    &__page {
      display: flex;
      align-items: center;
      position: absolute;
      right: 20px;
      top: 0;
      width: 30px;
      height: 100%;
      color: rgb(130, 130, 130);
      font-family: Ubuntu, sans-serif;
      font-size: 14px;
      &__text {
        position: relative;
        width: 100%;
        height: 50px;
        line-height: 25px;
        text-align: center;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 0;
          height: 100px;
          border: 1px dashed rgb(230, 230, 230);
          margin: auto;
          transform: translateY(-100%);
        }
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 0;
          height: 100px;
          border: 1px dashed rgb(230, 230, 230);
          margin: auto;
          transform: translateY(100%);
        }
        p:nth-child(1) {
          border-bottom: 1px solid rgb(230, 230, 230);
        }
      }
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
