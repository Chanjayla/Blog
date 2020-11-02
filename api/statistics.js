import axios from 'axios'
export function getPv(data) {
    return axios.get(`/statistics/getPv?stime=${data.stime}`)
}

export function getBlogPv() {
    return axios.get('/statistics/getBlogPv')
}