<template>
    <div class="editor-container">
        <ToolBar @tool="inputValue" />
        <el-row class="editor-box">
            <el-col :span="type=='divide' ? 12 : 24" style="margin-bottom: 10px;">
                <no-ssr placeholder="Codemirror Loading...">
                    <codemirror
                        ref="editor"
                        class="editor-panel"
                        v-model="code"
                        :options="cmOption"
                        style="line-height: 24px;"
                    ></codemirror>
                </no-ssr>
            </el-col>
            <el-col :span="type=='divide' ? 12 : 24" class="view">
                <div class="markdown-content" v-highlight v-html="viewHtml"></div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import marked from 'marked'
import ToolBar from './ToolBar'
export default {
    data() {
        return {
            code: '',
            cmOption: {
                tabSize: 4,
                foldGutter: true,
                lineNumbers: false,
                line: true,
                keyMap: 'sublime',
                mode: 'markdown',
                theme: 'zenburn',
                extraKeys: {},
            },
        }
    },
    props: {
        accept: String,
        type: {
            default: 'divide',
            type: String
        }
    },
    methods: {
        inputValue(text) {
            const selection =
                this.$refs['editor'].codemirror.doc.getSelection() || 'text'
            this.$refs['editor'].codemirror.doc.replaceSelection(
                text.replace('{$1}', selection)
            )
            this.$refs['editor'].codemirror.focus()
        },
    },
    components: {
        ToolBar,
    },
    computed: {
        viewHtml() {
            return marked(this.code)
        },
    },
    watch: {
        accept() {
            this.code = this.accept
        },
    },
    mounted() {},
}
</script>
<style lang="scss" scoped>
.editor-container {
    box-sizing: border-box;
    .editor-box {
        box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
    }
    .editor-panel ::v-deep {
        min-height: 500px;
        height: auto;
        overflow: hidden;
        .CodeMirror {
            padding: 10px;
            height: 500px;
            
        }
    }
}
.view {
    display: inline-block;
    box-sizing: border-box;
    padding: 10px;
    background: #fff;
    height: 500px;
    overflow: auto;
}
</style>