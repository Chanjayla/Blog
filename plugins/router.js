export default ({ app, store }) => {
    app.router.beforeEach((to, from, next) => {
        if(to.name&&to.name.match(/blog/)&&to.name != from.name) {
            store.dispatch('app/toggleLoading', 1)
            setTimeout(function() {
                next()
            }, 500)
        } else {
            next()
        }
    })
}