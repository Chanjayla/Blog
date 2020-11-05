<template>
    <div class="article-list">
        <section
            class="article-list__item"
            v-for="item in dataList"
            :key="item.id"
        >
            <!-- <a :href="`/article/${item.id}`" class="article-list__item__img">
        <img :src="item.imageURL" :alt="item.title" />
      </a> -->
            <nuxt-link
                :to="`/blog/${item._id}`"
                class="article-list__item__img"
            >
                <img
                    :src="item.preview_image"
                    :alt="item.title"
                    @error="loadDefaultImg"
                />
            </nuxt-link>
            <div class="article-list__item__msg">
                <p class="article-list__item__msg__date">
                    <i class="el-icon-time"></i>
                    {{ item.publish_time | timestampToDate }}
                </p>
                <h2 class="article-list__item__msg__tit">{{ item.title }}</h2>
                <p class="article-list__item__msg__desc">
                    {{ item.description }}
                </p>
                <p class="article-list__item__msg__type">
                    <i class="iconfont icon-tag"></i>
                    {{ item.tags.join(' | ') }}
                </p>
            </div>
        </section>
        <section
            v-if="dataList.length === 0 || !dataList"
            class="article-list__no-data"
        >
            暂无数据
        </section>
    </div>
</template>
<script>
export default {
    props: ['dataList'],
    methods: {
        loadDefaultImg(e) {
            e.target.src = '/empty.webp'
            e.target.height = '300'
        },
    },
}
</script>
<style lang="scss" scoped>
.article-list {
    width: 900px;
    @media screen and (max-width: $mobileWidth) {
        width: 100%;
    }
    &__item {
        position: relative;
        display: flex;
        width: 90%;
        height: 300px;
        margin: 20px auto 40px auto;
        border-radius: 10px;
        overflow: hidden;
        &__img {
            position: relative;
            width: 400px;
            height: 100%;
            overflow: hidden;
            @media screen and (max-width: $mobileWidth) {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                filter: blur(10px);
            }
            img {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                margin: auto;
                transition: transform 0.2s linear;
            }
        }
        &__img:hover img {
            transform: scale(1.1);
        }
        &__msg {
            position: relative;
            width: 400px;
            box-sizing: border-box;
            padding: 30px;
            @media screen and (max-width: $mobileWidth) { 
                width: 100%;
                pointer-events: none;
            }
            &__date {
                font-size: 14px;
                margin-bottom: 10px;
            }
            &__tit {
                margin-bottom: 10px;
                font-size: 27px;
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
                line-height: 1.8;
                overflow: hidden;
                font-size: 14px;
            }
            &__type {
                font-size: 14px;
                position: absolute;
                left: 30px;
                bottom: 10px;
                color: $secondaryFontColor;
            }
        }
    }
    &__item:nth-child(odd) {
        flex-direction: row-reverse;
    }
    &__no-data {
        padding-top: 10px;
    }
}
</style>
