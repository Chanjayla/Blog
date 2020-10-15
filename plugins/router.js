export default ({ app, store }) => {
    app.router.beforeEach((to, from, next) => {
        if(to.name&&to.name.match(/blog/)) {
            store.dispatch('app/toggleLoading', 1)
            setTimeout(function() {
                next()
            }, 500)
            next()
        } else {
            next()
        }
    })
}