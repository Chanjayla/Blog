import Vue from 'vue'
import VueRouter from 'vue-router'
import 'vue-class-component/hooks'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    redirect: '/home',
    children: [{
        path: 'article/:id',
        name: 'Article',
        component: () => import('@/views/Article.vue')
    }]
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
