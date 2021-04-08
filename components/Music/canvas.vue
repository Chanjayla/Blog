<template>
    <canvas ref="cvs" :width="width" :height="height"></canvas>
</template>
<script>
export default {
    data() {
        return {
            width: 0,
            height: 0,
            drawVisual: null,
            timer: -1,
        }
    },
    mounted() {
        this.resizeHandle()
        window.addEventListener('resize', this.resizeHandle.bind(this))
    },
    destroyed() {
        window.removeEventListener('resize', this.resizeHandle)
    },
    props: ['dataArray', 'playing', 'analyser', 'maxWidth'],
    watch: {
        playing() {
            if (this.playing) {
                this.draw()
            } else {
                // cancelAnimationFrame(this.drawVisual)
            }
        },
    },
    methods: {
        resizeHandle() {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                var node = this.$refs['cvs']
                var parentWidth = node.parentNode.clientWidth
                var parentHeight = node.parentNode.clientHeight
                this.canvasCtx = node.getContext('2d')
                if (this.maxWidth && this.maxWidth < parentWidth) {
                    this.width = this.maxWidth
                } else {
                    this.width = parentWidth
                }
                this.height = parentHeight
            }, 200)
        },
        draw() {
            let dataArray = []
            if (this.analyser && this.dataArray) {
                this.analyser.getByteFrequencyData(this.dataArray)
                dataArray = this.dataArray
            } else {
                dataArray = this.randomFrequency()
            }
            this.canvasCtx.clearRect(0, 0, this.width, this.height)
            // this.canvasCtx.fillStyle = 'rgba(0,0,0,0.3)'
            // this.canvasCtx.fillRect(0,0,this.width,this.height)
            var allZero = true
            var bufferLength = dataArray.length
            var barWidth = this.width / bufferLength
            var barHeight
            var x = 0
            for (var i = 0; i < bufferLength; i++) {
                if (dataArray[i] > 0) {
                    allZero = false
                }
                barHeight = (dataArray[i] * this.height) / 128
                this.canvasCtx.fillStyle = `rgb(0, 179, ${
                    barHeight + 100
                }, 0.3)`
                this.canvasCtx.fillRect(
                    x,
                    this.height - barHeight,
                    barWidth,
                    barHeight
                )

                x += barWidth + 1
            }
            if (!this.playing && allZero) {
                return
            }
            this.drawVisual = requestAnimationFrame(this.draw.bind(this))
        },
        randomFrequency() {
            const data = []
            for(let i=0;i<255;++i) {
                data[i] = parseInt(Math.random() * 255, 10)
            }
            return data
        },
    },
}
</script>