
import {
  DepartmentPermissions,
  SchoolYearPermissions,
  UserGroupPermissions,
  StudentPermissions,
  PersonnelPermissions,
  RateSheetPermissions,
  FeeCategoryPermissions,
  SchoolFeePermissions,
  CurriculumPermissions,
  SectionAndSchedulePermissions,
  SubjectPermissions,
  CoursePermissions,
  EvaluationAndAdmissionPermissions,
  StudentSubjectPermissions,
  StudentFeePermissions,
  StudentPaymentPermissions, Semesters,
  BankAccountPermissions,
  EWalletAccountPermissions,
  PeraPadalaAccountPermissions,
  ManualEnrollmentPermissions,
  PaymentPermissions,
  StatementOfAccountPermissions,
  OtherBillingPermissions,
  TranscriptRecordPermissions,
  DocumentTypePermission
} from '../helpers/enum';

export default [
  {
    label: 'Home',
    to: '/dashboard',
    children: [
      {
        label: 'Profile',
        to: '/dashboard/profile'
      },
      {
        label: 'Activity',
        to: '/dashboard/activity'
      },
      {
        label: 'Settings',
        to: '/dashboard/settings',
      },
    ]
  },
  {
    name: 'Enrollment',
    label: 'Enrollment',
    to: '/enrollment',
    permissionIds: [
      ...EvaluationAndAdmissionPermissions.getIds(),
      ...StudentSubjectPermissions.getIds(),
      ...StudentFeePermissions.getIds(),
      ...StudentPaymentPermissions.getIds(),
      ...ManualEnrollmentPermissions.getIds()
    ],
    children: [
      {
        label: 'Evaluation',
        to: '/enrollment/evaluation',
        permissionIds: EvaluationAndAdmissionPermissions.getIds(),
      },
      {
        label: 'Enlistment',
        to: '/enrollment/student-subject-enlisment',
        permissionIds: StudentSubjectPermissions.getIds()
      },
      {
        label: 'Assessment',
        to: '/enrollment/student-assessment-fee',
        permissionIds: StudentFeePermissions.getIds()
      },
      {
        label: 'Payment',
        to: '/enrollment/payment',
        permissionIds: StudentPaymentPermissions.getIds()
      },
      {
        label: 'Manual Enrollment',
        to: '/enrollment/academic-record-applications',
        permissionIds: ManualEnrollmentPermissions.getIds()
        // to be added
      },
    ]
  },
  {
    label: 'Registrar',
    to: '/registrar',
    permissionIds: [
      ...CurriculumPermissions.getIds(),
      ...SectionAndSchedulePermissions.getIds(),
      ...SubjectPermissions.getIds(),
      ...CoursePermissions.getIds()
    ],
    children: [
      {
        label: 'Curriculum',
        to: '/registrar/curriculum',
        permissionIds: CurriculumPermissions.getIds()
      },
      // {
      //   label: 'Schedule',
      //   to: '/registrar/schedule'
      // },
      {
        label: 'Section',
        to: '/registrar/section',
        permissionIds: SectionAndSchedulePermissions.getIds()
      },
      {
        label: 'Subject',
        to: '/registrar/subject',
        permissionIds: SubjectPermissions.getIds()
      },
      {
        label: 'Course',
        to: '/registrar/course',
        permissionIds: CoursePermissions.getIds()
      }
    ]
  },
  {
    label: 'Finance',
    to: '/finance',
    permissionIds: [
      ...RateSheetPermissions.getIds(),
      ...FeeCategoryPermissions.getIds(),
      ...SchoolFeePermissions.getIds(),
      ...PaymentPermissions.getIds(),
      ...StatementOfAccountPermissions.getIds(),
      ...OtherBillingPermissions.getIds()
    ],
    children: [
      {
        label: 'Rate Sheet',
        to: '/finance/rate-sheet',
        permissionIds: RateSheetPermissions.getIds()
      },
      {
        label: 'Fee Category',
        to: '/finance/school-fee-category',
        permissionIds: FeeCategoryPermissions.getIds()
      },
      {
        label: 'School Fee',
        to: '/finance/school-fee',
        permissionIds: SchoolFeePermissions.getIds()
      },
      {
        label: 'Payment',
        to: '/finance/payment',
        permissionIds: PaymentPermissions.getIds()
      },
      {
        label: 'SOA',
        to: '/finance/soa',
        permissionIds: StatementOfAccountPermissions.getIds()
      },
      {
        label: 'Other Billing',
        to: '/finance/other-billing',
        permissionIds: OtherBillingPermissions.getIds()
      }
    ]
  },
  {
    label: 'Master Files',
    to: '/master-files',
    permissionIds: [
      ...StudentPermissions.getIds(),
      ...PersonnelPermissions.getIds(),
      ...TranscriptRecordPermissions.getIds()
    ],
    children: [
      {
        label: 'Student',
        to: '/master-files/student/', // added trailing slash here to satisfy the tab active check
        permissionIds: StudentPermissions.getIds()
      },
      {
        label: 'Transcript Records',
        to: '/master-files/transcript-records',
        permissionIds: TranscriptRecordPermissions.getIds()
      },
      {
        label: 'Personnel',
        to: '/master-files/user',
        permissionIds: PersonnelPermissions.getIds()
      }
    ]
  },
  {
    label: 'Maintenance',
    to: '/maintenance',
    children: [
      {
        label: 'Department',
        to: '/maintenance/department',
        permissionIds: DepartmentPermissions.getIds()
      },
      {
        label: 'Semester',
        to: '/maintenance/semester'
      },
      {
        label: 'School Year',
        to: '/maintenance/school-year',
        permissionIds: SchoolYearPermissions.getIds()
      },
      {
        label: 'Category',
        to: '/maintenance/school-category'
      },
      {
        label: 'User Group',
        to: '/maintenance/user-group',
        permissionIds: UserGroupPermissions.getIds()
      },
      {
        label: 'Bank Account',
        to: '/maintenance/bank-account',
        permissionIds: BankAccountPermissions.getIds()
      },
      {
        label: 'Pera Padala Account',
        to: '/maintenance/pera-padala-account',
        permissionIds: PeraPadalaAccountPermissions.getIds()
      },
      {
        label: 'E Wallet Account',
        to: '/maintenance/e-wallet-account',
        permissionIds: EWalletAccountPermissions.getIds()
      },
      {
        label: 'Document Type',
        to: '/maintenance/document-type',
        permissionIds: DocumentTypePermission.getIds()
      },
    ]
  },
  {
    label: 'Reports',
    to: '/report',
    children: [
      {
        label: 'Collections',
        to: '/report/collection',
        //permissionIds: BankAccountPermissions.getIds()
      },
      {
        label: 'Student Ledger',
        to: '/report/student-ledger',
        //permissionIds: BankAccountPermissions.getIds()
      },
      {
        label: 'Enrolled List',
        to: '/report/enrolled-list',
        //permissionIds: BankAccountPermissions.getIds()
      }
    ]
  }

]
