<template>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"  width="200" height="60" viewbox="0 0 200 60">
        <text x="50%" y="70%" font-size="30" font-family="Ubuntu" text-anchor="middle" dominant-baseline="middle" class="text" :class="{show: show}" :style="`stroke: ${theme==1?'#fff':'#ddd'}`">{{text}}</text>
    </svg>
</template>
<script>
export default {
    data() {
        return {
            text: 'Genos\'s Blog'
        }
    },
    mounted() {
    },
    props: {
        show: {
            type: Boolean,
            default: true
        },
        theme: [String, Number]
    },
    watch: {
        theme() {
            console.log(this.show)
        }
    }
}
</script>
<style lang="scss" scoped>
    .text {
        stroke-width:0.5;
        fill: rgba(0,0,0,0);
        stroke-dasharray:0 1000;
    }
    .show {
         animation: svg-fill 3s 1s ease forwards;
    }
    @keyframes svg-fill {
        0% {
            fill: rgba(0, 0, 0, 0);
            stroke-dasharray: 0 1000;
        }
        100% {
            fill: rgba(255, 255, 255,.9);
            stroke-dasharray: 1000 1000;
        }
    }
</style>