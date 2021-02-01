<template>
    <div class="code-panel">
        <div class="mask"></div>
        <div class="code-mirror">
             <el-button type="text" @click="startTest">测试耗时</el-button>
            <no-ssr placeholder="Codemirror Loading...">
                <codemirror
                    ref="editor"
                    class="editor-panel"
                    v-model="code"
                    :options="cmOption"
                    style="line-height: 24px"
                ></codemirror>
            </no-ssr>
            <div class="analyze">
                <h2>耗时:</h2>
                <p>{{sec}}</p>

            </div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'blog',
    data() {
        return {
            code: '',
            cmOption: {
                tabSize: 4,
                foldGutter: true,
                lineNumbers: false,
                line: true,
                keyMap: 'sublime',
                mode: 'javascript',
                theme: 'zenburn',
                extraKeys: {},
            },
            sec: '',
            oParser: null,
            aListeners: [],
            status: 0
        }
    },
    mounted() {
        this.initWorker()
    },
    methods: {
        startTest() {
            let start = new Date().getTime()
            let self = this
            this.asyncEval(this.code, function (sMessage) {
                let end = new Date().getTime()
                self.sec = ((end-start) / 1000).toFixed(3) + 's'
                self.status = 0
            })
        },
        asyncEval(sCode, fListener) {
            if(this.status === 1) {
                this.oParser.terminate()
                this.initWorker()
            }
            this.status = 1
            this.aListeners.push(fListener || null)
            this.oParser.postMessage({
                id: this.aListeners.length - 1,
                code: sCode,
            })
        },
        initWorker() {
            this.oParser = new Worker(
                'data:text/javascript;charset=US-ASCII,onmessage%20%3D%20function%20%28oEvent%29%20%7B%0A%09postMessage%28%7B%0A%09%09%22id%22%3A%20oEvent.data.id%2C%0A%09%09%22evaluated%22%3A%20eval%28oEvent.data.code%29%0A%09%7D%29%3B%0A%7D'
            )
        this.oParser.onmessage =  (oEvent) => {
            if (this.aListeners[oEvent.data.id]) {
                this.aListeners[oEvent.data.id](oEvent.data.evaluated)
            }
            delete this.aListeners[oEvent.data.id]
        }
        }
    },
}
</script>
<style lang="scss" scoped>
.code-panel {
    box-sizing: border-box;
    .mask {
        width: 100%;
        height: $headerHeight;
    }
}
.code-mirror::v-deep {
    box-sizing: border-box;
    position: relative;
    padding: 10px 200px 0 10px;
    width: 100%;
    .editor-panel {
        height: 500px;
        .CodeMirror {
            padding: 10px;
            height: 500px;   
        }
    }
    .analyze {
        display: flex;
        position: absolute;
        right: 0;
        bottom: 0;
        width: 190px;
        height: 500px;
        flex-direction: column;
        justify-content: center;
        align-items:  center;
        background: #eee;
        line-height: 2;
        h2 {
            font-size: 20px;
        }
        p {
            font-size: 16px;
        }
    }
}
</style>