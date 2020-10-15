import axios from 'axios'

export function getPage(data) {
    return axios.get(`/upload/page?page=${data.page||1}&pageSize=${data.pageSize||10}&type=${data.type}`,)
}

export function update(data) {
    return axios.post('/upload/update', data)
}

export function del(data) {
    return axios.post('/upload/delete', data)
}