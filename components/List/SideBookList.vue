<template>
    <div class="side-list">
        <div
            v-for="item in dataList"
            :key="item.name"
            class="side-item"
            @click="search"
            :data-url="item.url"
        >
            <span
                class="side-item__bg"
                :style="`background-image: url(${item.image})`"
            ></span>
            <div class="side-item__box">
                <span class="side-item__text">
                    {{ item.name }}
                </span>
                <img
                    v-if="item.image"
                    class="side-item__icon"
                    :src="item.image"
                />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['dataList'],
    methods: {
        search(e) {
            const url = e.target.dataset.url 
            if(url) {
                this.$emit('search', url)
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.side-list {
     width: 420px;
    .side-item {
        display: block;
        position: relative;
        width: 100%;
        height: 90px;
        margin-bottom: 15px;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        & > * {
            pointer-events: none;
        }
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
            width: 100%;
            height: 100%;
            -webkit-box-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            align-items: center;
            background-color: rgba(245, 245, 245, 0.8);
        }
        &:hover .side-item__box {
            background-color: rgba(245, 245, 245, 0.3);
        }
        .side-item__text {
            box-sizing: border-box;
            padding-left: 10px;
            color: #444;
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
}
</style>