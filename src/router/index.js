import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import { UserGroups } from '../helpers/enum'

// Containers
const TheContainer = () => import('@/containers/TheContainer')

// Views
const SmartChain = () => import('@/views/pages/SmartChain')
const Dashboard = () => import('@/views/Dashboard')
const Setting = () => import('@/views/pages/settings/Setting')
const OrganizationSetting = () => import('@/views/pages/settings/OrganizationSetting')
const GeneralSetting = () => import('@/views/pages/settings/GeneralSetting')
const TermsSetting = () => import('@/views/pages/settings/TermsSetting')
const GradingPeriodSetting = () => import('@/views/pages/settings/GradingPeriodSetting')
const RequirementsSetting = () => import('@/views/pages/settings/RequirementsSetting')


// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const Home = () => import('@/views/pages/Home')
const Profile = () => import('@/views/pages/profile/Profile')
const EditProfile = () => import('@/views/pages/profile/EditProfile')
const ChangeProfileUsername = () => import('@/views/pages/profile/ChangeUsername')
const UpdateProfilePassword = () => import('@/views/pages/profile/UpdatePassword')
const MyActivity = () => import('@/views/pages/MyActivity')
const Evaluation = () => import('@/views/pages/evaluation/List')
const EvaluationDetail = () => import('@/views/pages/evaluation/Detail')
const Enlistment = () => import('@/views/pages/enlistment/List')
const Assessment = () => import('@/views/pages/assessment/List')
const RateSheet = () => import('@/views/pages/RateSheet')
const Curriculum = () => import('@/views/pages/Curriculum')
const Subject = () => import('@/views/pages/Subject')
const Course = () => import('@/views/pages/Course')
const SchoolFee = () => import('@/views/pages/SchoolFee')
const UserGroup = () => import('@/views/pages/UserGroup')
const Member = () => import('@/views/pages/member/Member')
const MemberForm = () => import('@/views/pages/member/MemberForm')
const CreateMemberAccount = () => import('@/views/components/Member/CreateAccount')
const Department = () => import('@/views/pages/Department')
const Payment = () => import('@/views/pages/Payment')
const Section = () => import('@/views/pages/Section')
const StudentList = () => import('@/views/pages/student/StudentList')
const StudentForm = () => import('@/views/pages/student/StudentForm')
const CreateStudentAccount = () => import('@/views/components/Student/CreateAccount')
const ChangePassword = () => import('@/views/components/AccountsModal/ChangePassword')
const ChangeUsername = () => import('@/views/components/AccountsModal/ChangeUsername')
const SchoolFeeCategory = () => import('@/views/pages/SchoolFeeCategory')
const Schedule = () => import('@/views/pages/Schedule')
const Semester = () => import('@/views/pages/Semester')
const SchoolYear = () => import('@/views/pages/school-year/SchoolYear')
const SchoolCategory = () => import('@/views/pages/SchoolCategory')
const DemoPage = () => import('@/views/pages/DemoPage')
const DemoPage2 = () => import('@/views/pages/DemoPage2')
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
const GenerateStatement = () => import('@/views/pages/soa/GenerateStatement');
const GenerateBatch = () => import('@/views/pages/soa/GenerateBatch');
const GenerateBilling = () => import('@/views/pages/other-billing/GenerateBilling');
const GenerateBatchBilling = () => import('@/views/pages/other-billing/GenerateBatchBilling');
const OtherBilling = () => import('@/views/pages/OtherBilling');
const PaymentList = () => import('@/views/pages/payment/PaymentList')
const PaymentEntry = () => import('@/views/pages/payment/PaymentEntry')
const AcademicRecordApplicationList = () => import('@/views/pages/quick-enroll/List')
const AcademicRecordEntry= () => import('@/views/pages/quick-enroll/Entry')
const DocumentType = () => import('@/views/pages/DocumentType');

const Collection = () => import('@/views/pages/reports/Collection')
const StudentLedger = () => import('@/views/pages/reports/StudentLedger')
const TranscriptRecord = () => import('@/views/pages/TranscriptRecord')
const ReviewTranscriptRecord = () => import('@/views/pages/ReviewTranscriptRecord')
const EnrolledStudentList = () => import('@/views/pages/reports/EnrolledStudentList')

