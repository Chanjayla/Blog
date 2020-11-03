<template>
    <div class="home-box__side__list">
        <nuxt-link
            v-for="item in dataList"
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
                    <span class="side-item__tit">{{ item.title }}</span>
                    <span class="side-item__time"
                        >Publish at
                        {{ item.publish_time | timestampToDate }}</span
                    >
                </span>
                <img
                    class="side-item__icon"
                    :src="item.preview_image"
                    @error="loadDefaultImg"
                />
            </span>
        </nuxt-link>
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
.side-item {
    display: block;
    position: relative;
    width: 420px;
    height: 90px;
    margin-bottom: 15px;
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
    &:hover .side-item__box {
        background-color: rgba(245, 245, 245, 0.3);
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
    .side-item__icon {
        width: 90px;
        height: 90px;
        object-fit: cover;
    }
}
</style>