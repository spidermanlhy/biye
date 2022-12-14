import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import { Message } from 'element-ui';
import index from '@/page/index'
import login from '@/page/login'
import register from '@/page/register'
import record from '@/page/user/donationrecord'
import home from '@/page/user/home'
import personhelp from '@/page/user/personhelp'
import applydetail from '@/page/user/applydetail'
import publicdetail from '@/page/user/publicdetail'
import persondonate from '@/page/user/persondonate'
import qualificate from '@/page/user/qualificate'
import publicproject from '@/page/user/publicproject'
import personfinished from '@/page/user/personfinished'
import publicfinished from '@/page/user/publicfinished'

import admin from '@/page/admin/admin'
import adminlist from '@/page/admin/adminlist'
import bulletin from '@/page/admin/bulletin'
import donatecount from '@/page/admin/donatecount'
import donatelist from '@/page/admin/donatelist'
import personunverified from '@/page/admin/personunverified'
import personverified from '@/page/admin/personverified'
import publicunverified from '@/page/admin/publicunverified'
import adminperson from '@/page/admin/adminperson'
import adminpublic from '@/page/admin/adminpublic'
import publicverified from '@/page/admin/publicverified'
import userlist from '@/page/admin/userlist'
import mychild  from "@/page/user/mychild";
import { getCookie } from '../utils/util'
import myapply from "../page/user/myapply";
import news from "../page/user/news";
import space from "../page/user/space";
import childapplyunverified from "../page/admin/childapplyunverified";
import childapplyverified from "../page/admin/childapplyverified";
import spacemanager from "../page/admin/spacemanager";

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/home',
      component: login,
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      hidden: true,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/index',
      name: '',
      component: index,
      children: [{
        path: '/home',
        name: '??????',
        component: home,
        meta: {
          requireAuth: false
        }
      },
        {
          path: '/record',
          name: '????????????',
          component: record,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/applydetail',
          name: '????????????',
          component: applydetail,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/space',
          name: '????????????',
          component: space,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/publicdetail',
          name: '????????????',
          component: publicdetail,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/personhelp',
          name: '????????????',
          component: personhelp,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/publicproject',
          name: '????????????',
          component: publicproject,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/persondonate',
          name: '????????????',
          component: persondonate,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/qualificate',
          name: '????????????',
          component: qualificate,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/personfinished',
          name: '??????????????????',
          component: personfinished,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/publicfinished',
          name: '??????????????????',
          component: publicfinished,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/mychild',
          name: '????????????',
          component: mychild,
          meta: {
            requireAuth: false
          }
        },{
          path: '/news',
          name: '????????????',
          component: news,
          meta: {
            requireAuth: false
          }
        },
        {
          path: '/myapply',
          name: '????????????',
          component: myapply,
          meta: {
            requireAuth: false
          }
        }
        ]
    },
    {
      path: '/admin',
      name: '????????????',
      component: admin,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/adminperson',
      name: '????????????????????????',
      component: adminperson,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/adminpublic',
      name: '????????????????????????',
      component: adminpublic,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/manage',
      name: 'manage',
      component: admin,
      children: [{
        path: 'user/userlist',
        component: userlist
      }, {
        path: 'user/adminlist',
        component: adminlist
      }, {
        path: 'public/verified',
        component: publicverified
      }, {
        path: 'public/unverfied',
        component: publicunverified
      }, {
        path: 'child/verified',
        component: childapplyverified
      }, {
        path: 'space/manager',
        component: spacemanager
      }, {
        path: 'child/unverfied',
        component: childapplyunverified
      }, {
        path: 'person/verified',
        component: personverified
      }, {
        path: 'person/unverfied',
        component: personunverified
      }, {
        path: 'donate/list',
        component: donatelist
      }, {
        path: 'donate/count',
        component: donatecount
      },{
        path: 'manage/bulletin',
        component: bulletin
      }]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/forhelp') {
    if (store.state.user){
      let flag = store.state.user.passed
      flag === 1 ? next() : Message.warning('?????????????????????')
    }else {
      router.push({path: '/login'})
    }
  } else if (to.meta.requireAuth || to.path.indexOf("manage") != -1) {
    let flag = getCookie('token')
    flag ? next() : router.push({path: '/login'})
  } else {
    next()
  }
})

export default router
