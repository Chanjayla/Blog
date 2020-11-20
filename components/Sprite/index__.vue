<template>
    <div class="sprite-box">
        <input
            ref="selectFiles"
            class="upload-btn"
            type="file"
            accept="image/png, image/jpeg"
            multiple
            @change="getFiles"
        />
        <el-row class="sprite-options">
            <el-button @click="upload" size="mini" type="primary">上传</el-button>
            <el-input v-model="space" size="mini" style="width: 150px;" placeholder="图片间距(默认10px)"></el-input>
            <div class="option-item">
                <span>排列方式:</span>
                <el-select v-model="arrange" size="mini" @change="arrangeChange">
                    <el-option key="horizontal" label="水平排列" value="horizontal"></el-option>
                    <el-option key="vertical" label="垂直排列" value="vertical"></el-option>
                    <el-option key="custom" label="自定义" value="custom"></el-option>
                </el-select>
            </div>
            <template v-if="arrange=='custom'">
                <el-input
                    v-model="maxWidth"
                    size="mini"
                    style="width: 150px;"
                    placeholder="最大宽度(默认1000)"
                ></el-input>
            </template>
        </el-row>

        <div ref="spriteBox" class="sprite-canvas">
            <canvas ref="spriteCanvas" width="300" height="300" @click="selectItem"></canvas>
            <div ref="highlight" class="highlight"></div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            files: [],
            imgDatas: [],
            context: null,
            space: '',
            arrange: 'horizontal',
            maxWidth: 1000,
        }
    },
    mounted() {
        this.context = this.$refs['spriteCanvas'].getContext('2d')
    },
    methods: {
        upload() {
            this.$refs['selectFiles'].click()
        },
        getFiles(e) {
            this.imgDatas = []
            this.files = Array.prototype.slice.call(e.target.files, 0)
            this.files.forEach((file) => {
                this.fileToImgData(file)
            })
        },
        fileToImgData(file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target.result) {
                    let img = new Image()
                    img.onload = () => {
                        this.imgDatas.push({
                            width: img.width,
                            height: img.height,
                            source: img,
                        })
                        if (this.files.length == this.imgDatas.length) {
                            this.drawImage()
                        }
                    }
                    img.src = e.target.result
                }
            }
            reader.readAsDataURL(file)
        },
        drawImage() {
            this.sortImage()
            this.calcSize()
            this.imgDatas.forEach((img) => {
                this.context.drawImage(
                    img.source,
                    img.x,
                    img.y,
                    img.width,
                    img.height
                )
            })
        },
        sortImage() {
            this.imgDatas.sort((a, b) => {
                return a.width - b.width
            })
        },
        calcSize() {
            let offsetX = 0
            let offsetY = 0
            let nextLineY = 0
            let lineHeight = 0
            let cw = 0
            let ch = 0
            this.imgDatas = this.imgDatas.map((img) => {
                offsetY = nextLineY
                
                if (this.arrange == 'horizontal') {
                    offsetX += img.width + (this.space || 10)
                } else if (this.arrange == 'vertical') {
                    offsetY += img.height + (this.space || 10)
                } else if (this.arrange == 'custom') {      
                    if (
                        offsetX + img.width + (this.space || 10) <
                        this.maxWidth
                    ) {
                        offsetX += img.width + (this.space || 10)
                        offsetY = nextLineY
                        lineHeight =
                        img.height > lineHeight ? img.height : lineHeight
                    } else {
                        offsetX = 0
                        nextLineY += lineHeight
                        lineHeight = img.height
                        offsetY = nextLineY + (this.space || 10)
                    } 
                }  
                img.x = offsetX
                img.y = offsetY
                cw =
                    cw < img.x + img.width + (this.space || 10)
                        ? img.x + img.width + (this.space || 10)
                        : cw
                ch = 
                    ch < img.y + img.height + (this.space || 10)
                        ? img.y + img.height + (this.space || 10)
                        : ch
                return img
            })
            this.$refs['spriteCanvas'].width = cw 
            this.$refs['spriteCanvas'].height = ch
        },
        selectItem(e) {
            const offsetX = e.offsetX
            const offsetY = e.offsetY
            this.imgDatas.some((img) => {
                if (
                    offsetX > img.x &&
                    offsetX < img.x + img.width &&
                    offsetY > img.y &&
                    offsetY < img.y + img.height
                ) {
                    this.showHighlight({
                        x: img.x,
                        y: img.y,
                        w: img.width,
                        h: img.height,
                    })
                }
            })
        },
        showHighlight(pos) {
            this.optimize(pos)
            const highlight = this.$refs['highlight']
            highlight.style.left = pos.x + 'px'
            highlight.style.top = pos.y + 'px'
            highlight.style.width = pos.w + 'px'
            highlight.style.height = pos.h + 'px'
        },
        arrangeChange(val) {
            this.arrange = val
            this.drawImage()
        },
        optimize(pos) {
            
            // const data = this.context.getImageData(pos.x,pos.y, pos.x+pos.w, pos.y+pos.h).data
            // console.log(data)
        },
    },
}
</script>
<style lang="scss" scoped>
.sprite-box {
    box-sizing: border-box;
    position: relative;
    padding: 10px;
    width: 100%;
    border-radius: 5px;
    .upload-btn {
        position: absolute;
        z-index: -1;
    }
    .sprite-options {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        & > * {
            margin-right: 10px;
        }
        .option-item {
            white-space: nowrap;
            font-size: 12px;
        }
    }
    .sprite-canvas {
        position: relative;
        width: 100%;
        height: 300px;
        border: 2px solid #fff;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEX///8AAABVwtN+AAAAAnRSTlMzMz0oyR4AAAARSURBVAgdY/jPwIAVYRf9DwB+vw/xbMOy9QAAAABJRU5ErkJggg==);
        background-repeat: repeat;
        overflow: auto;
    }
    .highlight {
        position: absolute;
        left: 0;
        width: 0;
        background: rgba(0, 0, 0, 0.3);
    }
}
</style>