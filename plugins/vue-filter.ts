import Vue from 'vue'
import { timestampFilter } from './filters/index'


Vue.filter('timestampToDate', timestampFilter)