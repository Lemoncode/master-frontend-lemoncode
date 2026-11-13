import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      children: [
        {
          path: '/lists/:listId',
          name: 'Dialog',
          component: () => import('@/views/ListDialog.vue'),
          props: true,
        },
      ],
    },
  ],
})

export default router
