import { createRouter, createWebHistory } from 'vue-router'
import Reply from '../views/Reply.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/reply',
      name: 'reply',
      component: Reply,
    },
  ],
})

export default router
