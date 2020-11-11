export default function ({ store, redirect, route }) {
    if (!store.state.user.token) {
        store.commit('app/TOGGLE_LOADING', 0)
        return redirect('/blog/login?p=' + route.fullPath)
    }
}