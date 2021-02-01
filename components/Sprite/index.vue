<template>
    <div class="sprite-box">
        <input
            ref="selectFiles"
            type="file"
            accept="image/png, image/jpeg"
            multiple
            style="position: absolute; top: 0; z-index: -1"
            @change="getFiles"
        />
        <div class="tool-list">
            <p class="tit">操作</p>
            <el-button type="primary" @click="upload" size="mini"
                >上传图片</el-button
            >
            <el-radio-group v-model="tool" size="mini" @change="selectTool">
                <el-radio-button label="裁切"></el-radio-button>
                <el-radio-button label="拼合"></el-radio-button>
                <el-radio-button label="缩放"></el-radio-button>
                <el-radio-button label="旋转"></el-radio-button>
            </el-radio-group>
        </div>
        <div class="image-list">
            <p class="tit">素材</p>
            <div style="display: flex; height: 80px">
                <div
                    class="image-item"
                    v-for="(image, idx) in imageList"
                    :key="image.source"
                    :class="selectList.indexOf(idx) > -1 ? 'select' : ''"
                >
                    <img
                        :src="image.source"
                        :data-idx="idx"
                        @click="selectImage"
                    />
                </div>
            </div>
        </div>
        <div class="param-list">
            <p class="tit">参数</p>
            <div class="params" :key="tool">
                <template v-if="tool == '裁切'">
                    <div class="param-item">
                        <label for="areaLeft">left：</label>
                        <input
                            type="text"
                            placeholder="left"
                            v-model="areaLeft"
                            name="areaLeft"
                        />
                    </div>
                    <div class="param-item">
                        <label for="areaLeft">top：</label>
                        <input
                            type="text"
                            placeholder="top"
                            v-model="areaTop"
                            name="areaTop"
                        />
                    </div>
                    <div class="param-item">
                        <label for="areaLeft">width：</label>
                        <input
                            type="text"
                            placeholder="width"
                            v-model="areaWidth"
                            name="areaWidth"
                        />
                    </div>
                    <div class="param-item">
                        <label for="areaLeft">height：</label>
                        <input
                            type="text"
                            placeholder="height"
                            v-model="areaHeight"
                            name="areaHeight"
                        />
                    </div>
                </template>
            </div>
        </div>
        <div class="work-pane">
            <p class="tit">预览</p>

            <div class="view">
                <div class="content">
                    <div v-for="view in viewList" :key="view.source">
                        <img :src="view.source" />
                    </div>
                    <div
                        class="area"
                        :style="`left: ${areaLeft};top: ${areaTop};width:${areaWidth};height:${areaHeight}`"
                    ></div>
                </div>
            </div>
            <div class="layers"></div>
        </div>
        <div class="handle">
            <el-button type="primary" size="mini" @click="create"
                >生成</el-button
            >
        </div>
        <!-- <input
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
        </div> -->
    </div>
</template>
<script>
import { dataURItoBlob } from '~/utils'
import * as Sprite from '~/api/sprite'
export default {
    data() {
        return {
            files: [],
            imageList: [],
            selectList: [],
            viewList: [],
            context: null,
            space: '',
            arrange: 'horizontal',
            maxWidth: 1000,
            tool: '',
            areaLeft: 0,
            areaTop: 0,
            areaWidth: '100%',
            areaHeight: '100%',
        }
    },
    mounted() {
        // this.context = this.$refs['spriteCanvas'].getContext('2d')
    },
    watch: {},
    methods: {
        upload() {
            this.$refs['selectFiles'].click()
        },
        getFiles(e) {
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
                        this.imageList.push({
                            width: img.width,
                            height: img.height,
                            source: img.src,
                        })
                        // if (this.files.length == this.imgDatas.length) {
                        //     this.drawImage()
                        // }
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
        selectTool(label) {
            this.tool = label
        },
        selectImage(e) {
            const target = e.target
            let idx = target.dataset.idx
            if (typeof idx != 'undefined') {
                idx = parseInt(idx)
                if (this.selectList.indexOf(idx) > -1) {
                    this.selectList.splice(idx, 1)
                } else {
                    this.selectList.push(idx)
                }
            }
            this.preview()
        },
        preview() {
            if (this.tool && this.selectList.length > 0) {
                if (this.tool == '裁切') {
                    this.viewList = [this.imageList[this.selectList[0]]]
                }
            }
        },
        create() {
            if (this.tool == '裁切') {
                Sprite.create({
                    source: this.imageList[this.selectList[0]].source,
                    handle: 1,
                    params: {
                        l: this.areaLeft,
                        t: this.areaTop,
                        w: this.areaWidth,
                        h: this.areaHeight,
                    },
                }).then((res) => {})
            }
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
    .tit {
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
        font-size: 14px;
        color: #666;
    }
    .tool-list {
        margin-bottom: 10px;
    }
    .image-list {
        margin-bottom: 10px;
        .image-item {
            box-sizing: border-box;
            width: 80px;
            height: 80px;
            border: 5px solid transparent;
        }
        .image-item.select {
            border-color: $linkHoverColor;
        }
        img {
            width: 100%;
            height: 100%;
        }
    }
    .param-list {
        margin-bottom: 10px;
        .params {
            .param-item {
                display: flex;
                align-items: center;
                input {
                    display: block;
                    line-height: 24px;
                    margin: 5px 0;
                    border: 0;
                    outline: none;
                    background: #eee;
                }
            }
        }
    }
    .work-pane {
        position: relative;
        min-height: 500px;
        margin-bottom: 10px;
        .view {
            margin: 0 200px;
            overflow: auto;
            .content {
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                .area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                }
            }
        }
        .layers {
            position: absolute;
            top: 40px;
            right: 0;
            width: 100px;
        }
    }
}
</style>