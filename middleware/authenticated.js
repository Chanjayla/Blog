export default function ({ store, redirect, error}) {
    if (!store.state.user.token) {
      return redirect('/admin/login')
    }
  }
  