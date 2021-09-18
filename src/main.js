import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
//import CoreuiVue from '@coreui/vue'
//import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store'
import { httpRequest, httpAuthRequest } from './helpers/http'
//import { BootstrapVue } from 'bootstrap-vue'
import SelectPaginated from './views/components/SelectPaginated';
import StageIndicator from './views/components/Wizard/StageIndicator';
import FooterAction from './views/components/ModalFooter/ActionBar';
import ShowMore from './views/components/CoDepartment/ShowMore';
import FileViewer from './views/components/FileViewer';
import ApprovalItem from './views/components/ApprovalContainer/Item';
import InlineItem from './views/components/ApprovalContainer/InlineItem';
import ApprovalView from './views/components/ApprovalContainer/PageLayout';
import AcademicView from './views/components/CardView/AcademicView';
import StudentAttachments from './views/components/StudentFiles/List';
import SchoolView from './views/components/CardView/SchoolView';
import EducationView from './views/components/CardView/EducationView';
import StudentView from './views/components/CardView/StudentView';
import FamilyView from './views/components/CardView/FamilyView';
import ActiveRowViewer from './views/components/ActiveRowViewer/ActiveRowViewer';
import ActiveViewLinks from './views/components/ActiveRowViewer/ActiveViewLinks';
import ActiveViewHeader from './views/components/ActiveRowViewer/ActiveViewHeader';
import ActiveViewItems from './views/components/ActiveRowViewer/ActiveViewItems';
import ActiveViewItem from './views/components/ActiveRowViewer/ActiveViewItem';
import PageContent from './views/components/PageContainer/PageContent';
import FolderManager from './views/components/FolderManager/SubjectFolderManager';
import GradeSheet from './views/components/GradeSheet/GradeSheet';
import SlidePanel from './views/components/SlidePanel/Panel';
import SlidePanelNotes from './views/components/SlidePanel/PanelNotes';
import SelectLevelCourses from './views/components/Dropdowns/SelectCourseLevel';
import SelectCategory from './views/components/Dropdowns/SelectCategory';
import SelectStudentBillingTerms from './views/components/Dropdowns/SelectStudentBillingTerms';
import SelectCategoryBillingTerms from './views/components/Dropdowns/SelectCategoryBillingTerms';
import SelectStudentCategory from './views/components/Dropdowns/SelectStudentCategory';
import SelectStudent from './views/components/Dropdowns/SelectStudent';
import SelectOnboardingSteps from './views/components/Dropdowns/SelectOnboardingSteps';
import SelectAcademicRecord from './views/components/Dropdowns/SelectAcademicRecord';
import SelectSemester from './views/components/Dropdowns/SelectSemester';
import SelectLevel from './views/components/Dropdowns/SelectLevel';
import SelectAcademicStatus from './views/components/Dropdowns/SelectAcademicStatus';
import SelectSubjectSection from './views/components/Dropdowns/SelectSubjectSection';
import AvatarMaker from './views/components/AvatarMaker';
import vText from './views/components/Text';
import Card from './views/components/Card';
import BulletedContent from './views/components/BulletedContent/BulletedContent';
import CardNote from './views/components/CardNote';
import CardFooterRow from './views/components/CardFooterRow';
import BackLink from './views/components/BackLink/Link';
import { InputGroup, InputContainer, InputInline } from './views/components/InputGroup';
import LinkVisibilityToggler from './views/components/VisibilityToggler/Link';
import CenterContainer from './views/components/CenterContainer';
import Toggle from './views/components/Form/Toggle';
import vSelect from 'vue-select'
import { AlertPlugin, BIconPlus } from 'bootstrap-vue';
import { AvatarPlugin } from 'bootstrap-vue';
import { BadgePlugin } from 'bootstrap-vue';
//import { BreadcrumbPlugin } from 'bootstrap-vue'
import { ButtonPlugin } from 'bootstrap-vue';
import { ButtonGroupPlugin } from 'bootstrap-vue'
import { ButtonToolbarPlugin } from 'bootstrap-vue'
//import { CalendarPlugin } from 'bootstrap-vue'
import { CardPlugin } from 'bootstrap-vue'
//import { CarouselPlugin } from 'bootstrap-vue'
import { CollapsePlugin } from 'bootstrap-vue'
import { DropdownPlugin } from 'bootstrap-vue'
import { EmbedPlugin } from 'bootstrap-vue'
import { FormPlugin } from 'bootstrap-vue'
import { FormCheckboxPlugin } from 'bootstrap-vue'
import { FormDatepickerPlugin } from 'bootstrap-vue'
import { FormFilePlugin } from 'bootstrap-vue'
import { FormGroupPlugin } from 'bootstrap-vue'
import { FormInputPlugin } from 'bootstrap-vue'
import { FormRadioPlugin } from 'bootstrap-vue'
//import { FormRatingPlugin } from 'bootstrap-vue'
import { FormSelectPlugin } from 'bootstrap-vue'
import { FormSpinbuttonPlugin } from 'bootstrap-vue'
//import { FormTagsPlugin } from 'bootstrap-vue'
import { FormTextareaPlugin } from 'bootstrap-vue'
import { FormTimepickerPlugin } from 'bootstrap-vue'
import { ImagePlugin } from 'bootstrap-vue'
import { InputGroupPlugin } from 'bootstrap-vue'
//import { JumbotronPlugin } from 'bootstrap-vue'
import { LayoutPlugin } from 'bootstrap-vue'
import { LinkPlugin } from 'bootstrap-vue'
import { ListGroupPlugin } from 'bootstrap-vue'
import { MediaPlugin } from 'bootstrap-vue'
import { ModalPlugin } from 'bootstrap-vue'
//import { NavPlugin } from 'bootstrap-vue'
//import { NavbarPlugin } from 'bootstrap-vue'
import { OverlayPlugin } from 'bootstrap-vue'
import { PaginationPlugin } from 'bootstrap-vue'
import { PaginationNavPlugin } from 'bootstrap-vue'
//import { PopoverPlugin } from 'bootstrap-vue'
//import { ProgressPlugin } from 'bootstrap-vue'
//import { SidebarPlugin } from 'bootstrap-vue'
import { SpinnerPlugin } from 'bootstrap-vue'
import { TablePlugin } from 'bootstrap-vue'
import { TabsPlugin } from 'bootstrap-vue'
//import { TimePlugin } from 'bootstrap-vue'
import { ToastPlugin } from 'bootstrap-vue'
import { TooltipPlugin } from 'bootstrap-vue'
import MaskedInput from 'vue-text-mask'
import {
  BIconFolderSymlink,
  BIconFolder2Open,
  BIconAlarm,
  BIconArrowRightCircle,
  BIconArrowLeftCircle,
  BIconPaperclip,
  BIconCloudDownload,
  BIconCheckCircle,
  BIconEnvelope,
  BIconPersonBadge,
  BIconGeoAlt,
  BIconGeo,
  BIconCalendar2Week,
  BIconCaretDownFill,
  BIconCaretUpFill,
  BProgress,
  BIconFunnelFill,
  BIconChevronLeft,
  BIconChevronRight,
  BIconChevronDown,
  BIconChevronUp,
  BIconArrowRepeat,
  BIconPerson,
  BIconTelephone,
  BSpinner,
  BIconCamera,
  BIconCameraFill,
  BIconPencil,
  BIconArrowLeft,
  BIconImage,
  BIconTrash,
  BIconX,
  BIconThreeDots,
  BIconFolderPlus,
  BIconFolderMinus
} from 'bootstrap-vue';
Vue.component('BIconThreeDots', BIconThreeDots);
Vue.component('BIconX', BIconX);
Vue.component('BIconTrash', BIconTrash);
Vue.component('BIconImage', BIconImage);
Vue.component('BIconArrowLeft', BIconArrowLeft);
Vue.component('BIconPencil', BIconPencil);
Vue.component('BIconCameraFill', BIconCameraFill);
Vue.component('BIconCamera', BIconCamera);
Vue.component('BSpinner', BSpinner);
Vue.component('BIconChevronUp', BIconChevronUp);
Vue.component('BIconChevronDown', BIconChevronDown);
Vue.component('BIconTelephone', BIconTelephone);
Vue.component('BIconGeo', BIconGeo);
Vue.component('BIconPerson', BIconPerson);
Vue.component('BIconFolderSymlink', BIconFolderSymlink);
Vue.component('BIconFolderPlus', BIconFolderPlus);
Vue.component('BIconFolderMinus', BIconFolderMinus);
Vue.component('BIconFolder2Open', BIconFolder2Open);
Vue.component('BIconAlarm', BIconAlarm);
Vue.component('BIconFunnelFill', BIconFunnelFill);
Vue.component('BIconChevronLeft', BIconChevronLeft);
Vue.component('BIconChevronRight', BIconChevronRight);
Vue.component('BIconArrowRepeat', BIconArrowRepeat);
Vue.component('BIconArrowRightCircle', BIconArrowRightCircle);
Vue.component('BIconArrowLeftCircle', BIconArrowLeftCircle);
Vue.component('BIconPaperclip', BIconPaperclip);
Vue.component('BIconCloudDownload', BIconCloudDownload);
Vue.component('BIconCheckCircle', BIconCheckCircle);
Vue.component('BIconEnvelope', BIconEnvelope);
Vue.component('BIconPersonBadge', BIconPersonBadge);
Vue.component('BIconGeoAlt', BIconGeoAlt);
Vue.component('BIconCalendar2Week', BIconCalendar2Week);
Vue.component('BIconCaretDownFill', BIconCaretDownFill);
Vue.component('BIconCaretUpFill', BIconCaretUpFill);
Vue.component('BProgress', BProgress)
Vue.component('BIconPlus', BIconPlus);
Vue.component('SlidePanel', SlidePanel);
Vue.component('SlidePanelNotes', SlidePanelNotes);
Vue.component('BulletedContent', BulletedContent);

