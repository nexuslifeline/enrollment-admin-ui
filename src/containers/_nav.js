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
        to: '/dashboard',
        icon: 'cil-speedometer'
      },
      {
        _name: 'CSidebarNavDropdown',
        name: 'For Approval',
        route: '/studentadmission',
        icon: 'cil-layers',
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'Student Admission',
            to: '/studentadmission',
            icon: 'cil-user',
            class: checkRights(1)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Student Assessment Fee',
            to: '/studentassessmentfee',
            icon: 'cil-layers',
            class: checkRights(2)
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Payment',
            to: '/payment',
            icon: 'cil-layers'
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
        ]
      },
      // Finance
      {
        _name: 'CSidebarNavDropdown',
        name: 'Finance',
        route: '/schoolfee',
        icon: 'cil-layers',
        _class: checkRights(2),
        items: [
          {
            _name: 'CSidebarNavItem',
            name: 'School Fee',
            to: '/schoolfee',
            icon: 'cil-layers'
          },
          {
            _name: 'CSidebarNavItem',
            name: 'Rate Sheet',
            to: '/ratesheet',
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
        to: '/usergroup',
        icon: 'cil-layers',
        _class: checkRights(0)
      }
    ]
  }]
}