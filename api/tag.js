import axios from 'axios'

export function getAll() {
    return axios.get('/api/tag/all')
}

export function add(data) {
    return axios.post('/api/tag/add', data)
}

export function del(data) {
    return axios.post('/api/tag/del', data)
}

export function modify(data) {
    return axios.post('/api/tag/modify', data)
}