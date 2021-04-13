<template>
    <div>
        <canvas
            ref="cvs"
            width="30"
            height="30"
            v-if="isSupportCanvas"
        ></canvas>
        <i
            :class="status == 1 ? 'night' : 'noon'"
            v-else
        ></i>
    </div>
</template>
<script>

export default {
    data() {
        return {
            context: null,
            width: 30,
            height: 30,
            imageData: null,
            clearPos: -15,
            direction: -1,
            noonColor: '#ffee8c',
            nightColor: '#16b9f9',
            isSupportCanvas: true,
        }
    },
    props: ['status'],
    mounted() {
        this.context = this.$refs['cvs'].getContext('2d')
        if (this.context) {
            this.isSupportCanvas = true
            this.paintArc()
            if (this.status == 1) {
                this.clearPos = 0
                this.direction = 1
                this.anime()
            }
        } else {
            this.isSupportCanvas = false
        }
    },
    methods: {
        paintArc() {
            this.context.moveTo(15, 15)
            this.context.arc(15, 15, 15, 0, Math.PI * 2)
            this.context.fillStyle =
            this.status == 1 ? this.nightColor : this.noonColor
            this.context.fill()
        },
        anime() {
            this.context.beginPath()
            this.paintArc()
            this.clearArc(this.clearPos, this.clearPos, 20)
            this.clearPos += this.direction * 1
            this.context.closePath()
            if (this.clearPos <= 0 && this.clearPos >= -15) {
                requestAnimationFrame(this.anime.bind(this))
            }
        },
        clearArc(x, y, radius) {
            for (var i = x - radius; i < x + radius; ++i) {
                for (var j = y - radius; j < y + radius; ++j) {
                    if (
                        (i - x) * (i - x) + (j - y) * (j - y) <=
                        radius * radius
                    ) {
                        this.context.clearRect(i, j, 1, 1)
                    }
                }
            }
        },
    },
    watch: {
        status() {
            if(!this.isSupportCanvas) return 
            if (this.status) {
                this.direction = 1
                this.anime()
            } else {
                this.direction = -1
                this.anime()
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.noon {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    border-radius: 50%;
    background: #ffee8c;
    overflow: hidden;
    cursor: pointer;
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: -24px;
        left: -24px;
        border-radius: 50%;
        background: #000;
        transition: all 0.2s linear;
    }
}
.night {
    position: relative;
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    border-radius: 50%;
    background: #ffee8c;
    overflow: hidden;
    cursor: pointer;
    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: -10px;
        left: -10px;
        border-radius: 50%;
        background: #000;
        transition: all 0.2s linear;
    }
}
</style>