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

const Evaluation = () => import('@/views/pages/Evaluation')
const StudentAdmission = () => import('@/views/pages/StudentAdmission')
const StudentAssessmentFee = () => import('@/views/pages/StudentAssessmentFee')
const RateSheet = () => import('@/views/pages/RateSheet')
const Curriculum = () => import('@/views/pages/Curriculum')
const Subject = () => import('@/views/pages/Subject')
const Course = () => import('@/views/pages/Course')
const SchoolFee = () => import('@/views/pages/SchoolFee')
const UserGroup = () => import('@/views/pages/UserGroup')
const User = () => import('@/views/pages/User')
const Department = () => import('@/views/pages/Department')
const Payment = () => import('@/views/pages/Payment')
const Section = () => import('@/views/pages/Section')
const Student = () => import('@/views/pages/Student')
const SchoolFeeCategory = () => import('@/views/pages/SchoolFeeCategory')
const Schedule = () => import('@/views/pages/Schedule')
const Semester = () => import('@/views/pages/Semester')
const SchoolYear = () => import('@/views/pages/SchoolYear')
const SchoolCategory = () => import('@/views/pages/SchoolCategory')

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
          path: 'evaluation',
          name: 'Evaluation & Admission',
          component: Evaluation,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'studentadmission',
          name: 'Student Subject Enlistment',
          component: StudentAdmission,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'studentassessmentfee',
          name: 'Student Assessment Fee',
          component: StudentAssessmentFee,
          meta: { requiresAuth: true, userType: 2 }
        },
        {
          path: 'payment',
          name: 'Payment',
          component: Payment,
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
          path: 'schedule',
          name: 'Scheduling',
          component: Schedule,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'section',
          name: 'Section',
          component: Section,
          meta: { requiresAuth: true }
        },
        {
          path: 'department',
          name: 'Department',
          component: Department,
          meta: { requiresAuth: true }
        },
        {
          path: 'subject',
          name: 'Subject',
          component: Subject,
          meta: { requiresAuth: true }
        },
        {
          path: 'course',
          name: 'Course',
          component: Course,
          meta: { requiresAuth: true, userType: 1 }
        },
        {
          path: 'schoolfeecategory',
          name: 'School Fee Category',
          component: SchoolFeeCategory,
          meta: { requiresAuth: true, userType: 2 }
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
        },
        {
          path: 'student',
          name: 'Student',
          component: Student,
          meta: { requiresAuth: true, userType: 0 }
        },
        {
          path: 'schoolcategory',
          name: 'School Category',
          component: SchoolCategory,
          meta: { requiresAuth: true, userType: 0 }
<<<<<<< HEAD
=======
        },
        {
          path: 'semester',
          name: 'Semester',
          component: Semester,
          meta: { requiresAuth: true, userType: 0 }
        },
        {
          path: 'schoolyear',
          name: 'School Year',
          component: SchoolYear,
          meta: { requiresAuth: true, userType: 0 }
>>>>>>> origin/school-year-and-semester
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