import 'vue-awesome/icons/spinner'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/sync'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/plus'
import 'vue-awesome/icons/plus-circle'
import 'vue-awesome/icons/ellipsis-v'
import 'vue-awesome/icons/caret-left'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/search'
import 'vue-awesome/icons/pen'
import 'vue-awesome/icons/file-pdf'
import 'vue-awesome/icons/file-image'
import 'vue-awesome/icons/times-circle'
import 'vue-awesome/icons/paperclip'
//import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/paper-plane'
//import 'vue-awesome/icons/map-marker-alt'
import 'vue-awesome/icons/calendar-alt'
//import 'vue-awesome/icons/address-card'
import 'vue-awesome/icons/cogs'
import 'vue-awesome/icons/caret-down'
import 'vue-awesome/icons/chevron-down'
import 'vue-awesome/icons/chevron-left'
import 'vue-awesome/icons/chevron-right'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/compress'
import 'vue-awesome/icons/ellipsis-v'
import 'vue-awesome/icons/ellipsis-h'
import 'vue-awesome/icons/clock'
import 'vue-awesome/icons/folder'
import 'vue-awesome/icons/folder-open'
import 'vue-awesome/icons/print'
import 'vue-awesome/icons/info-circle'
import Icon from 'vue-awesome/components/Icon'
// import vSelect from 'vue-select'

