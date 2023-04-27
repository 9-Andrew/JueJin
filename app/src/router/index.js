import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '',
          alias: '/home',
          component: () => import('@/views/home/index.vue')
        },
        {
          path: 'home/:type',
          component: () => import('@/views/home/index.vue')
        }
      ]
    },
    {
      path: '/404',
      component: () => import('@/views/404.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
})

export default router
