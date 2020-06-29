const xml2js = require('xml2js')

function qqMusicDataHandle(data) {
    if (typeof data === 'string') {
        data = data.replace(/callback\(|MusicJsonCallback\(|jsonCallback\(|\)$/g, '')
        return JSON.parse(data)
    }
}

module.exports = {
    qqMusicDataHandle
}