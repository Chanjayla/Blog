import axios from 'axios'

export function userLogin(data) {
    return axios.post('/user/login', data)
}

export function modify(data) {
    return axios.post('/user/modify', data)
}

export function modifyPwd(data) {
    return axios.post('/user/modifyPwd', data)
}