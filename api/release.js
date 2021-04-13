import axios from 'axios'

export function getAll() {
    return axios.get('/api/release/getAll')
}

export function add(data) {
    return axios.post('/api/release/add', data)
}

export function del(data) {
    return axios.post('/api/release/delete', data)
}