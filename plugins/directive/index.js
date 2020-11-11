import Vue from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const highlight = {
    update(el) {
        const nodes = el.querySelectorAll('pre')
        nodes.forEach(node => {
            hljs.highlightBlock(node)
        })
    }
}
Vue.directive('highlight', highlight)
