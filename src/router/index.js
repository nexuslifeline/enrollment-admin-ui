import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { UserGroups } from '../helpers/enum'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')
const Setting = () => import('@/views/pages/settings/Setting')
const OrganizationSetting = () => import('@/views/pages/settings/OrganizationSetting')
const GeneralSetting = () => import('@/views/pages/settings/GeneralSetting')
const TermsSetting = () => import('@/views/pages/settings/TermsSetting')


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
const StudentList = () => import('@/views/pages/student/StudentList')
const StudentEntry = () => import('@/views/pages/student/StudentEntry')
const SchoolFeeCategory = () => import('@/views/pages/SchoolFeeCategory')
const Schedule = () => import('@/views/pages/Schedule')
const Semester = () => import('@/views/pages/Semester')
const SchoolYear = () => import('@/views/pages/SchoolYear')
const SchoolCategory = () => import('@/views/pages/SchoolCategory')
const DemoPage = () => import('@/views/pages/DemoPage')
const SchoolRecords = () => import('@/views/pages/school-records/SchoolRecords')
const SchoolRecordEvaluation = () => import('@/views/pages/school-records/Evaluation')
const SchoolRecordEvaluationEntry = () => import('@/views/pages/school-records/EvaluationEntry')
const SchoolRecordEnrollments = () => import('@/views/pages/school-records/Enrollments')
const SchoolRecordEnrollmentEntry = () => import('@/views/pages/school-records/EnrollmentEntry')
const SchoolRecordRequirements = () => import('@/views/pages/school-records/Requirements')
const SchoolRecordRequirementEntry = () => import('@/views/pages/school-records/RequirementEntry')
const UserGroupPermissions = () => import('@/views/pages/user-group-permissions/UserGroupPermissions')
const Permissions = () => import('@/views/pages/user-group-permissions/Permissions')
const SchoolCategories = () => import('@/views/pages/user-group-permissions/SchoolCategories')
const BankAccount = () => import('@/views/pages/BankAccount')
const PeraPadalaAccount = () => import('@/views/pages/PeraPadalaAccount')
const EWalletAccount = () => import('@/views/pages/EWalletAccount')
const Soa = () => import('@/views/pages/Soa');
const OtherBilling = () => import('@/views/pages/OtherBilling');
const PaymentList = () => import('@/views/pages/payment/PaymentList')
const PaymentEntry = () => import('@/views/pages/payment/PaymentEntry')

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

  // // check current user type, super user = 0, registrar = 1, finance = 2
  // if (to.matched.some(route => route.meta.userType)) {
  //   const userGroupId = localStorage.getItem('userGroupId')
  //   const userGroup = UserGroups.getEnum(Number(userGroupId))
  //   if (to.meta.userType !== userGroup.userType && userGroup.userType !== 0) {
  //     next({ name: from.name })
  //     return
  //   }
  // }

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
      redirect: { name: 'Dashboard' },
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
            {
              path: 'soa',
              name: 'Soa',
              component: Soa,
              meta: { requiresAuth: true, userType: 2 }
            },
            {
              path: 'other-billing',
              name: 'Other Billing',
              component: OtherBilling,
              meta: { requiresAuth: true, userType: 2 }
            },
            {
              path: 'payment',
              component: { render(c) { return c('router-view') } },
              meta: { requiresAuth: true, userType: 2 },
              children: [
                {
                  path: '/',
                  name: 'PaymentList',
                  component: PaymentList,
                  meta: { requiresAuth: true, userType: 0 }
                },
                {
                  path: 'add',
                  name: 'Payment Add',
                  component: PaymentEntry,
                  meta: { requiresAuth: true, userType: 0 }
                },
              ]
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
              path: 'bank-account',
              name: 'Bank Account',
              component: BankAccount,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'pera-padala-account',
              name: 'Pera Padala Account',
              component: PeraPadalaAccount,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'e-wallet-account',
              name: 'E Wallet Account',
              component: EWalletAccount,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'user-group',
              // name: 'User Group',
              component: { render(c) { return c('router-view') } },
              children: [
                {
                  path: '/',
                  name: 'User Group List',
                  component: UserGroup,
                  meta: { requiresAuth: true, userType: 0 }
                },
                {
                  path: ':userGroupId/',
                  component: UserGroupPermissions,
                  children: [
                    {
                      path: '/',
                      redirect: 'permissions',
                    },
                    {
                      path: 'permissions',
                      name: 'Permissions',
                      component: Permissions,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'school-categories',
                      name: 'SchoolCategories',
                      component: SchoolCategories,
                      meta: { requiresAuth: true }
                    },
                  ]
                }
              ]
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
              component: { render(c) { return c('router-view') } },
              children: [
                {
                  path: '/',
                  name: 'Student List',
                  component: StudentList,
                  meta: { requiresAuth: true, userType: 0 }
                },
                {
                  path: 'add',
                  name: 'Student Add',
                  component: StudentEntry,
                  meta: { requiresAuth: true, userType: 0 }
                },
                {
                  path: ':studentId',
                  name: 'Student Edit',
                  component: StudentEntry,
                  meta: { requiresAuth: true, userType: 0 }
                },
                {
                  path: ':studentId/school-records',
                  component: SchoolRecords,
                  children: [
                    {
                      path: '/',
                      redirect: 'evaluations',
                    },
                    {
                      path: 'evaluations',
                      name: 'Evaluations',
                      component: SchoolRecordEvaluation,
                      meta: { requiresAuth: true },
                    },
                    {
                      path: 'evaluations/:evaluationId',
                      name: 'Evaluation Entry',
                      component: SchoolRecordEvaluationEntry,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'enrollments',
                      name: 'Enrollments',
                      component: SchoolRecordEnrollments,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'enrollments/:academicRecordId',
                      name: 'Enrollment Entry',
                      component: SchoolRecordEnrollmentEntry,
                      meta: { requiresAuth: true }
                    },
                    // {
                    //   path: 'assessment',
                    //   name: 'Assessment',
                    //   component: SchoolRecordAssessment,
                    //   meta: { requiresAuth: true }
                    // },
                    {
                      path: 'requirements',
                      name: 'Requirements',
                      component: SchoolRecordRequirements,
                      meta: { requiresAuth: true }
                    },
                    {
                      path: 'requirements/:evaluationId',
                      name: 'Requirement Entry',
                      component: SchoolRecordRequirementEntry,
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
          redirect: { name: 'MyProfile' },
          meta: { requiresAuth: true },
          children: [
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
            {
              path: 'settings',
              name: 'Settings',
              component: Setting,
              redirect: { name: 'GeneralSetting' },
              children: [
                {
                  path: 'general-setting',
                  name: 'GeneralSetting',
                  component: GeneralSetting,
                  meta: { requiresAuth: true }
                },
                {
                  path: 'organization-setting',
                  name: 'OrganizationSetting',
                  component: OrganizationSetting,
                  meta: { requiresAuth: true }
                },
                {
                  path: 'terms-setting',
                  name: 'TermsSetting',
                  component: TermsSetting,
                  meta: { requiresAuth: true }
                },
              ]
            }
          ]
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
