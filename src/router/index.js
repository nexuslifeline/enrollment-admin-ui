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
const MyProfile = () => import('@/views/pages/MyProfile')
const MyActivity = () => import('@/views/pages/MyActivity')
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
const DemoPage = () => import('@/views/pages/DemoPage')
const AcademicRecords = () => import('@/views/pages/academic-records/AcademicRecords')
const AcademicRecordEvaluation = () => import('@/views/pages/academic-records/Evaluation')
const AcademicRecordSubjects = () => import('@/views/pages/academic-records/Subjects')
const AcademicRecordAssessment = () => import('@/views/pages/academic-records/Assessment')
const AcademicRecordRequirements = () => import('@/views/pages/academic-records/Requirements')

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
          path: 'approval',
          name: 'Approval',
          redirect: { name: 'Evaluation' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'evaluation',
              name: 'Evaluation',
              component: Evaluation,
              meta: { requiresAuth: true, userType: 1 }
            },
            {
              path: 'student-subject-enlisment',
              name: 'Student Subject Enlistment',
              component: StudentAdmission,
              meta: { requiresAuth: true, userType: 1 }
            },
            {
              path: 'student-assessment-fee',
              name: 'Student Assessment Fee',
              component: StudentAssessmentFee,
              meta: { requiresAuth: true, userType: 2 }
            },
            {
              path: 'payment',
              name: 'Payment',
              component: Payment,
              meta: { requiresAuth: true, userType: 2 }
            }
          ]
        },
        {
          path: 'registrar',
          name: 'Registrar',
          redirect: { name: 'Curriculum' },
          component: { render(c) { return c('router-view') } },
          children: [
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
            }
          ]
        },
        {
          path: 'finance',
          name: 'Finance',
          redirect: { name: 'Rate Sheet' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'rate-sheet',
              name: 'Rate Sheet',
              component: RateSheet,
              meta: { requiresAuth: true, userType: 2 }
            },
            {
              path: 'school-fee-category',
              name: 'School Fee Category',
              component: SchoolFeeCategory,
              meta: { requiresAuth: true, userType: 2 }
            },
            {
              path: 'school-fee',
              name: 'School Fee',
              component: SchoolFee,
              meta: { requiresAuth: true, userType: 2 }
            },
          ]
        },
        {
          path: 'maintenance',
          name: 'Maintenance',
          redirect: { name: 'Department' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'department',
              name: 'Department',
              component: Department,
              meta: { requiresAuth: true }
            },
            {
              path: 'school-category',
              name: 'School Category',
              component: SchoolCategory,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'semester',
              name: 'Semester',
              component: Semester,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'school-year',
              name: 'School Year',
              component: SchoolYear,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'user-group',
              name: 'User Group',
              component: UserGroup,
              meta: { requiresAuth: true, userType: 0 }
            }
          ]
        },
        {
          path: 'master-files',
          name: 'Masterfiles',
          redirect: { name: 'Student List' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'user',
              name: 'User',
              component: User,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'student',
              name: 'Student',
              component: { render(c) { return c('router-view') } },
              children: [
                {
                  path: '/',
                  name: 'Student List',
                  component: Student,
                  meta: { requiresAuth: true, userType: 0 }
                },
                {
                  path: ':studentId/academic-records',
                  component: AcademicRecords,
                  children: [
                    {
                      path: '/',
                      redirect: 'evaluations',
                    },
                    {
                      path: 'evaluations',
                      name: 'Evaluations',
                      component: AcademicRecordEvaluation,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'subjects',
                      name: 'Subjects',
                      component: AcademicRecordSubjects,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'assessment',
                      name: 'Assessment',
                      component: AcademicRecordAssessment,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'requirements',
                      name: 'Requirements',
                      component: AcademicRecordRequirements,
                      meta: { requiresAuth: true }
                    },
                  ]
                }
                // add academic records route here
              ]
            }
          ]
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'profile',
          name: 'MyProfile',
          component: MyProfile,
          meta: { requiresAuth: true }
        },
        {
          path: 'activity',
          name: 'MyActivity',
          component: MyActivity,
          meta: { requiresAuth: true }
        },
        // {
        //   path: 'evaluation',
        //   name: 'Evaluation & Admission',
        //   component: Evaluation,
        //   meta: { requiresAuth: true, userType: 1 }
        // },
        // {
        //   path: 'student-subject-enlisment',
        //   name: 'Student Subject Enlistment',
        //   component: StudentAdmission,
        //   meta: { requiresAuth: true, userType: 1 }
        // },
        // {
        //   path: 'student-assessment-fee',
        //   name: 'Student Assessment Fee',
        //   component: StudentAssessmentFee,
        //   meta: { requiresAuth: true, userType: 2 }
        // },
        // {
        //   path: 'payment',
        //   name: 'Payment',
        //   component: Payment,
        //   meta: { requiresAuth: true, userType: 2 }
        // },
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
      path: '/demo',
      name: 'Login',
      component: DemoPage
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    },
  ]
}
