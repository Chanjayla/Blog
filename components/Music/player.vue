<template>
    <div class="mus-player">
        <div class="mus-player__ct" @click="selectTime" ref="progress">
            <span
                class="mus-player__ct-dot"
                :style="`width:${currentPercent * 100}%;`"
            ></span>
        </div>
        <div
            class="mus-player__ico"
            @click="switchStatus"
            :class="{ 'mus-player__playing': playing }"
            @mouseenter="enterPlayer"
            @mouseleave="leavePlayer"
        >
            <img :src="icon" v-if="icon" />
            <i v-else class="iconfont icon-music"></i>
        </div>
        <div class="mus-player__panel">
            <music-canvas
                :dataArray="audioFrequency"
                :analyser="audioAnalyser"
                :playing="playing"
                maxWidth="800"
            ></music-canvas>
        </div>
        <div
            class="mus-player__list"
            :class="{ 'mus-player__list_show': isShowPlayList }"
            @mouseenter="enterPlayer"
            @mouseleave="leavePlayer"
        >
            <ul>
                <li
                    v-for="(item, idx) in playList"
                    :key="item._id"
                    @click="playAudio(idx)"
                    :class="{ playing: idx == playingIndex }"
                >
                    {{ item.title }}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import musicCanvas from './canvas.vue'
import universalParse from 'id3-parser/lib/universal'
import { uint8arrayToBase64 } from '~/utils'
import * as Resource from '~/api/resource'