// Vue.component('v-select', vSelect);

//axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
// const axiosConfig = {
//   baseURL: 'http://enrollment.test',
//   timeout: 30000
// }
Vue.config.performance = true
Vue.component('v-icon', Icon)
Vue.component('v-select', vSelect)

Vue.component('vText', vText);
Vue.component('BackLink', BackLink);
Vue.component('SelectLevel', SelectLevel);
Vue.component('SelectStudent', SelectStudent);
Vue.component('SelectStudentCategory', SelectStudentCategory);
Vue.component('SelectCategory', SelectCategory);
Vue.component('SelectStudentBillingTerms', SelectStudentBillingTerms);
Vue.component('SelectCategoryBillingTerms', SelectCategoryBillingTerms);
Vue.component('SelectOnboardingSteps', SelectOnboardingSteps);
Vue.component('SelectAcademicStatus', SelectAcademicStatus);
Vue.component('SelectAcademicRecord', SelectAcademicRecord);
Vue.component('SelectSemester', SelectSemester);
Vue.component('SelectSubjectSection', SelectSubjectSection);
Vue.component('CenterContainer', CenterContainer);
Vue.component('AvatarMaker', AvatarMaker);
Vue.component('Card', Card);
Vue.component('CardNote', CardNote);
Vue.component('CardFooterRow', CardFooterRow);
Vue.component('InputGroup', InputGroup);
Vue.component('InputContainer', InputContainer);
Vue.component('InputInline', InputInline);
Vue.component('Toggle', Toggle);
Vue.component('LinkVisibilityToggler', LinkVisibilityToggler);
Vue.component('PageContent', PageContent);
Vue.component('FolderManager', FolderManager);
Vue.component('GradeSheet', GradeSheet);
Vue.component('ActiveRowViewer', ActiveRowViewer);
Vue.component('ActiveViewLinks', ActiveViewLinks);
Vue.component('ActiveViewHeader', ActiveViewHeader);
Vue.component('ActiveViewItems', ActiveViewItems);
Vue.component('ActiveViewItem', ActiveViewItem);
Vue.component('StudentView', StudentView);
Vue.component('FamilyView', FamilyView);
Vue.component('SchoolView', SchoolView);
Vue.component('StudentAttachments', StudentAttachments);
Vue.component('EducationView', EducationView);
Vue.component('AcademicView', AcademicView);
Vue.component('ApprovalView', ApprovalView);
Vue.component('ApprovalItem', ApprovalItem);
Vue.component('InlineItem', InlineItem);
Vue.component('FileViewer', FileViewer);
Vue.component('ShowMore', ShowMore);
Vue.component('FooterAction', FooterAction);
Vue.component('StageIndicator', StageIndicator);
Vue.component('SelectPaginated', SelectPaginated);
Vue.component('SelectLevelCourses', SelectLevelCourses);

