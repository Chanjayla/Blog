import axios from 'axios'

export function search(data) {
    return axios.get(`/api/rss/custom?url=${data.url}`)
}

export function my() {
    return axios.get(`/api/rss/my`)
}

export function add(data) {
    return axios.post('/api/rss/add', data)
}

export function del(data) {
    return axios.post('/api/rss/del', data)
}