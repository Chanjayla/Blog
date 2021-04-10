<template>
    <div class="home-box">
        <div class="home-box__timg" :class="{'home-box__timg_show': bgLoaded}">
            <div class="mask"></div>
            <!-- <h1 class="home-box__timg__tit" data-text="Hello World!">Hello World !</h1> -->
            <Contact class="home-box__timg__contact" />
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
                <side-list :dataList="latestData" v-if="latestData"></side-list>
            </section>
        </section>
    </div>
</template>

<script>
import * as Article from '~/api/article'
export default {
    layout: 'blog',
    data() {
        return {
            bgLoaded: false,
        }
    },
    components: {
        BlogList: () => import('~/components/List/BlogList.vue'),
        SideList: () => import('~/components/List/SideList.vue'),
        Contact: () => import('~/components/Contact/index.vue'),
    },
    asyncData() {
        if (process.server) {
            return Promise.all([Article.getLatest(), Article.getTop()])
                .then((res) => {
                    console.log(res)
                    return {
                        latestData: res[0].data.data,
                        topData: res[1].data.data,
                    }
                })
                .catch((err) => {
                    return {
                        latestData: [],
                        topData: []
                    }
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
        var img = document.createElement('img')
        img.src = '/home_page_header.webp'
        img.onload = () => {
            this.bgLoaded = true
        }
        if (this.isServer === false) {
            Promise.all([Article.getLatest(), Article.getTop()]).then((res) => {
                this.topData = res[1].data.data
                this.latestData = res[0].data.data
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
        height:  100vh;
        min-height: 300px;
        background-color: #000;
        background-attachment: fixed;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        @media screen and (max-width: $mobileWidth) {
            height: 100vh;
            background-size: cover;
        }
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
        }
        &__tit {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 5.4rem;
            color: #fff;
            opacity: 0.8;
            user-select: none;
        }
        &__contact {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 220px;
            white-space: nowrap;
        }
    }
    &__timg_show {
        background-image: url(/home_page_header.webp);
        animation: bg-fade .5s ease forwards;
    }
    &__layout {
        display: flex;
        width: 100%;
        justify-content: center;
        .home-box__content {
            max-width: 900px;
            padding-bottom: 20px;
            @media screen and (max-width: $mobileWidth) {
                width: 100%;
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
                justify-content: center;
                flex-wrap: wrap;
                width: 100%;
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
        }
    }
}
@keyframes bg-fade {
    0% {
        background-size: 110% 110%;
    }
    100% {
        background-size: 100% 100%;
    }
}
</style>
