<template>
    <div>
        <div class="detail-box">
            <div class="detail-box__image">
                <transition name="fade">
                    <img :src="previewImage" :alt="title" @load="imageLoaded" v-show="imgLoaded" />
                </transition>
            </div>
            <h1 class="detail-box__title">{{ title }}</h1>
            <figure class="detail-box__msg">
                <span>{{ publish_time | timestampToDate }}</span>
                <span v-for="tag in tags" :key="tag.id">{{ tag.name }}</span>
            </figure>
            <div class="detail-box__preface" v-if="preface">{{ preface }}</div>
            <div class="markdown-content" v-html="content" v-highlight ref="contentBox"></div>
            <div class="detail-box__dir">
                <ul :key="dirKey">
                    <li
                        class="dir-item"
                        v-for="item in directory"
                        :key="item.id"
                        :class="{'dir-active-item':!!item.active}"
                    >
                        <a :href="`#${item.id}`" :data-id="item.id">{{ item.id }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import marked from 'marked'
import { transScroll, throttle } from '~/utils'
import * as Article from '~/api/article'
export default {
    layout: 'blog',
    data() {
        return {
            directory: [],
            imgLoaded: false,
            dirKey: 0,
            scrollCb: function () {},
        }
    },
    asyncData({ params, error }) {
        if (process.server) {
            let id = params.id
            return Article.getById({
                id: id,
            })
                .then((detail) => {
                    return {
                        author: detail.data.author,
                        previewImage: detail.data.preview_image,
                        title: detail.data.title,
                        publish_time: detail.data.publish_time,
                        tags: detail.data.tags,
                        preface: detail.data.preface,
                        content: marked(detail.data.content),
                    }
                })
                .catch((err) => {
                    error({ statusCode: 400, message: err })
                })
        } else {
            return {
                isServer: false,
                id: params.id,
                author: '',
                previewImage: '',
                title: '',
                publish_time: '',
                tags: [],
                preface: '',
                content: '',
            }
        }
    },
    mounted() {
        if (this.isServer === false) {
            Article.getById({ id: this.id }).then((detail) => {
                this.author = detail.data.author
                this.previewImage = detail.data.preview_image
                this.title = detail.data.title
                this.publish_time = detail.data.publish_time
                this.tags = detail.data.tags
                this.preface = detail.data.preface
                this.content = marked(detail.data.content)
                this.$nextTick(() => {
                    if (this.$refs.contentBox) {
                        this.initDirectory()
                    }
                })
            })
        } else {
            if (this.$refs.contentBox) {
                this.initDirectory()
            }
        }
        this.scrollCb = throttle((e) => {
            const top = document.documentElement.scrollTop
            this.findDirActive(top)
        }, 16)
        window.addEventListener('scroll', this.scrollCb)
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.scrollCb)
    },
    methods: {
        initDirectory() {
            const nodes = this.$refs.contentBox.querySelectorAll(
                'h1[id],h2[id]'
            )
            const dir = []
            nodes.forEach((node) => {
                dir.push({
                    id: node.id,
                    pos: node.offsetTop,
                })
            })
            this.directory = dir
        },
        imageLoaded() {
            this.imgLoaded = true
        },
        findDirActive(pos) {
            let selected = false
            for (let i = 0; i < this.directory.length; ++i) {
                if (!selected && this.directory[i].pos > pos) {
                    this.directory[i].active = true
                    selected = true
                } else {
                    this.directory[i].active = false
                }
            }
            !selected &&
                this.directory[this.directory.length - 1] &&
                (this.directory[this.directory.length - 1].active = true)
            this.dirKey++
        },
    },
}
</script>
<style lang="scss" scoped>
.detail-box {
    width: 900px;
    margin: 0 auto;
    padding: calc(#{$headerHeight} + 30px) 10px;
    &__image {
        width: 100%;
        min-height: 400px;
        box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
        font-size: 0;
        border-radius: 10px;
        background-image: url(/empty.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: 50%;
        overflow: hidden;
        img {
            width: 100%;
        }
    }
    &__title {
        line-height: 1.8;
        margin: 20px 0;
        text-align: center;
        font-size: 40px;
        font-weight: 600;
    }
    &__msg {
        text-align: center;
        color: #999;
        span {
            display: inline-block;
            margin: 0 10px;
        }
    }
    &__preface {
        box-sizing: border-box;
        width: 100%;
        line-height: 1.8;
        margin: 30px auto;
        font-size: 18px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: rgb(150, 150, 150) 0.4rem 0.4rem 0px 0px;
        border: 2px solid rgb(150, 150, 150);
    }
    &__dir {
        display: flex;
        align-items: center;
        position: fixed;
        width: 200px;
        top: 0;
        bottom: 0;
        left: 10px;
        margin: auto;
        padding: $headerHeight 0 $footerHeight 0;
        font-size: 14px;
        ul {
            position: relative;
            padding: 10px 0 10px 10px;
            list-style: none;
            &::before {
                position: absolute;
                content: '';
                width: 3px;
                height: 100%;
                top: 0;
                left: 0;
                border-radius: 3px;
                overflow: hidden;
                background: #444;
            }
            .dir-item {
                position: relative;
                display: block;
                margin: 5px 0;
                padding-left: 5px;
                &::before {
                    position: absolute;
                    content: '';
                    width: 15px;
                    height: 15px;
                    top: 0;
                    bottom: 0;
                    left: -16px;
                    margin: auto;
                    border: 2px solid #444;
                    border-radius: 50%;
                    overflow: hidden;
                    background: #fff;
                }
                &:hover::before {
                    border-color: $linkHoverColor;
                }
                a {
                    line-height: 24px;
                    @media screen and (max-width: 900px) {
                        visibility: hidden;
                    }
                }
                &:hover a {
                    visibility: visible;
                }
            }
            .dir-active-item {
                color: $linkHoverColor;
                &::before {
                    border-color: $linkHoverColor;
                }
            }
        }
    }
}
.fade-enter-active {
    transition: all 0.2s;
}
.fade-enter {
    opacity: 0;
}
</style>
