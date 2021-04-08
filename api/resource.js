import axios from 'axios'

export function getPage(data) {
    return axios.get(`/resource/page?page=${data.page||1}&pageSize=${data.pageSize||10}&type=${data.type}`,)
}

export function update(data) {
    return axios.post('/resource/update', data)
}

export function del(data) {
    return axios.post('/resource/delete', data)
}

export function getAllAudio() {
    return axios.post('/resource/list/audio')
}

export function getAudio(id, start) {
    return axios({
        method: 'GET',
        url: '/resource/audio/' + id,
        // headers: {
        //     'Range': 'bytes=' + (start || 0) + '-',
        //     'Content-Type': 'audio/mp3'
        // },
        // responseType: 'arraybuffer'
    })
}