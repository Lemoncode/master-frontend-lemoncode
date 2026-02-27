import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      children: [
        {
          path: 'list/:id',
          name: 'list',
          component: () => import('@/components/ListModal.vue'),
          props: true,
        },
      ],
    },
  ],
})

export default router
