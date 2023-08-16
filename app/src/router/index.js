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
          component: () => import('@/views/forum/index.vue'),
          meta: { hiddenGoTop: true }
        },
        {
          path: 'forum/:type',
          component: () => import('@/views/forum/index.vue')
        },
        {
          path: 'detail/:id',
          component: () => import('@/views/detail/index.vue')
        },
        {
          path: 'tag/:id',
          component: () => import('@/views/TagArticle/index.vue')
        },
        {
          path: 'search',
          component: () => import('@/views/search/index.vue')
        },
        {
          path: 'user/:id',
          component: () => import('@/views/user/index.vue')
        }
      ]
    },
    { path: '/editor', component: () => import('@/views/editor/index.vue') },
    {
      path: '/404',
      component: () => import('@/views/404/index.vue')
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
})

export default router
