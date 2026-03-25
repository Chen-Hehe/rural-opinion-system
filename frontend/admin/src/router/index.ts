import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import AdminOpinions from '../views/AdminOpinions.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Reply from '../views/Reply.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
    },
    {
      path: '/admin-opinions',
      name: 'admin-opinions',
      component: AdminOpinions,
    },
    {
      path: '/reply',
      name: 'reply',
      component: Reply,
    },
  ],
})

export default router

