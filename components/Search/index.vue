<template>
    <div class="search-box">
        <i v-if="isMobile" class="el-icon-search" @click="toggleSearchInput"></i>
        <el-input
            v-model="searchKey"
            placeholder="Search ..."
            @input="search"
            :clearable="true"
            :class="{'mobile-search': isMobile,'mobile-search-show': searchOpen}"
        >
            <i
                slot="prefix"
                class="el-input__icon el-icon-search"
                style="color: #c0c4cc"
            ></i>
        </el-input>
        <div
            class="search-box__result mask"
            :class="status ? 'show' : ''"
            ref="resultList"
        >
            <template v-if="total > 0">
                <nuxt-link
                    v-for="item in list"
                    :key="item._id"
                    :to="`/blog/${item._id}`"
                    class="search-box__item"
                >
                    <h2 class="tit" v-html="item.title"></h2>
                    <div class="tag">
                        <span v-for="tag in item.tags" :key="tag"
                            >&nbsp;{{ tag }}</span
                        >
                    </div>
                    <p class="desc" v-html="item.description"></p>
                    <span class="publish">{{
                        item.publish_time | timestampToDate
                    }}</span>
                </nuxt-link>
            </template>
            <template v-else>
                <div style="text-align: center">Not Found</div>
            </template>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import * as Article from '~/api/article'
export default {
    data() {
        return {
            searchKey: '',
            status: 0,
            timer: 0,
            total: 0,
            page: 1,
            pageSize: 10,
            list: [],
            searchOpen: false
        }
    },
    mounted() {
        // this.$refs['resultList'].addEventListener('')
    },
    computed: {
        ...mapState({
            themeName: (state) => state.app.themeName,
            isMobile: (state) => state.app.isMobile,
        }),
        mobileStyle() {
            return this.isMobile ? 'mobile-search' : ''
        },
    },
    methods: {
        search() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.page = 1
                if (this.searchKey == '') {
                    this.status = 0
                } else {
                    this.status = 1
                    this.requestSearch()
                }
            }, 200)
        },
        requestSearch() {
            Article.search({
                keyword: this.searchKey,
                page: this.page,
                pageSize: this.pageSize,
            }).then((res) => {
                if (res.data.code === 0) {
                    const regExp = new RegExp(this.searchKey, 'ig')
                    this.list = res.data.data.map((item) => {
                        item.title = item.title.replace(
                            regExp,
                            `<u>${this.searchKey}</u>`
                        )
                        item.description = item.description.replace(
                            regExp,
                            `<u>${this.searchKey}</u>`
                        )
                        return item
                    })
                    this.total = res.data.total
                }
            })
        },
        toggleSearchInput() {
            this.searchOpen = !this.searchOpen
        }
    },
}
</script>
<style lang="scss" scoped>
.search-box {
    display: flex;
    align-items: center;
    margin-left: 10px;
    &__result {
        box-sizing: border-box;
        position: fixed;
        width: 500px;
        height: 100vh;
        top: 0;
        right: 0;
        padding-top: $headerHeight;
        transition: transform 250ms ease 0s;
        transform: translateX(100%);
        box-shadow: rgba(0, 0, 0, 0.1) 0 2px 65px 0;
        z-index: -1;
        color: #fff;
        overflow-x: hidden;
        overflow-y: auto;
        @media screen and (max-width: 500px) {
            width: 100%;
        }
    }
    .show {
        transform: translateX(0);
    }
    &__item {
        display: block;
        box-sizing: border-box;
        padding: 20px;
        transition: background 0.2s ease;
        cursor: pointer;
        .tit {
            font-size: 16px;
            line-height: 1.8;
        }
        .tag {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
        }
        .desc {
            color: #bbb;
            font-size: 14px;
            line-height: 1.6;
            white-space: normal;
        }
        .publish {
            display: block;
            height: 30px;
            line-height: 30px;
            color: #999;
            font-size: 12px;
            text-align: right;
        }
        &:hover {
            background: rgba(102, 102, 102, 0.9);
            color: inherit;
        }
    }
    .mobile-search {
        position: fixed;
        top: 0;
        left: 0;
        width: 145px;
        transform: translateX(-100%);
        transition: all 250ms ease 0s;
        opacity: 0;
    }
    .mobile-search-show {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>