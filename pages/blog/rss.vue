<template>
    <div class="rss-box">
        <div class="rss-box__header">
            <div class="mask"></div>
            <h1 class="tit">Message</h1> 
        </div>
        <div class="rss-box__content">
            <div class="rss-box__content__note">基于RSSHUB搭建的订阅器的，更多规则<a href="https://docs.rsshub.app/" target="_blank">查看文档</a></div>
            <section class="left">
                <div class="rss-box__content__tit">
                    <i class="el-icon-search"></i>
                    <span>Search</span>
                    <el-input
                        placeholder="...Search Resource"
                        v-model="searchUrl"
                        @focus="showTips"
                        @blur="hideTips"
                    >
                    </el-input>
                    <transition name="tips">
                        <div
                            class="tips"
                            v-show="tipsVisible && activeTips.length > 0"
                        >
                            <ul>
                                <li v-for="tips in activeTips" :key="tips.name">
                                    <span>{{ tips.target }}</span>
                                    <span>{{ tips.title }}</span>
                                </li>    
                            </ul>                        
                        </div>
                    </transition>

                    <el-button
                        icon="el-icon-search"
                        @click="search"
                        style="background: transparent"
                    ></el-button>
                    <el-dropdown trigger="click" @command="handle">
                        <el-button
                            icon="el-icon-menu"
                            style="background: transparent"
                        ></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="save"
                                >Save</el-dropdown-item
                            >
                            <el-dropdown-item command="github"
                                >Github</el-dropdown-item
                            >
                            <el-dropdown-item command="bilibili"
                                >Bilibili</el-dropdown-item
                            >
                            <el-dropdown-item command="zhihu"
                                >知乎</el-dropdown-item
                            >
                            <el-dropdown-item command="qidian"
                                >起点中文</el-dropdown-item
                            >
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <section class="result">
                    <div
                        v-for="item in result"
                        :key="item.title"
                        class="rss-box__content__result"
                    >
                        <img referrer="no-referrer" :src="item.image" />
                        <div class="rss-box__content__result__msg">
                            <p>{{ item.title }}</p>
                            <span> {{ item.date | timestampToDate }}</span>
                            <a :href="item.link" target="_blank">GO</a>
                        </div>
                    </div>
                </section>
            </section>
            <section class="right">
                <div class="rss-box__content__tit">
                    <i class="iconfont icon-3801wenjian"></i>
                    <span>My List</span>
                </div>
                <side-book-list :dataList="myList" style="width: 100%" @search="handleMyList"></side-book-list>
            </section>
        </div>
    </div>
