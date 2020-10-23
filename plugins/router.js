export default ({ app, store }) => {
    app.router.beforeEach((to, from, next) => {
        if(to.name&&to.name.match(/blog/)&&to.name != from.name) {
            store.dispatch('app/toggleLoading', 1)
            if(!process.server) {
                statistics(to.fullPath, from.fullPath)
            }
            setTimeout(function() {
                next()
            }, 500)
        } else {
            next()
        }
    })
}

function statistics(toPath, fromPath) {
    let params = `ltime=${new Date().getTime() / 1000}&url=${location.host}${toPath}&referer=${location.host}${fromPath}`
    let dom = document.createElement('img')
    dom.src = '/statistics/pv?' + params
}