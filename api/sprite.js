import axios from 'axios'
export function create(data) {
    return axios.post('/upload/sprite', data)
}