export default {
    data() {
        return {
            playList: [],
            isShowPlayList: false,
            playingIndex: -1,
            audioContext: null,
            audioAnalyser: null,
            audioFrequency: null,
            audioGain: null,
            loadFailed: false,
            ready: false,
            playing: false,
            timer: -1,
            audioBuffer: null,
            currentPercent: 0,
            currentTime: 0,
            audioData: null,
            tags: null,
            icon: '',
            areas: [],
            maxDuration: 0,
            maxPoint: 0,
            isFinish: false,
        }
    },
    mounted() {
        // this.init()
        this.getPlayList()
    },
    components: {
        musicCanvas,
    },
    watch: {
        tags() {
            if (this.tags && this.tags.image) {
                this.icon =
                    'data:' +
                    this.tags.image.mime +
                    ';base64,' +
                    uint8arrayToBase64(this.tags.image.data)
            }
        },
    },
    methods: {
        init() {
            this.getContext()
            this.analyse()
            return this.segmentDownload(0)
        },
        getPlayList() {
            Resource.getAllAudio().then((res) => {
                if (res.data.code === 0) {
                    this.playList = res.data.data
                }
            })
        },
        segmentDownload(start) {
            return Resource.getAudio(
                this.playList[this.playingIndex]['_id'],
                start
            ).then((res) => {
                var range = res.headers['content-range']
                var match = range.match(/bytes(\d+)-(\d+)\/(\d+)/)
                var startPoint = parseInt(match[1])
                var endPoint = parseInt(match[2])
                var total = parseInt(match[3])
                this.maxPoint = Math.max(this.maxPoint, endPoint + 1)
                if(this.maxPoint < total - 1) {
                    this.segmentDownload(this.maxPoint)
                }
                if (start === 0) {
                    this.audioData = new ArrayBuffer(total + 1)
                    this.dataArr = new Uint8Array(this.audioData)
                    universalParse(this.dataArr).then((tags) => {
                        this.tags = tags
                    })
                    this.dataArr.set(new Uint8Array(res.data), startPoint)
                    return this.handleAudioData()
                } else {
                    this.dataArr.set(new Uint8Array(res.data), startPoint) 
                    console.log(this.audioData)
                    return true
                }
                
            })
        },
        getContext() {
            window.AudioContext =
                window.AudioContext ||
                window.webkitAudioContext ||
                window.mozAudioContext ||
                window.msAudioContext
            try {
                this.audioContext = new AudioContext()
                this.audioGain = this.audioContext.createGain()
            } catch (e) {
                console.log('Browser do not support AudioContext')
            }
        },
        handleAudioData() {
            console.log(this.dataArr)
            return new Promise((resolve, reject) => {
                this.audioContext.decodeAudioData(
                    this.audioData.slice(0),
                    (buffer) => {
                        // var blobData = new Blob([new DataView(buffer)], {type: 'audio/mp3'})
                        console.log(buffer)
                        this.audioBuffer = buffer
                        var prevSource = this.audioSource
                        this.audioSource = this.audioContext.createBufferSource()
                        this.audioSource.buffer = this.audioBuffer
                        this.audioSource.connect(this.audioAnalyser)
                        this.maxDuration = buffer.duration
                        resolve(prevSource)
                    },
                    function (e) {
                        console.log('decodeAudioData error')
                    }
                )
            })
        },
        analyse() {
            this.audioAnalyser = this.audioContext.createAnalyser()
            this.audioAnalyser.smoothingTimeConstant = 0.85
            this.audioAnalyser.fftSize = 256
            this.audioAnalyser.connect(this.audioContext.destination)
            this.audioFrequency = new Uint8Array(
                this.audioAnalyser.frequencyBinCount
            )
        },
        play() {
            if (this.ready) {
                // this.audioSource = this.audioContext.createBufferSource()
                // this.audioSource.buffer = this.audioBuffer
                // this.audioSource.connect(this.audioAnalyser)
                // this.audioGain.gain.value = 0.1
                this.audioSource.start(0, this.currentTime)
                this.playing = true
                this.timer = setInterval(() => {
                    // this.audioAnalyser.getByteFrequencyData(this.audioFrequency)
                    if (this.currentTime > this.playList[this.playingIndex].duration) {
                        this.playing = false
                        this.ready = false
                        this.audioContext = null
                        this.audioAnalyser = null
                        this.currentTime = 0
                        this.currentPercent = 0
                        this.tags = null
                        this.icon = ''

                        clearInterval(this.timer)
                    } else {
                        this.currentTime += 0.1
                        this.currentPercent =
                            this.currentTime / this.playList[this.playingIndex].duration
                        if(!this.handling && this.currentTime >= this.maxDuration - 1) {
                            this.handling = true
                            this.handleAudioData().then((preSource) => {
                                clearInterval(this.timer)
                                preSource && preSource.stop(0)
                                this.handling = false
                                this.ready = true
                                this.play()
                            })
                        }
                    }
                }, 100)
            } else {
                if (this.playingIndex == -1) {
                    this.playingIndex = 0
                }
                this.init().then(() =>{
                    this.ready = true
                    this.play()
                })
            }
        },
        stop() {
            this.audioSource.stop(0)
            this.playing = false
            clearInterval(this.timer)
        },
        switchStatus() {
            if (this.playing) {
                this.stop()
            } else {
                this.play()
            }
        },
        selectTime(e) {
            if (this.audioContext && this.audioSource) {
                clearInterval(this.timer)
                var totalWidth = this.$refs['progress'].clientWidth
                var offsetX = e.offsetX
                this.audioSource.stop(0)
                this.currentPercent = offsetX / totalWidth
                this.currentTime =
                    this.playList[this.playingIndex].duration * this.currentPercent
                this.init().then(() => {
                    this.ready = true
                    this.play()
                })
            }
        },
        enterPlayer() {
            this.isShowPlayList = true
        },
        leavePlayer() {
            this.isShowPlayList = false
        },
        playAudio(index) {
            if (this.playing) {
                this.stop()
                this.playing = false
                this.ready = false
                this.currentTime = 0
            }
            this.playingIndex = index
            this.play()
        },
    },
}
</script>
<style lang="scss" scoped>
.mus-player {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 99;
    &__ico {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        bottom: 5px;
        left: 5px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(230, 230, 230, 1);
        border: 1px solid #ddd;
        cursor: pointer;
        overflow: hidden;
        z-index: 2;
        &:hover {
            background: rgba(230, 230, 230, 0.7);
        }
        i {
            position: relative;
            color: #999;
            font-size: 24px;
        }
        img {
            width: 100%;
            height: 100%;
            &:hover {
                opacity: 0.7;
            }
        }
    }
    &__playing {
        animation: 5s linear 0s infinite rotateAnim;
    }
    &__panel {
        height: 100%;
    }
    &__ct {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        cursor: pointer;
        &:hover &-dot::after {
            background: #00b3ff;
        }
        &-dot {
            position: absolute;
            width: 0;
            height: 100%;
            background: #00b3ff;
            &::after {
                content: '';
                position: absolute;
                right: -5px;
                top: 0;
                bottom: 0;
                margin: auto;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                transition: background 0.5s ease;
            }
        }
    }
    &__list {
        position: fixed;
        width: 200px;
        max-height: 350px;
        padding: 10px;
        left: 10px;
        bottom: 60px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 10px;
        border: 1px solid #aaa;
        overflow: auto;
        opacity: 0;
        transform: translateX(-100px);
        transition: all 0.3s 0.5s ease-in-out;
        z-index: 1;
        ul {
            padding: 0;
            list-style-type: none;
            li {
                display: block;
                line-height: 1.7;
                padding-bottom: 5px;
                font-size: 14px;
                cursor: pointer;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &:hover {
                    color: #ce560f;
                }
            }
            .playing {
                color: #ce560f;
            }
        }
    }
    &__list_show {
        opacity: 1;
        transform: translate(0, 0);
    }
}
@keyframes rotateAnim {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>