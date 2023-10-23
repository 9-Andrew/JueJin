import { createRouter, createWebHistory,createWebHashHistory  } from 'vue-router'
import useUserStore from '@/store/user'

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
  // history: createWebHashHistory (import.meta.env.BASE_URL),
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
        },
        {
          path: 'setting',
          component: () => import('@/views/setting/index.vue')
        },
        {
          path: '404',
          component: () => import('@/views/404/index.vue')
        }
      ]
    },
    {
      path: '/editor/:id?',
      component: () => import('@/views/editor/index.vue'),
      meta: { title: '写文章' }
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    }
  ]
})

router.beforeEach((to, _from, next) => {
  let store = useUserStore()
  if (localStorage.getItem('Token')) {
    if (store.userInfo.id) {
      next()
    } else {
      store.initUserInfo()
      next()
    }
  } else {
    let restrictRoutes = ['/editor', '/setting']
    if (restrictRoutes.some(item => to.path.indexOf(item) == 0)) {
      next({ path: '/' })
    } else {
      next()
    }
  }
})

router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + import.meta.env.VITE_APP_TITLE
  } else {
    document.title = import.meta.env.VITE_APP_TITLE
  }
  to.query.token && localStorage.setItem('Token', to.query.token)
})

export default router