</template>
<script>
import rssRules from '~/config/rssRules'
import * as Rss from '~/api/rss'
import SideBookList from '~/components/List/SideBookList'
export default {
    layout: 'blog',
    middleware: 'authInBlog',
    data() {
        return {
            searchUrl: '',
            result: [],
            activeTips: [],
            tipsVisible: false,
            activeUrl: '',
            myList: []
        }
    },
    components: {
        SideBookList
    },
    asyncData() {},
    mounted() {
        this.getMyList().then(() => {
            this.$store.dispatch('app/toggleLoading', 2)
        })
    },
    methods: {
        search() {
            Rss.search({
                url: encodeURIComponent(this.searchUrl),
            }).then((res) => {
                if (res.data.code === 0) {
                    this.activeUrl = this.searchUrl
                    this.result = res.data.data.map((item) => {
                        item.image = item.description.match(
                            /(?<=src\=\")[^\>]+.(jpg|png|svg|gif)/
                        )
                        item.image = item.image ? item.image[0] : null
                        return item
                    })
                }
            })
        },
        save() {
            this.$prompt('订阅备注名称', '新增',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({value}) => {
                return Rss.add({
                    name: value,
                    url: this.activeUrl,
                    image: this.result[0] ? this.result[0].image : ''
                })
            }).then(res => {
                console.log(res)
                if(res.data.code === 0) {
                    this.$message({
                        message: '创建成功',
                        type: 'success'
                    })
                    this.getMyList()
                } else {
                    this.$message({
                        message: '创建失败',
                        type: 'error'
                    })
                }
            })
        },
        getMyList() {
            return Rss.my().then((res) => {
                if(res.data.code === 0) {
                    this.myList = res.data.data
                }
            })
        },
        handle(command) {
            if (command === 'save') {
                this.save()
            } else if (command === 'github') {
                this.activeTips = rssRules.github
                this.showTips()
            } else if (command === 'bilibili') {
                this.activeTips = rssRules.bilibili
                this.showTips()
            } else if (command === 'zhihu') {
                this.activeTips = rssRules.zhihu
                this.showTips()
            } else if (command === 'qidian') {
                this.activeTips = rssRules.qidian
                this.showTips()
            }
        },
        handleMyList(url) {
            this.searchUrl = url
            this.search()
        },
        showTips() {
            this.tipsVisible = true
        },
        hideTips() {
            this.tipsVisible = false
        },
    },
}
</script>
<style lang="scss" scoped>
.rss-box {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0 auto;
    padding-top: 510px;
    transition: all 0.2s ease;
    @media screen and (max-width: $mobileWidth) {
        min-width: 0;
    }
    &__header {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 500px;
        background-image: url(/blog_page_header.jpg);
        background-attachment: fixed;
        background-size: cover;
        border-radius: 0 0 1em 1em;
        .mask {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            opacity: 0.3;
        }
        .tit {
            position: absolute;
            bottom: 50px;
            left: 20px;
            right: 0;
            margin: auto;
            font-size: 50px;
            user-select: none;
            color: #fff;
        }
    }
    &__content {
        box-sizing: border-box;
        width: 1200px;
        padding: 20px 10px;
        @media screen and (max-width: $mobileWidth) {
            width: 100%;
        }
        &__note {
            padding: 10px;
            border: 2px solid rgb(150, 150, 150);
            border-radius: 10px;
            box-shadow: rgb(150, 150, 150) 0.4rem 0.4rem 0px 0px;
        }
        .left {
            float: left;
            width: 870px;
            @media screen and (max-width:$mobileWidth) {
                float: none;
                width: 100%;
            }
        }
        .right {
            margin-left: 900px;
            @media screen and (max-width:$mobileWidth) {
                margin-left: 0;
            }
        }
        .result {
        }
        &__tit {
            position: relative;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            line-height: 40px;
            margin: 20px auto 20px auto;
            padding: 10px;
            font-weight: 600;
            border-bottom: 1px dashed rgb(230, 230, 230);
            font-size: 1.2em;
            
            & > * {
                margin: 0 5px;
            }
            .tips {
                position: absolute;
                top: -10px;
                left: 0;
                width: 90%;
                left: 0;
                right: 0;
                margin: 0 auto;
                transform: translateY(-100%);
                background: #fff;
                color: #666;
                font-size: 14px;
                border: 2px solid #eee;
                border-radius: 5px;
                ul {
                    padding: 10px 0;
                    list-style-type: none;
                }
                li {
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    padding: 0 10px;
                    line-height: 30px;
                }
            }
        }
        &__list {
            height: 100vh;
            overflow-x: hidden;
            overflow-y: auto;
        }
        &__result {
            position: relative;
            box-sizing: border-box;
            display: inline-block;
            width: 270px;
            height: 270px;
            padding: 10px;
            margin-left: 20px;
            margin-bottom: 30px;
            border: 2px solid #eee;
            border-radius: 5px;
            background: #fff;
            overflow: hidden;
            cursor: pointer;
            @media screen and (max-width:$mobileWidth) {
                display: block;
                margin: 20px auto;
            }
            &__msg {
                box-sizing: border-box;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                padding: 10px 10px 10px 30px;
                background: rgba(255, 255, 255, 0.7);
                transform: translateY(50%);
                transition: transform 0.2s ease;
                color: #444;
                a {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    border: 1px solid #000;
                    padding: 10px;
                    border-radius: 10px;
                    &:hover {
                        color: $linkHoverColor;
                        border-color: $linkHoverColor;
                    }
                }
                p {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    line-height: 30px;
                    margin-top: 30px;
                    font-size: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                span {
                    font-size: 14px;
                }
            }
            &:hover &__msg {
                transform: translateY(0);
            }
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    }
    &__left {
        margin-bottom: 30px;
        @media screen and (max-width: $mobileWidth) {
            width: 100%;
        }
    }
    &__right {
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
    &__pagination {
        text-align: center;
    }
}

.tips-enter-active,
.tips-leave-active {
    transition: all 0.2s ease;
}
.tips-enter,
.tips-leave-to {
    top: 0;
    opacity: 0;
}
</style>