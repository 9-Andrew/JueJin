import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/forum',
      children: [
        {
          path: '',
          alias: '/forum',
          component: () => import('@/views/forum/index.vue')
        },
        {
          path: 'forum/:type',
          component: () => import('@/views/forum/index.vue')
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
