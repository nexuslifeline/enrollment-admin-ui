export default [
  {
    label: 'Home',
    to: '/dashboard',
    children: [
      {
        label: 'Profile',
        to: '/profile'
      },
      {
        label: 'Activity',
        to: '/activity'
      },
    ]
  },
  {
    name: 'Approval',
    label: 'Approval',
    to: '/approval',
    children: [
      {
        label: 'Evaluation',
        to: '/approval/evaluation'
      },
      {
        label: 'Subjects',
        to: '/approval/student-subject-enlisment'
      },
      {
        label: 'Assessment Fee',
        to: '/approval/student-assessment-fee'
      },
      {
        label: 'Payment',
        to: '/approval/payment'
      }
    ]
  },
  {
    label: 'Registrar',
    to: '/registrar',
    children: [
      {
        label: 'Curriculum',
        to: '/registrar/curriculum'
      },
      // {
      //   label: 'Schedule',
      //   to: '/registrar/schedule'
      // },
      {
        label: 'Section',
        to: '/registrar/section'
      },
      {
        label: 'Subject',
        to: '/registrar/subject'
      },
      {
        label: 'Course',
        to: '/registrar/course'
      }
    ]
  },
  {
    label: 'Finance',
    to: '/finance',
    children: [
      {
        label: 'Rate Sheet',
        to: '/finance/rate-sheet'
      },
      {
        label: 'Fee Category',
        to: '/finance/school-fee-category'
      },
      {
        label: 'School Fee',
        to: '/finance/school-fee'
      }
    ]
  },
  {
    label: 'Master Files',
    to: '/master-files',
    children: [
      {
        label: 'Student',
        to: '/master-files/student/' // added trailing slash here to satisfy the tab active check
      },
      {
        label: 'Personnel',
        to: '/master-files/user'
      }
    ]
  },
  {
    label: 'Maintenance',
    to: '/maintenance',
    children: [
      {
        label: 'Department',
        to: '/maintenance/department'
      },
      {
        label: 'Semester',
        to: '/maintenance/semester'
      },
      {
        label: 'Year',
        to: '/maintenance/school-year'
      },
      {
        label: 'Category',
        to: '/maintenance/school-category'
      },
      {
        label: 'User Group',
        to: '/maintenance/user-group'
      },
    ]
  }
]