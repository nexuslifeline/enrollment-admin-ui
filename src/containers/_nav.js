import { UserGroups } from '../helpers/enum';

export const checkRights = (userType) => {
  let type =  '';
  const userGroupId = localStorage.getItem('userGroupId')
  const userGroup = UserGroups.getEnum(Number(userGroupId))
  
  userGroup.userType === userType || userGroup.userType === 0
    ? type = '' 
    : type = 'd-none'
  return type
}

export const navs = () => {
  return [{
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Dashboard',
        to: '/home',
        icon: 'cil-speedometer'
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'For Approval',
        route: '/evaluation',
        icon: 'cil-layers',
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'Evaluation & Admission',
            to: '/evaluation',
            icon: 'cil-user',
            class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Student Subject Enlistment',
            to: '/student-subject-enlisment',
            icon: 'cil-user',
            class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Student Assessment Fee',
            to: '/student-assessment-fee',
            icon: 'cil-layers',
            class: checkRights(2)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Payment',
            to: '/payment',
            icon: 'cil-layers',
            class: checkRights(2)
          },
        ]
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'Registrar',
        route: '/subject',
        icon: 'cil-layers',
        items: [
      // Registrar
          {
            _name: 'CSidebarNavItem',
            name: 'Student',
            to: '/student',
            icon: 'cil-layers',
          },
          {
            _name: 'CSidebarNavItem',
            name: 'School Category',
            to: '/school-category',
            icon: 'cil-layers',
            // _class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Semester',
            to: '/semester',
            icon: 'cil-layers',
            // _class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'School Year',
            to: '/school-year',
            icon: 'cil-layers',
            // _class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Section',
            to: '/section',
            icon: 'cil-layers',
            // _class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Department',
            to: '/department',
            icon: 'cil-layers',
            // _class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Subject',
            to: '/subject',
            icon: 'cil-layers',
            // _class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Course',
            to: '/course',
            icon: 'cil-layers',
            class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Curriculum',
            to: '/curriculum',
            icon: 'cil-layers',
            class: checkRights(1)
          },
          // {
          //   _name: 'CSidebarNavItem',
          //   name: 'Scheduling',
          //   to: '/schedule',
          //   icon: 'cil-layers',
          //   class: checkRights(1)
          // },
        ]
      },
      // Finance
      {
        _name: 'CSidebarNavDropdown',
        name: 'Finance',
        route: '/school-fee',
        icon: 'cil-layers',
        _class: checkRights(2),
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'School Fee Category',
            to: '/school-fee-category',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'School Fee',
            to: '/school-fee',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Rate Sheet',
            to: '/rate-sheet',
            icon: 'cil-layers'
          }
        ],
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Users',
        to: '/user',
        icon: 'cil-layers',
        _class: checkRights(0)
      },
      {
        _name: 'CSidebarNavItem',
        name: 'User Group',
        to: '/user-group',
        icon: 'cil-layers',
        _class: checkRights(0)
      },
      
    ]
  }]
}
