import axios from 'axios'

export function getPage(data) {
    return axios.get(`/docs/page?page=${data.page||1}&pageSize=${data.pageSize||10}`,)
}

export function get(data) {
    return axios.get(`/docs/get?name=${data.name||''}`, )
}

export function update(data) {
    return axios.post('/docs/update', data)
}

export function del(data) {
    return axios.post('/docs/delete', data)
}