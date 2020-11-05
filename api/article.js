import axios from 'axios'
export function getLatest() {
    return axios.get('/api/article/latest')
}

export function getPage(data) {
    return axios
    .post('/api/article/page', data)
}

export function getById(data) {
    return axios.post('/api/article/getById', data).then(res => {
        return res.data
    })
}

export function getByTag(data) {
    return axios.post('/api/article/page', data)
}

export function add(data) {
    return axios.post('/api/article/add', data)
}

export function del(data) {
    return axios.post('/api/article/delete', data)
}

export function setTop(data) {
    return axios.post('/api/article/setTop', data)
} 

export function getTop() {
    return axios.get('/api/article/getTop')
}

export function getHot() {
    return axios.get('/api/article/getHot')
}

export function search(data) {
    return axios.get(`/api/article/search?keyword=${data.keyword}&page=${data.page||1}&pageSize=${data.pageSize||10}`)
}