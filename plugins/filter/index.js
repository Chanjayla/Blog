import Vue from 'vue'


function numAddZero(num) {
    return num < 10 ? `0${num}` : `${num}`
  }
  
const timestampFilter = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = numAddZero(date.getMonth() + 1)
      const day = numAddZero(date.getDate())
      const hour = numAddZero(date.getHours())
      const minute = numAddZero(date.getMinutes())
      const second = numAddZero(date.getSeconds())
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    } else {
      return ''
    }
  }
  
  Vue.filter('timestampToDate', timestampFilter)