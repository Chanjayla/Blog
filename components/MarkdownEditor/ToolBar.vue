<template>
    <div class="tool-bar" @click="selectTool">
        <i data-tag="h1">h1</i>
        <i data-tag="h2">h2</i>
        <i data-tag="h3">h3</i>
        <i data-tag="h4">h4</i>
        <i data-tag="h5">h5</i>
        <i data-tag="bold" class="iconfont icon-bold"></i>
        <i data-tag="italic" class="iconfont icon-italic"></i>
        <i data-tag="underline" class="iconfont icon-underline"></i>
        <i data-tag="strikethrough" class="iconfont icon-strikethrough"></i>
        <i data-tag="link" class="iconfont icon-link"></i>
        <i data-tag="image" class="iconfont icon-image"></i>
        <i data-tag="table" class="iconfont icon-table"></i>
        <i data-tag="code" class="iconfont icon-code"></i>
        <i data-tag="headline" class="iconfont icon-headline"></i>
        <i data-tag="unordered-list" class="iconfont icon-unordered-list"></i>
        <i data-tag="ordered-list" class="iconfont icon-ordered-list"></i>
        <i data-tag="quote" class="iconfont icon-quote"></i>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        selectTool(e) {
            const tag = e.target.dataset.tag
            switch(tag) {
                case 'h1': 
                    this.$emit('tool', '# {$1}')
                    break
                case 'h2':
                    this.$emit('tool', '## {$1}')
                    break
                case 'h3': 
                    this.$emit('tool', '### {$1}')
                    break
                case 'h4':
                    this.$emit('tool', '#### {$1}')
                    break
                case 'h5': 
                    this.$emit('tool', '##### {$1}')
                    break
                case 'bold':
                    this.$emit('tool', '**{$1}**')
                    break
                case 'italic':
                    this.$emit('tool', '*{$1}*')
                    break
                case 'underline':
                    this.$emit('tool', '++{$1}++')
                    break
                case 'strikethrough':
                    this.$emit('tool', '~~{$1}~~')
                    break
                case 'link':
                    this.$emit('tool', '[{$1}](https://xxx.com)')
                    break
                case 'image':
                    this.$emit('tool', '![{$1}](https://xxx/favicon.ico)', 'image')
                    break
                case 'table':
                    this.$emit('tool', 'header 1 | header 2 \n ---|--- \n row 1 col 1 | row 1 col 2 \n row 2 col 1 | row 2 col 2')
                    break
                case 'code':
                    this.$emit('tool', '```\n{$1}\n```')
                    break
                case 'headline':
                    this.$emit('tool', '---\n{$1}')
                    break
                case 'unordered-list':
                    this.$emit('tool', '- {$1}')
                    break
                case 'ordered-list':
                    this.$emit('tool', '1. {$1}')
                    break
                case 'quote':
                    this.$emit('tool', '> {$1}')
                    break
                default: 
                    this.$emit('tool', '{$1}')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '~/assets/md-editor/iconfont.css';
.tool-bar {
    box-sizing: border-box;
    line-height: 24px;
    padding: 5px 10px;
    margin-bottom: 20px;
    background: #fff;
    i {
        display: inline-block;
        font-size: 14px;
        margin-right: 10px;
        font-style: normal;
        color: #606266;
        cursor: pointer;
        &:hover {
            color: #00b2ff;
        }
    }
}

</style>