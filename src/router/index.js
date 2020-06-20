import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { UserGroups } from '../helpers/enum'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')

const Student = () => import('@/views/pages/Student')
const StudentFee = () => import('@/views/pages/StudentFee')
const RateSheet = () => import('@/views/pages/RateSheet')
const Curriculum = () => import('@/views/pages/Curriculum')
const Subject = () => import('@/views/pages/Subject')
const Course = () => import('@/views/pages/Course')
const SchoolFee = () => import('@/views/pages/SchoolFee')
const UserGroup = () => import('@/views/pages/UserGroup')
const User = () => import('@/views/pages/User')

Vue.use(Router)

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})
export default router
router.beforeEach((to, from, next) => {

  // check if the route requires authentication and user is not logged in
  if (to.matched.some(route => route.meta.requiresAuth) && !store.state.isLoggedIn) {
    // redirect to login page
    next({ name: 'Login' })
    return
  }

  // check current user type, super user = 0, registrar = 1, finance = 2
  if (to.matched.some(route => route.meta.userType)) {
    const userGroupId = localStorage.getItem('userGroupId')
    const userGroup = UserGroups.getEnum(Number(userGroupId))
    if (to.meta.userType !== userGroup.userType && userGroup.userType !== 0) {
      next({ name: from.name })
      return
    }
  }

// if logged in redirect to prev route
  if(to.path === '/login' && store.state.isLoggedIn) {
      next({name: from.name})
      return
  }
  
next()
})

function configRoutes () {
  return [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'Home',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'student',
          name: 'Student',
          component: Student,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'studentfee',
          name: 'Student Fee',
          component: StudentFee,
          meta: { requiresAuth: true, userType: 2 }
        },
        {
          path: 'ratesheet',
          name: 'Rate Sheet',
          component: RateSheet,
          meta: { requiresAuth: true, userType: 2 }
        },
        {
          path: 'curriculum',
          name: 'Curriculum',
          component: Curriculum,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'subject',
          name: 'Subject',
          component: Subject,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'course',
          name: 'Course',
          component: Course,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'schoolfee',
          name: 'School Fee',
          component: SchoolFee,
          meta: { requiresAuth: true, userType: 2 }
        },
        {
          path: 'user',
          name: 'User',
          component: User,
          meta: { requiresAuth: true, userType: 0 }
        },
        {
          path: 'usergroup',
          name: 'User Group',
          component: UserGroup,
          meta: { requiresAuth: true, userType: 0 }
        }
      ]
    },
    {
      path: '/500',
      name: 'Page500',
      component: Page500
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    },
  ]
}