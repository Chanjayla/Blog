<template>
    <div class="home-box">
        <div class="home-box__timg">
            <div class="mask"></div>
            <h1>Hello World !</h1>
        </div>
        <section class="home-box__layout">
            <section class="home-box__content">
                <div class="home-box__content__tit">
                    <i class="el-icon-sort-up"></i>
                    <span>The Top</span>
                </div>
                <div class="home-box__content__list">
                    <blog-list :dataList="topData" v-if="topData"></blog-list>
                </div>
                <div class="home-box__content__more" @click="gotoBlog">
                    More
                </div>
            </section>
            <section class="home-box__side">
                <div class="home-box__side__tit">
                    <i class="el-icon-time"></i>
                    <span>Recently Publish</span>
                </div>
                <div class="home-box__side__list">
                    <nuxt-link
                        v-for="item in latestData"
                        :key="item.title"
                        class="side-item"
                        :to="`/blog/${item._id}`"
                    >
                        <span
                            class="side-item__bg"
                            :style="`background-image: url(${item.preview_image})`"
                        ></span>
                        <span class="side-item__box">
                            <span class="side-item__text">
                                <span class="side-item__tit">{{
                                    item.title
                                }}</span>
                                <span class="side-item__time"
                                    >Publish at {{ item.publish_time|timestampToDate }}</span
                                >
                            </span>
                            <img
                                class="side-item__icon"
                                :src="item.preview_image"
                            />
                        </span>
                    </nuxt-link>
                </div>
            </section>
        </section>
    </div>
</template>

<script>
import Vue from 'vue'
import BlogList from '~/components/List/BlogList.vue'
import * as Article from '~/api/article'
import * as Component from '~/api/component'

export default {
    layout: 'blog',
    components: {
        BlogList,
    },
    asyncData({ error }) {
        if (process.server) {
            return Promise.all([Article.getLatest(), Article.getTop()])
                .then((res) => {
                    return {
                        latestData: res[0].data.data,
                        topData: res[1].data.data,
                    }
                })
                .catch((err) => {
                    // error({ statusCode: 400, message: err })
                })
        } else {
            return {
                latestData: null,
                topData: null,
                isServer: false,
            }
        }
    },
    mounted() {
        if (this.isServer === false) {
            Promise.all([Article.getLatest(), Article.getTop()]).then((res) => {
                this.latestData = res[0].data.data
                this.topData = res[1].data.data
                this.$nextTick(() => {
                    this.$store.dispatch('app/toggleLoading', 2)
                })
            })
        } else {
            this.$store.dispatch('app/toggleLoading', 2)
        }
    },
    transition: 'blog',
    methods: {
        gotoBlog() {
            this.$router.push('/blog/list')
        },
    },
}
</script>
<style lang="scss" scoped>
.home-box {
    width: 100%;
    &__timg {
        position: relative;
        width: 100%;
        height: 67.7vw;
        min-height: 300px;
        background: url(/home_page_header.jpg);
        background-attachment: fixed;
        background-repeat: no-repeat;
        background-position: 0 0;
        background-size: 100%;
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
        }
        h1 {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 3em;
            color: #fff;
            opacity: 0.8;
        }
    }
    &__layout {
        display: flex;
        width: 100%;
        justify-content: center;
        .home-box__content {
            max-width: 900px;
            padding-bottom: 20px;
            &__tit {
                box-sizing: border-box;
                width: 100%;
                line-height: 40px;
                margin: 40px auto 20px auto;
                padding: 10px;
                font-weight: 600;
                border-bottom: 1px dashed rgb(230, 230, 230);
                font-size: 1.2em;
            }
            &__list {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
            }
            &__more {
                width: 100px;
                height: 50px;
                line-height: 50px;
                font-family: Ubuntu, sans-serif;
                font-size: 20px;
                color: rgb(240, 82, 40);
                transition-property: transform;
                transition-duration: 0.25s;
                transition-timing-function: cubic-bezier(0.31, 0.32, 0.38, 2);
                transition-delay: 0s, 0s, 0.15s;
                transform: scale3d(1, 1, 1);
                cursor: pointer;
                margin: 20px auto 0 auto;
                background: transparent;
                border: 2px solid rgb(240, 82, 40);
                border-radius: 25px;
                text-align: center;
                &:hover {
                    transform: scale3d(1.1, 1.1, 1);
                }
            }
        }
        .home-box__side {
            max-width: 500px;
            padding-bottom: 20px;
            margin-left: 20px;
            @media screen and (max-width: $minViewWidth) {
                display: none;
            }
            &__tit {
                box-sizing: border-box;
                width: 100%;
                line-height: 40px;
                margin: 40px auto 20px auto;
                padding: 10px;
                font-weight: 600;
                border-bottom: 1px dashed rgb(230, 230, 230);
                font-size: 1.2em;
            }
            &__list {
                display: flex;
                flex-direction: column;
                .side-item {
                    display: block;
                    position: relative;
                    width: 420px;
                    height: 90px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    overflow: hidden;
                    .side-item__bg {
                        position: absolute;
                        top: 0px;
                        right: 0px;
                        bottom: 0px;
                        left: 0px;
                        background-size: cover;
                        background-position: 50% center;
                        background-repeat: no-repeat;
                        filter: blur(10px);
                    }
                    .side-item__box {
                        position: relative;
                        display: flex;
                        height: 100%;
                        -webkit-box-pack: justify;
                        justify-content: space-between;
                        -webkit-box-align: center;
                        align-items: center;
                        padding: 10px;
                        background-color: rgba(245, 245, 245, 0.8);
                    }
                    .side-item__text {
                        display: block;
                    }
                    .side-item__tit {
                        display: block;
                        width: 20rem;
                        font-size: 1.2rem;
                        font-weight: 500;
                        line-height: 1.25;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                        color: rgb(80, 78, 78);
                    }
                    .side-item__time {
                        display: block;
                        margin-top: 0.8rem;
                        width: 20rem;
                        font-size: 1rem;
                        line-height: 1.25;
                        color: rgb(150, 150, 150);
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
            }
        }
    }
}
</style>
