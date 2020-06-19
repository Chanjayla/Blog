import Vue from 'vue'
import { highlight, textdetail } from './directives/index'

Vue.directive('textdetail', textdetail)
Vue.directive('highlight', highlight)