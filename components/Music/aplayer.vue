<template>
    <div class="aplayer-box">
       <div ref="aplayer"></div>
    </div>
</template>
<script>
import 'aplayer/dist/APlayer.min.css'
import * as Resource from '~/api/resource'
import APlayer from 'aplayer'
export default {
    data() {
        return {
            ap: null,
            playList: [],
            playing: false,
            canvasData: []
        }
    },
    components: {
        
    },
    mounted() {
        this.getPlayList().then(() => {
            this.ap = new APlayer({
                container: this.$refs.aplayer,
                fixed: true,
                listFolded: false,
                listMaxHeight: 90,
                lrcType: 1,
                audio: this.playList.map((item) => {
                    return {
                        name: item.album,
                        artist: item.artist,
                        url: item.path,
                        cover: item.path + '.jpg',
                    }
                }),
            })
            this.ap.on('playing', () => {
                this.playing = true
            })
            this.ap.on('pause', () => {
                this.playing = false
            })
            this.ap.on('ended', () => {
                this.playing = false
            })
        })
    },
    methods: {
        getPlayList() {
            return Resource.getAllAudio().then((res) => {
                if (res.data.code === 0) {
                    this.playList = res.data.data
                }
            })
        }
    },
}
</script>
<style scoped lang="scss">
.aplayer-box {
}
</style>