//Vue.use(CoreuiVue)
//Vue.use(BootstrapVue)
//Vue.use(IconsPlugin)
Vue.component('masked-input', MaskedInput);
Vue.component('vue-autonumeric', require('vue-autonumeric'))
//import axios from 'axios'
Vue.prototype.$log = console.log.bind(console)

Vue.prototype.$http = httpRequest
Vue.prototype.$authHttp = httpAuthRequest


Vue.use(AlertPlugin);
Vue.use(AvatarPlugin);
Vue.use(BadgePlugin);
//Vue.use(BreadcrumbPlugin);
Vue.use(ButtonPlugin);
Vue.use(ButtonGroupPlugin)
Vue.use(ButtonToolbarPlugin)
//Vue.use(CalendarPlugin)
Vue.use(CardPlugin)
//Vue.use(CarouselPlugin)
Vue.use(CollapsePlugin)
Vue.use(DropdownPlugin)
Vue.use(EmbedPlugin)
Vue.use(FormPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormDatepickerPlugin)
Vue.use(FormFilePlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormRadioPlugin)
//Vue.use(FormRatingPlugin)
Vue.use(FormSelectPlugin)
Vue.use(FormSpinbuttonPlugin)
//Vue.use(FormTagsPlugin)
Vue.use(FormTextareaPlugin)
Vue.use(FormTimepickerPlugin)
Vue.use(ImagePlugin)
Vue.use(InputGroupPlugin)
//Vue.use(JumbotronPlugin)
Vue.use(LayoutPlugin)
Vue.use(LinkPlugin)
Vue.use(ListGroupPlugin)
Vue.use(MediaPlugin)
Vue.use(ModalPlugin)
//Vue.use(NavPlugin)
//e.use(NavbarPlugin)
Vue.use(OverlayPlugin)
Vue.use(PaginationPlugin)
Vue.use(PaginationNavPlugin)
//Vue.use(PopoverPlugin)
//Vue.use(ProgressPlugin)
//Vue.use(SidebarPlugin)
Vue.use(SpinnerPlugin)
Vue.use(TablePlugin)
Vue.use(TabsPlugin)
//ue.use(TimePlugin)
Vue.use(ToastPlugin)
Vue.use(TooltipPlugin)

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
