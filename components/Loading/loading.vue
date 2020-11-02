<template>
    <div class="loading-mask" :class="loadingStyles">
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
    },
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
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    .content {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-weight: bold;
        font-size: 14px;
        opacity: 0;
        .icon {
            display: block;
            width: 80px;
            height: 80px;
            background-image: url(/loading.png);
            background-repeat: no-repeat;
            background-size: 100%;
            animation: loading-anim 2.5s linear infinite forwards;
            animation-play-state:paused;
        }
        .text {
            margin-top: 10px;
        }
    }
}
.loading-enter {
    transition: all 0.5s ease-in-out;
    z-index: 98;
    .content {
        opacity: 1;
        transition: all 0.2s ease;
        .icon {
            animation-play-state: running;
        }
    }
}
.loading-end {
    opacity: 0;
    z-index: 98;
}
</style>