import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import AdminOpinions from '../views/AdminOpinions.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Reply from '../views/Reply.vue'
import OpinionDetail from '../views/OpinionDetail.vue'

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
      path: '/reply/:id',
      name: 'reply',
      component: Reply,
      meta: { requiresAuth: true },
    },
    {
      path: '/opinion-detail/:id',
      name: 'opinion-detail',
      component: OpinionDetail,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin-user-store')
  const hasToken = token && JSON.parse(token).token

  if (to.meta.requiresAuth && !hasToken) {
    next('/login')
  } else {
    next()
  }
})

export default router

