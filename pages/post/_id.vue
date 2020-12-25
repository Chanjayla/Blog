<template>
    <div>
        <div class="detail-box">
            <div class="detail-box__image">
                <transition name="fade">
                    <img
                        :src="previewImage"
                        :alt="title"
                        @load="imageLoaded"
                        v-show="imgLoaded"
                    />
                </transition>
            </div>
            <h1 class="detail-box__title">{{ title }}</h1>
            <figure class="detail-box__msg">
                <span>{{ publish_time | timestampToDate }}</span>
                <span
                    class="detail-box__msg__tag"
                    v-for="tag in tags"
                    :key="tag"
                    >{{ tag }}</span
                >
            </figure>
            <div class="detail-box__preface" v-if="preface">{{ preface }}</div>
            <ContentLoader
                v-if="!isServer && !content"
                :width="500"
                :height="450"
            >
                <rect x="0" y="0" rx="3" ry="3" width="100%" height="200" />
                <rect x="0" y="210" rx="3" ry="3" width="100%" height="15" />
                <rect x="0" y="235" rx="3" ry="3" width="100%" height="15" />
                <rect x="25%" y="260" rx="3" ry="3" width="50%" height="10" />
                <rect x="5%" y="300" rx="3" ry="3" width="90%" height="15" />
                <rect x="5%" y="330" rx="3" ry="3" width="90%" height="15" />
                <rect x="5%" y="360" rx="3" ry="3" width="90%" height="15" />
                <rect x="5%" y="390" rx="3" ry="3" width="90%" height="15" />
                <rect x="5%" y="420" rx="3" ry="3" width="90%" height="15" />
                <rect x="5%" y="450" rx="3" ry="3" width="90%" height="15" />
            </ContentLoader>
            <div
                v-else
                class="markdown-content detail-box__content"
                v-html="content"
                v-highlight
                ref="contentBox"
            ></div>
            <div class="detail-box__bottom">
                <div class="detail-box__bottom__pn">
                    <template v-if="prevData">
                        <router-link :to="`/post/${prevData._id}`">
                            <img
                                :src="prevData.preview_image"
                                @error="loadDefaultImg"
                            />
                            <div class="mask"></div>
                            <p>{{ prevData.title }}</p>
                            <span>PREVIOUS</span>
                        </router-link>
                    </template>
                    <template v-else>
                        <div class="mask"></div>
                        <span style="color: #7b838a">NO PREVIOUS</span>
                    </template>
                </div>
                <div class="detail-box__bottom__pn">
                    <template v-if="nextData">
                        <router-link :to="`/post/${nextData._id}`">
                            <img
                                :src="nextData.preview_image"
                                @error="loadDefaultImg"
                            />
                            <div class="mask"></div>
                            <p>{{ nextData.title }}</p>
                            <span>NEXT</span>
                        </router-link>
                    </template>
                    <template v-else>
                        <div class="mask"></div>
                        <span style="color: #7b838a">NO NEXT</span>
                    </template>
                </div>
            </div>
            <div class="detail-box__dir">
                <ul :key="dirKey" v-if="directory.length > 0">
                    <li
                        class="dir-item"
                        v-for="item in directory"
                        :key="item.id"
                        :class="{ 'dir-active-item': !!item.active }"
                    >
                        <a :href="`#${item.id}`" :data-id="item.id">{{
                            item.id
                        }}</a>
                    </li>
                </ul>
            </div>
            <div id="gitalk-container" style="margin-bottom: 20px"></div>
        </div>
    </div>
