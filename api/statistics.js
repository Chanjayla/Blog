import axios from 'axios'
export function getPv() {
    return axios.get('/statistics/getPv')
}