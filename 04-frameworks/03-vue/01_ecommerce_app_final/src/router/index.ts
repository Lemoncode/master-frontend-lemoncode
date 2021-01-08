import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const Detail = () => import('../views/Detail.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
    name: 'Home',
  },
  {
    path: '/detail/:id',
    component: () => import('../views/Detail.vue'),
    name: 'Detail',
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
