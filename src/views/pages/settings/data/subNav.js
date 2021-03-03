import  Access  from '../../../../mixins/utils/Access'
import { SettingPermissions } from '../../../../helpers/enum'

export default {
  SettingPermissions,
  mixins: [ Access ],
  Access,
  title: 'Settings',
  items: [
    {
      label: 'General Settings',
      to: `/general-setting`,
      permissionId: SettingPermissions.GENERAL.id
    },
    {
      label: 'Organization Setting',
      to: '/organization-setting',
      permissionId: SettingPermissions.ORGANIZATION.id
    },
    {
      label: 'Terms Settings',
      to: '/terms-setting',
      permissionId: SettingPermissions.TERM.id
    },
    {
      label: 'Requirements Settings',
      to: '/requirements-setting',
      permissionId: SettingPermissions.REQUIREMENT.id
    }
  ]
}