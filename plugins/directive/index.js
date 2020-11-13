import Vue from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import 'highlight.js/styles/monokai-sublime.css'
hljs.registerLanguage('javascript', javascript)


const highlight = {
    update(el) {
        const nodes = el.querySelectorAll('pre')
        nodes.forEach(node => {
            hljs.highlightBlock(node)
        })
    }
}
Vue.directive('highlight', highlight)