const StudentGrade = () => import('@/views/pages/StudentGrade')
const StudentGradeApproval = () => import('@/views/pages/StudentGradeApproval')
const Clearance = () => import('@/views/pages/Clearance')
const ClearanceClearing = () => import('@/views/pages/ClearanceClearing')
const DroppedStudent = () => import('@/views/pages/DroppedStudent')

const SetupSchoolYear = () => import('@/views/pages/sy-setup/Setup')
const GradeSymbol = () => import('@/views/pages/grade-symbol/List')

const NewPayment = () => import('@/views/pages/new-payment/Payment')
const PaymentDetail = () => import('@/views/pages/new-payment/Detail')

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
      redirect: { name: 'Home' },
      name: 'Dashboard',
      component: TheContainer,
      children: [
        {
          path: 'enrollment',
          name: 'Enrollment',
          redirect: { name: 'Evaluation' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'evaluation',
              name: 'Evaluation',
              component: Evaluation,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Enrollment',
                    path: '/enrollment'
                  },
                  {
                    text: 'Evaluations',
                    path: '/enrollment/evaluation'
                  }
                ]
              },
              children: [
                {
                  path: ':evaluationId/detail',
                  name: 'Evaluation Detail',
                  component: EvaluationDetail,
                  meta: {
                    crumb: [
                      {
                        text: 'Home',
                        path: '/'
                      },
                      {
                        text: 'Enrollment',
                        path: '/enrollment'
                      },
                      {
                        text: 'Evaluation',
                        path: '/enrollment/evaluation'
                      },
                      {
                        text: 'Detail',
                        path: '/enrollment/evaluation/:evaluationId/detail'
                      }
                    ]
                  }
                }
              ]
            },
            {
              path: 'student-subject-enlisment',
              name: 'Student Subject Enlistment',
              component: Enlistment,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Enrollment',
                    path: '/enrollment'
                  },
                  {
                    text: 'Enlistments',
                    path: '/enrollment/student-subject-enlisment'
                  }
                ]
              }
            },
            {
              path: 'student-assessment-fee',
              name: 'Student Assessment Fee',
              component: Assessment,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Enrollment',
                    path: '/enrollment'
                  },
                  {
                    text: 'Assesments',
                    path: '/enrollment/student-assessment-fee'
                  }
                ]
              }
            },
            {
              path: 'payment',
              name: 'Payment',
              component: Payment,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Enrollment',
                    path: '/enrollment'
                  },
                  {
                    text: 'Payments',
                    path: '/enrollment/payment'
                  }
                ]
              }
            },
            {
              path: 'new-payment',
              name: 'NewPayment',
              component: NewPayment,
              meta: { requiresAuth: true },
              children: [
                {
                  path: ':paymentId/detail',
                  name: 'Payment Detail',
                  component: PaymentDetail
                }
              ]
            },
            {
              path: 'academic-record-applications',
              name: 'Academic Record Applications',
              component: AcademicRecordApplicationList,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Enrollment',
                    path: '/enrollment'
                  },
                  {
                    text: 'Manual Entry',
                    path: '/enrollment/academic-record-applications'
                  }
                ]
              },
              children: [
                {
                  path: ':academicRecordId',
                  name: 'Academic Record Applications Detail',
                  component: AcademicRecordEntry,
                  meta: { requiresAuth: true },
                  children: [
                    {
                      path: 'student/:studentId/account/create',
                      name: 'Academic Record Add Account',
                      component: CreateStudentAccount,
                      meta: { requiresAuth: true },
                    },
                    {
                      path: 'student/:studentId/account/change-username',
                      name: 'Academic Record Change Username',
                      component: ChangeUsername,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'student/:studentId/account/change-password',
                      name: 'Academic Record Change Password',
                      component: ChangePassword,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                  ]
                }
              ]
            },
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
              meta: {
                requiresAuth: true,
                userType: 1,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Registrar',
                    path: '/registrar'
                  },
                  {
                    text: 'Curriculums',
                    path: '/registrar/curriculum'
                  }
                ]
              }
            },
            {
              path: 'schedule',
              name: 'Scheduling',
              component: Schedule,
              meta: {
                requiresAuth: true,
                userType: 1,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Registrar',
                    path: '/registrar'
                  },
                  {
                    text: 'Scheduling',
                    path: '/registrar/schedule'
                  }
                ]
              }
            },
            {
              path: 'section',
              name: 'Section',
              component: Section,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Registrar',
                    path: '/registrar'
                  },
                  {
                    text: 'Section & Schedule',
                    path: '/registrar/section'
                  }
                ]
              }
            },
            {
              path: 'subject',
              name: 'Subject',
              component: Subject,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Registrar',
                    path: '/registrar'
                  },
                  {
                    text: 'Subjects',
                    path: '/registrar/subject'
                  }
                ]
              }
            },
            {
              path: 'course',
              name: 'Course',
              component: Course,
              meta: {
                requiresAuth: true,
                userType: 1,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Registrar',
                    path: '/registrar'
                  },
                  {
                    text: 'Courses',
                    path: '/registrar/course'
                  }
                ]
              }
            },
            {
              path: 'academic-transcript',
              name: 'Academic Transript',
              component: TranscriptRecord,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Registrar',
                    path: '/registrar'
                  },
                  {
                    text: 'Academic Transripts',
                    path: '/registrar/academic-transcript'
                  }
                ]
              }
            },
            {
              path: 'academic-transcript/:transcriptRecordId',
              name: 'Review Academic Transript',
              component: ReviewTranscriptRecord,
              meta: { requiresAuth: true }
            },
            {
              path: 'student-grade',
              name: 'Student Grades',
              component: StudentGradeApproval,
              meta: { requiresAuth: true }
            },
          ]
        },
        {
          path: 'finance',
          name: 'Finance',
          redirect: { name: 'Soa' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'rate-sheet',
              name: 'Rate Sheet',
              component: RateSheet,
              meta: {
                requiresAuth: true,
                userType: 2,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Finance',
                    path: '/finance'
                  },
                  {
                    text: 'Rate Sheets',
                    path: '/finance/rate-sheet'
                  }
                ]
              }
            },
            {
              path: 'soa',
              name: 'Soa',
              component: Soa,
              meta: {
                requiresAuth: true,
                userType: 2,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Finance',
                    path: '/finance'
                  },
                  {
                    text: 'Statement of Accounts',
                    path: '/finance/soa'
                  }
                ]
              }
            },
            {
              path: 'soa/generate',
              name: 'Individual SOA',
              component: GenerateStatement,
              meta: { requiresAuth: true, userType: 2, hideSubNav: true }
            },
            {
              path: 'soa/generate-batch',
              name: 'Batch SOA',
              component: GenerateBatch,
              meta: { requiresAuth: true, userType: 2, hideSubNav: true }
            },
            {
              path: 'other-billing',
              name: 'Other Billing',
              component: OtherBilling,
              meta: {
                requiresAuth: true,
                userType: 2,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Finance',
                    path: '/finance'
                  },
                  {
                    text: 'Other Billings',
                    path: '/finance/other-billing'
                  }
                ]
              }
            },
            {
              path: 'other-billing/generate',
              name: 'Individual Other Billing',
              component: GenerateBilling,
              meta: { requiresAuth: true, userType: 2, hideSubNav: true }
            },
            {
              path: 'other-billing/generate-batch',
              name: 'Batch Other Billing',
              component: GenerateBatchBilling,
              meta: { requiresAuth: true, userType: 2, hideSubNav: true }
            },
            {
              path: 'post-payment',
              component: { render(c) { return c('router-view') } },
              meta: { requiresAuth: true, userType: 2 },
              children: [
                {
                  path: '/',
                  name: 'PaymentList',
                  component: PaymentList,
                  meta: {
                    requiresAuth: true,
                    userType: 0,
                    crumb: [
                      {
                        text: 'Home',
                        path: '/'
                      },
                      {
                        text: 'Finance',
                        path: '/finance'
                      },
                      {
                        text: 'Payments',
                        path: '/finance/post-payment'
                      }
                    ]
                  }
                },
                {
                  path: 'add',
                  name: 'Payment Add',
                  component: PaymentEntry,
                  meta: { requiresAuth: true, userType: 0, hideSubNav: true }
                },
              ]
            },
          ]
        },
        {
          path: 'maintenance',
          name: 'Maintenance',
          redirect: { path: '/maintenance/user-group' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'clearance-signatories',
              name: 'Signatories',
              component: Clearance,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Signatories',
                    path: '/maintenance/clearance-signatories'
                  }
                ]
              }
            },
            {
              path: 'grade-symbol',
              name: 'Grade Symbol',
              component: GradeSymbol,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Grade Symbols',
                    path: '/maintenance/grade-symbol'
                  }
                ]
              }
            },
            {
              path: 'department',
              name: 'Department',
              component: Department,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Departments',
                    path: '/maintenance/department'
                  }
                ]
              }
            },
            {
              path: 'school-category',
              name: 'School Category',
              component: SchoolCategory,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'School Categories',
                    path: '/maintenance/school-category'
                  }
                ]
              }
            },
            {
              path: 'semester',
              name: 'Semester',
              component: Semester,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Semesters',
                    path: '/maintenance/semester'
                  }
                ]
              }
            },
            {
              path: 'school-year',
              component: { render(c) { return c('router-view') } },
              redirect: { name: 'School Year' },
              children: [
                {
                  path: '/',
                  name: 'School Year',
                  component: SchoolYear,
                  meta: {
                    requiresAuth: true,
                    crumb: [
                      {
                        text: 'Home',
                        path: '/'
                      },
                      {
                        text: 'Maintenance',
                        path: '/maintenance'
                      },
                      {
                        text: 'School Years',
                        path: '/maintenance/school-year'
                      }
                    ]
                  }
                },
                {
                  path: ':id/setup',
                  name: 'School Year Setup',
                  component: SetupSchoolYear,
                  meta: { requiresAuth: true, hideHeader: true, hideMainArea: true },
                }
              ]
            },
            {
              path: 'school-fee-category',
              name: 'School Fee Category',
              component: SchoolFeeCategory,
              meta: {
                requiresAuth: true,
                userType: 2,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'School Fee Categories',
                    path: '/maintenance/school-fee-category'
                  }
                ]
              }
            },
            {
              path: 'school-fee',
              name: 'School Fee',
              component: SchoolFee,
              meta: {
                requiresAuth: true,
                userType: 2,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'School Fees',
                    path: '/maintenance/school-fee'
                  }
                ]
              }
            },
            {
              path: 'bank-account',
              name: 'Bank Account',
              component: BankAccount,
              meta: {
                requiresAuth: true,
                userType: 0,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Bank Accounts',
                    path: '/maintenance/bank-account'
                  }
                ]
              }
            },
            {
              path: 'pera-padala-account',
              name: 'Pera Padala Account',
              component: PeraPadalaAccount,
              meta: {
                requiresAuth: true,
                userType: 0,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Pera Padala Accounts',
                    path: '/maintenance/pera-padala-account'
                  }
                ]
              }
            },
            {
              path: 'e-wallet-account',
              name: 'E Wallet Account',
              component: EWalletAccount,
              meta: {
                requiresAuth: true,
                userType: 0,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'E Wallet Accounts',
                    path: '/maintenance/e-wallet-account'
                  }
                ]
              }
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
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'school-categories',
                      name: 'SchoolCategories',
                      component: SchoolCategories,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                  ]
                }
              ]
            },
            {
              path: 'document-type',
              name: 'Document Type',
              component: DocumentType,
              meta: {
                requiresAuth: true,
                userType: 0,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Maintenance',
                    path: '/maintenance'
                  },
                  {
                    text: 'Document Types',
                    path: '/maintenance/document-type'
                  }
                ]
              }
            },
          ]
        },
        {
          path: 'instructor',
          name: 'Instructor',
          redirect: { name: 'Clearance' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'grade-sheet',
              name: 'Grade Sheet',
              component: StudentGrade,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Instructor',
                    path: '/instructor'
                  },
                  {
                    text: 'Grade Sheets',
                    path: '/instructor/grade-sheet'
                  }
                ]
              }
            },
            {
              path: 'clearance',
              name: 'Clearance',
              component: ClearanceClearing,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Instructor',
                    path: '/instructor'
                  },
                  {
                    text: 'Clearances',
                    path: '/instructor/clearance'
                  }
                ]
              }
            },
            {
              path: 'dropped-student',
              name: 'Drop Student',
              component: DroppedStudent,
              meta: {
                requiresAuth: true,
                crumb: [
                  {
                    text: 'Home',
                    path: '/'
                  },
                  {
                    text: 'Instructor',
                    path: '/instructor'
                  },
                  {
                    text: 'Drop Students',
                    path: '/instructor/dropped-student'
                  }
                ]
              }
            },
          ]
        },
        {
          path: 'master-files',
          name: 'Masterfiles',
          redirect: { name: 'Student List' },
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'member',
              name: 'Member',
              component: { render(c) { return c('router-view') } },
              children: [
                {
                  path: '/',
                  name: 'Member List',
                  component: Member,
                  meta: {
                    requiresAuth: true,
                    userType: 0,
                    crumb: [
                      {
                        text: 'Home',
                        path: '/'
                      },
                      {
                        text: 'Master Files',
                        path: '/master-files'
                      },
                      {
                        text: 'Members',
                        path: '/master-files/member'
                      }
                    ]
                  },
                  children: [
                    {
                      path: 'account/:personnelId/change-username',
                      name: 'List Change Member Username',
                      component: ChangeUsername,
                      meta: {
                        requiresAuth: true,
                        crumb: [
                          {
                            text: 'Home',
                            path: '/'
                          },
                          {
                            text: 'Master Files',
                            path: '/master-files'
                          },
                          {
                            text: 'Members',
                            path: '/master-files/member'
                          },
                          {
                            text: 'Change Username',
                            path: '/master-files/member/account/:personnelId/change-username'
                          }
                        ]
                      }
                    },
                    {
                      path: 'account/:personnelId/change-password',
                      name: 'List Change Member Password',
                      component: ChangePassword,
                      meta: {
                        requiresAuth: true,
                        crumb: [
                          {
                            text: 'Home',
                            path: '/'
                          },
                          {
                            text: 'Master Files',
                            path: '/master-files'
                          },
                          {
                            text: 'Members',
                            path: '/master-files/member'
                          },
                          {
                            text: 'Change Password',
                            path: '/master-files/member/account/:personnelId/change-password'
                          }
                        ]
                      }
                    },
                  ]
                },
                {
                  path: ':personnelId',
                  name: 'Member Edit',
                  component: MemberForm,
                  meta: { requiresAuth: true, hideSubNav: true },
                  children: [
                    {
                      path: 'account/create',
                      name: 'Create Member Account',
                      component: CreateMemberAccount,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'account/change-username',
                      name: 'Change Member Username',
                      component: ChangeUsername,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'account/change-password',
                      name: 'Change Member Password',
                      component: ChangePassword,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                  ]
                },
              ]
            },
            {
              path: 'student',
              component: { render(c) { return c('router-view') } },
              children: [
                {
                  path: '/',
                  name: 'Student List',
                  component: StudentList,
                  meta: {
                    requiresAuth: true,
                    userType: 0,
                    crumb: [
                      {
                        text: 'Home',
                        path: '/'
                      },
                      {
                        text: 'Master Files',
                        path: '/master-files'
                      },
                      {
                        text: 'Students',
                        path: '/master-files/student'
                      }
                    ]
                  },
                  children: [
                    {
                      path: 'account/:studentId/change-username',
                      name: 'List Change Student Username',
                      component: ChangeUsername,
                      meta: {
                        requiresAuth: true,
                        crumb: [
                          {
                            text: 'Home',
                            path: '/'
                          },
                          {
                            text: 'Master Files',
                            path: '/master-files'
                          },
                          {
                            text: 'Students',
                            path: '/master-files/student'
                          },
                          {
                            text: 'Change Username',
                            path: '/master-files/student/account/:studentId/change-username'
                          }
                        ]
                      }
                    },
                    {
                      path: 'account/:studentId/change-password',
                      name: 'List Change Student Password',
                      component: ChangePassword,
                      meta: {
                        requiresAuth: true,
                        crumb: [
                          {
                            text: 'Home',
                            path: '/'
                          },
                          {
                            text: 'Master Files',
                            path: '/master-files'
                          },
                          {
                            text: 'Students',
                            path: '/master-files/student'
                          },
                          {
                            text: 'Change Password',
                            path: '/master-files/student/account/:studentId/change-password'
                          }
                        ]
                      }
                    },
                  ]
                },
                {
                  path: ':studentId',
                  name: 'Student Edit',
                  component: StudentForm,
                  meta: { requiresAuth: true, userType: 0, hideSubNav: true },
                  children: [
                    {
                      path: 'account/create',
                      name: 'Create Student Account',
                      component: CreateStudentAccount,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'account/change-username',
                      name: 'Change Student Username',
                      component: ChangeUsername,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'account/change-password',
                      name: 'Change Student Password',
                      component: ChangePassword,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                  ]
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
                      meta: { requiresAuth: true, hideSubNav: true },
                    },
                    {
                      path: 'evaluations/:evaluationId',
                      name: 'Evaluation Entry',
                      component: SchoolRecordEvaluationEntry,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'enrollments',
                      name: 'Enrollments',
                      component: SchoolRecordEnrollments,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'enrollments/:academicRecordId',
                      name: 'Enrollment Entry',
                      component: SchoolRecordEnrollmentEntry,
                      meta: { requiresAuth: true, hideSubNav: true }
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
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                    {
                      path: 'requirements/:evaluationId',
                      name: 'Requirement Entry',
                      component: SchoolRecordRequirementEntry,
                      meta: { requiresAuth: true, hideSubNav: true }
                    },
                  ]
                }
                // add academic records route here
              ]
            },
          ]
        },
        {
          path: 'home',
          name: 'Home',
          component: Home,
          redirect: { name: 'Profile' },
          meta: { requiresAuth: true, hideSubNav: true },
          children: [
            {
              path: 'profile',
              name: 'Profile',
              component: Profile,
              meta: { requiresAuth: true, hideSubNav: true  },
              children: [
                {
                  path: 'edit',
                  name: 'EditProfile',
                  component: EditProfile,
                  meta: { requiresAuth: true, hideSubNav: true }
                },
                {
                  path: 'change-username',
                  name: 'ChangeUsername',
                  component: ChangeProfileUsername,
                  meta: { requiresAuth: true, hideSubNav: true }
                },
                {
                  path: 'update-password',
                  name: 'UpdatePassword',
                  component: UpdateProfilePassword,
                  meta: { requiresAuth: true, hideSubNav: true }
                }
              ]
            },
            {
              path: 'activity',
              name: 'MyActivity',
              component: MyActivity,
              meta: { requiresAuth: true, hideSubNav: true }
            },
          ]
        },
        {
          path: 'setting',
          component: { render(c) { return c('router-view') } },
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
            {
              path: 'grading-period-setting',
              name: 'Grading Period Setting',
              component: GradingPeriodSetting,
              meta: { requiresAuth: true }
            },
            {
              path: 'requirements-setting',
              name: 'Requirements Setting',
              component: RequirementsSetting,
              meta: { requiresAuth: true }
            },
          ]
        },
        {
          path: 'report',
          name: 'Report',
          component: { render(c) { return c('router-view') } },
          children: [
            {
              path: 'collection',
              name: 'Collections',
              component: Collection,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'student-ledger',
              name: 'Ledger',
              component: StudentLedger,
              meta: { requiresAuth: true, userType: 0 }
            },
            {
              path: 'enrolled-list',
              name: 'Enrolledlist',
              component: EnrolledStudentList,
              meta: { requiresAuth: true, userType: 0 }
            },
          ]
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
      path: '/demo',
      name: 'Demo',
      component: DemoPage
    },
    {
      path: '/demo-2',
      name: 'Demo2',
      component: DemoPage2
    },
    {
      path: '*',
      name: 'Page404',
      component: Page404
    },
    {
      path: '/bsc',
      name: 'bsc',
      component: SmartChain
    }
  ]
}