</template>
<script>
import marked from 'marked'
import { transScroll, throttle } from '~/utils'
import * as Article from '~/api/article'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'
import gitalkConfig from '~/config/gitalk'
import ContentLoader from '~/components/ContentLoader'
export default {
    layout: 'blog',
    data() {
        return {
            isServer: false,
            directory: [],
            imgLoaded: false,
            dirKey: 0,
            scrollCb: function () {},
            previewImage: '',
            title: '',
            publish_time: '',
            nextData: null,
            prevData: null,
            preface: null,
            tags: [],
            content: '',
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
                        previewImage: detail.data.preview_image,
                        title: detail.data.title,
                        publish_time: detail.data.publish_time,
                        tags: detail.data.tags,
                        preface: detail.data.preface,
                        content: marked(detail.data.content),
                        prevData: detail.prev,
                        nextData: detail.next,
                    }
                })
                .catch((err) => {
                    // error({ statusCode: 400, message: err })
                })
        } else {
            return {
                isServer: false,
                id: params.id,
                previewImage: '',
                title: '',
                publish_time: '',
                tags: [],
                preface: '',
                content: '',
                prevData: null,
                nextData: null,
            }
        }
    },
    mounted() {
        this.$store.dispatch('app/toggleLoading', 2)
        if (this.isServer === false) {
            Article.getById({ id: this.id }).then((detail) => {
                this.previewImage = detail.data.preview_image
                this.title = detail.data.title
                this.publish_time = detail.data.publish_time
                this.tags = detail.data.tags
                this.preface = detail.data.preface
                this.content = marked(detail.data.content)
                this.prevData = detail.prev
                this.nextData = detail.next
                this.$nextTick(() => {
                    if (this.$refs.contentBox) {
                        this.initDirectory()
                    }
                })
            })
        } else {
            this.$nextTick(() => {
                if (this.$refs.contentBox) {
                    this.initDirectory()
                }
            })
        }
        this.scrollCb = throttle((e) => {
            const top =
                pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop
            this.findDirActive(top)
        }, 100)
        document.addEventListener('scroll', this.scrollCb)
        if (document.getElementById('gitalk-container')) {
            let gitalk = new Gitalk({
                ...gitalkConfig,
                id: location.pathname, // Ensure uniqueness and length less than 50 唯一值，如果和其他页面一样，则两个页面显示的评论都一样
            })
            gitalk.render('gitalk-container')
        }
    },
    components: {
        ContentLoader,
    },
    beforeDestroy() {
        document.removeEventListener('scroll', this.scrollCb)
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
        loadDefaultImg(e) {
            e.target.src = '/empty.webp'
        },
    },
}
</script>
<style lang="scss" scoped>
.detail-box {
    width: 900px;
    margin: 0 auto;
    padding: calc(#{$headerHeight} + 30px) 10px;
    @media screen and (max-width: $mobileWidth) {
        width: 100%;
    }
    &__image {
        width: 100%;
        box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
        font-size: 0;
        border-radius: 10px;
        background-image: url(/empty.webp);
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
        font-size: 48px;
        font-weight: 600;
    }
    &__msg {
        margin-bottom: 20px;
        text-align: center;
        color: #999;
        span {
            display: inline-block;
            margin: 0 10px;
        }
        &__tag {
            padding: 0 10px;
            color: #00965e;
            background: rgba(0, 150, 94, 0.1);
            border-radius: 5px;
        }
    }
    &__content {
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
    &__bottom {
        box-sizing: border-box;
        display: flex;
        width: 100%;
        height: 150px;
        margin-top: 20px;
        justify-content: center;
        align-items: center;
        &__pn:nth-child(1) {
            border-right: 1px solid $borderColor;
        }
        &__pn {
            position: relative;
            width: 50%;
            height: 100%;
            overflow: hidden;
            cursor: pointer;
            .mask {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
            }
            &:hover .mask {
                background: rgba(0, 0, 0, 0.5);
            }
            span {
                position: absolute;
                top: 1em;
                left: 1em;
                font-size: 1.2em;
                color: rgba(255, 255, 255, 1);
            }
            img {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
            }
            p {
                position: absolute;
                top: 3.5em;
                left: 1em;
                color: rgba(255, 255, 255, 1);
            }
        }
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
        font-size: 1em;
        @media screen and (max-width: $mobileWidth) {
            left: 2px;
            width: 15px;
        }
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
