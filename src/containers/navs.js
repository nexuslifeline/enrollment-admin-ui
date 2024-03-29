
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
  EvaluationPermissions,
  EnlistmentPermissions,
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
  DocumentTypePermission,
  CollectionReportPermissions,
  StudentLedgerReportPermissions,
  ClassMasterlistReportPermissions,
  StudentGradePermissions,
  SettingPermissions,
  EClearancePermissions,
  EClearanceClearingPermissions,
  DroppedStudentPermissions,
  GradeSymbolPermissions
} from '../helpers/enum';

export default [
  {
    label: 'Home',
    to: '/home',
    children: [
      {
        label: 'Profile',
        to: '/home/profile'
      },
      {
        label: 'Activity',
        to: '/home/activity'
      },
      // {
      //   label: 'Settings',
      //   to: '/home/settings',
      //   permissionIds: [
      //     ...SettingPermissions.getIds(),
      //   ],
      // },
    ]
  },
  {
    name: 'Enrollment',
    label: 'Enrollment',
    to: '/enrollment',
    permissionIds: [
      ...EvaluationPermissions.getIds(),
      ...EnlistmentPermissions.getIds(),
      ...StudentFeePermissions.getIds(),
      ...StudentPaymentPermissions.getIds(),
      ...ManualEnrollmentPermissions.getIds()
    ],
    children: [
      {
        label: 'Evaluation',
        to: '/enrollment/evaluation',
        permissionIds: EvaluationPermissions.getIds(),
      },
      {
        label: 'Enlistment',
        to: '/enrollment/student-subject-enlisment',
        permissionIds: EnlistmentPermissions.getIds()
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
        label: 'New Payment',
        to: '/enrollment/new-payment',
        permissionIds: StudentPaymentPermissions.getIds()
      },
      {
        label: 'Manual Entry',
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
        label: 'Section & Schedule',
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
      },
      {
        label: 'Academic Transcript',
        to: '/registrar/academic-transcript',
        permissionIds: TranscriptRecordPermissions.getIds()
      },
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
        label: 'SOA',
        to: '/finance/soa',
        permissionIds: StatementOfAccountPermissions.getIds()
      },
      {
        label: 'Other Billing',
        to: '/finance/other-billing',
        permissionIds: OtherBillingPermissions.getIds()
      },
      {
        label: 'Post Payment',
        to: '/finance/post-payment',
        permissionIds: PaymentPermissions.getIds()
      },
      {
        label: 'Rate Sheet',
        to: '/finance/rate-sheet',
        permissionIds: RateSheetPermissions.getIds()
      },
    ]
  },
  {
    label: 'Instructor',
    to: '/instructor',
    permissionIds: [
      ...StudentGradePermissions.getIds(),
      ...EClearanceClearingPermissions.getIds(),
      ...DroppedStudentPermissions.getIds()
    ],
    children: [
      {
        label: 'Clearance',
        to: '/instructor/clearance',
        permissionIds: EClearanceClearingPermissions.getIds()
      },
      {
        label: 'Grade Sheet',
        to: '/instructor/grade-sheet',
        permissionIds: StudentGradePermissions.getIds()
      },
      {
        label: 'Manage Dropped Students',
        to: '/instructor/dropped-student',
        permissionIds: DroppedStudentPermissions.getIds()
      },

    ]
  },
  {
    label: 'Master Files',
    to: '/master-files',
    permissionIds: [
      ...StudentPermissions.getIds(),
      ...PersonnelPermissions.getIds(),
      ...TranscriptRecordPermissions.getIds(),
    ],
    children: [
      {
        label: 'Student',
        to: '/master-files/student/', // added trailing slash here to satisfy the tab active check
        permissionIds: StudentPermissions.getIds()
      },
      {
        label: 'Member',
        to: '/master-files/member',
        permissionIds: PersonnelPermissions.getIds()
      },
    ]
  },
  {
    label: 'Maintenance',
    to: '/maintenance',
    permissionIds: [
      ...DepartmentPermissions.getIds(),
      ...SchoolYearPermissions.getIds(),
      ...UserGroupPermissions.getIds(),
      ...BankAccountPermissions.getIds(),
      ...PeraPadalaAccountPermissions.getIds(),
      ...EWalletAccountPermissions.getIds(),
      ...DocumentTypePermission.getIds(),
      ...EClearancePermissions.getIds(),
      ...GradeSymbolPermissions.getIds()
    ],
    children: [
      {
        label: 'Group & Permissions',
        to: '/maintenance/user-group',
        permissionIds: UserGroupPermissions.getIds()
      },
      {
        label: 'School Year',
        to: '/maintenance/school-year',
        permissionIds: SchoolYearPermissions.getIds()
      },
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
        label: 'Signatories',
        to: '/maintenance/clearance-signatories',
        permissionIds: EClearancePermissions.getIds()
      },
      {
        label: 'Category',
        to: '/maintenance/school-category'
      },
      {
        label: 'Fee Category',
        to: '/maintenance/school-fee-category',
        permissionIds: FeeCategoryPermissions.getIds()
      },
      {
        label: 'School Fee',
        to: '/maintenance/school-fee',
        permissionIds: SchoolFeePermissions.getIds()
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
      {
        label: 'Grade Symbol',
        to: '/maintenance/grade-symbol',
        permissionIds: GradeSymbolPermissions.getIds()
      },
    ]
  },
  {
    label: 'Reports',
    to: '/report',
    permissionIds: [
      ...CollectionReportPermissions.getIds(),
      ...StudentLedgerReportPermissions.getIds(),
      ...ClassMasterlistReportPermissions.getIds(),
    ],
    children: [
      {
        label: 'Collections',
        description: 'Gives an overview of the state of the collection activities within the school.',
        to: '/report/collection',
        permissionIds: CollectionReportPermissions.getIds()
      },
      {
        label: 'Student Ledger',
        description: 'The student ledger card is the document that summarizes the financial transactions pertaining to each student\'s attendance at the institution including a listing of all costs charged to the student and all fees received from the student or any other funding source on behalf of the student.',
        to: '/report/student-ledger',
        permissionIds: StudentLedgerReportPermissions.getIds()
      },
      {
        label: 'Student Masterlist',
        description: 'This report provides a list of all students currently enrolled in class.',
        to: '/report/enrolled-list',
        permissionIds: ClassMasterlistReportPermissions.getIds()
      }
    ]
  },
  {
    label: 'Settings',
    to: '/setting',
    permissionIds: [...SettingPermissions.getIds()],
    children: [
      {
        label: 'General Setting',
        to: '/setting/general-setting'
      },
      {
        label: 'Organization Setting',
        to: '/setting/organization-setting'
      },
      {
        label: 'Terms Setting',
        to: '/setting/terms-setting'
      },
      {
        label: 'Grading Period Setting',
        to: '/setting/grading-period-setting'
      },
      {
        label: 'Requirements Setting',
        to: '/setting/requirements-setting',
        // permissionIds: CoursePermissions.getIds()
      }
    ]
  },

]
