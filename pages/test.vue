<template>
  <div style="height: 500px;">
    <v-infinite :dataFunc="getData" :showPos="true" @change="changeFunc" :height="'500px'">
      <template v-slot:item="{ item }">
        <div class="infinite-box__item">
          <div class="infinite-box__item__img">
            <img :src="item.imageURL" :alt="item.title" />
          </div>
          <div class="infinite-box__item__msg">
            <p class="infinite-box__item__msg__date">
              <i class="iconfont icon-clock"></i>
              {{item.timestamp}}
            </p>
            <h2 class="infinite-box__item__msg__tit">{{item.title}}</h2>
            <p class="infinite-box__item__msg__type">
              <i class="iconfont icon-3801wenjian"></i>
              {{item.tag}}
            </p>
            <p class="infinite-box__item__msg__desc">{{item.abstractContent}}</p>
          </div>
        </div>
      </template>
      <template v-slot:stone>
        <div class="infinite-box__tombstone">
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
      </template>
    </v-infinite>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {}
  },
  mounted() {
    axios.get('/api/qqms/search').then(res => {
      console.log(res)
    })
  },
  methods: {
    getData(params) {
      return axios
        .post('/api/article/page', {
          page: params.page,
          pageSize: params.pageSize
        })
        .then(res => {
          return {
            data: res.data.data,
            total: res.data.total
          }
        })
    },
    changeFunc(pos) {
      console.log(pos)
    }
  }
}
</script>
<style lang="scss" scoped>
.infinite-box__item {
  box-sizing: border-box;
  display: flex;
  width: calc(100% - 20px);
  height: 330px;
  border-radius: 10px;
  border: 1px solid #eee;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 10px -8px;
  overflow: hidden;
  transition: all 0.2s ease;
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
.infinite-box__tombstone {
  display: flex;
  align-items: center;
  width: 100%;
  height: 330px;
  box-sizing: border-box;
  border: 1px solid #eee;
  border-radius: 5px;
  transition: all 0.2s ease;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
  overflow: hidden;
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
</style>