<template>
    <div class="loading-mask" :class="loadingStyles">
        <div class="bg">
            
        </div>
        <div class="content">
            <i class="icon"></i>
                <p class="text">LOADING . . .</p>
        </div>
    </div>
</template>
<script>
export default {
    props: ['status'],
    computed: {
        loadingStyles() {
            let activeStyle = ''
            if (this.status == 1) {
                activeStyle = 'loading-enter'
            } else if (this.status == 2) {
                activeStyle = 'loading-end'
            }
            return [activeStyle]
        },
    }
}
</script>
<style lang="scss" scoped>
@include keyframes(loading-anim) {
    0% {
        transform: rotate(0) translateX(-50px);
    }
    10% {
        transform: rotate(5deg) translateX(-30px);
    }
    20% {
        transform: rotate(-5deg) translateX(-10px);
    }
    30% {
        transform: rotate(5deg) translateX(10px);
    }
    40% {
        transform: rotate(-5deg) translateX(30px);
    }
    50% {
        transform: rotate(5deg) translateX(50px) rotateY(180deg);
    }
    60% {
        transform: rotate(-5deg) translateX(30px) rotateY(180deg);
    }
    70% {
        transform: rotate(5deg) translateX(10px) rotateY(180deg);
    }
    80% {
        transform: rotate(-5deg) translateX(-10px) rotateY(180deg);
    }
    90% {
        transform: rotate(5deg) translateX(-30px) rotateY(180deg);
    }
    100% {
        transform: rotate(-5deg) translateX(-50px) rotateY(180deg);
    }
}
.loading-mask { 
    &::before{
        content: '';
        position: fixed;
        left: 50%;
        top: 50%;
        width: 100vmax;
        height: 100vmax;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.5s ease-in-out;
        font-weight: bold;
        font-size: 14px;
        border-radius: 50%;
        z-index: 98;
    }
    .content {
        display: none;
        position: fixed;
        left: 50%;
        top: 50%;
        z-index: 99;
        transform: translate(-50%, -50%);
        .icon {
            display: block;
            width: 80px;
            height: 80px;
            background-image: url(/loading.png);
            background-repeat: no-repeat;
            background-size: 100%;
            animation: loading-anim 2.5s linear infinite forwards;
            animation-play-state: paused;
        }
        .text {
            margin-top: 10px;
        }
    }
}
.loading-enter {
    &::before{
        transform: translate(-50%, -50%) scale(1.5);
    }
    .content {
        display: block;
        .icon {
            animation-play-state: running;
        }
    }
}

</style>