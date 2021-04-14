<template>
    <div class="tag-cloud">
        <h2 class="tag-cloud__tit">
            <i class="iconfont icon-tag"></i>
            <span>Tag</span>
        </h2>
        <div class="tag-cloud__list">
            <nuxt-link
                :to="`/blog/tag/${tag.name}`"
                v-for="tag in dataList"
                :key="tag.id"
                class="tag-cloud__list__item"
                >{{ tag.name }}</nuxt-link
            >
        </div>
    </div>
</template>
<script>

export default {
    props: ['dataList'],
}
</script>
<style lang="scss">
.tag-cloud {
    width: 300px;
    margin-top: 30px;
    &__tit {
        display: flex;
        width: 100%;
        line-height: 2;
        font-size: 18px;
        font-weight: normal;
        border-bottom: 1px dashed rgb(230, 230, 230);
        .iconfont {
            margin-right: 10px;
            font-size: 18px;
        }
    }
    &__list {
        width: 100%;
        margin-top: 10px;
        &__item {
            display: inline-block;
            margin-right: 10px;
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.6;
            color: rgb(0, 150, 94);
            background-color: rgba(0, 150, 94, 0.1);
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 94, 0.2);
            }
        }
    }
}
</style>
