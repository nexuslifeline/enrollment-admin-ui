<template>
  <div class="c-page-content">
    <div class="main-container">
      <div class="main-container__content-area">
        <div class="main-container__main-panel">
          <HeaderProfileCard
            :user="$store.state.user"
          />
          <router-view></router-view>
        </div>
        <div class="main-container__side-panel">
          <CoDepartmentList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { copyValue } from '../../helpers/extractor';
import { reset, showNotification, validate } from '../../helpers/forms';
import { AuthApi, PersonnelApi } from '../../mixins/api';
import PhotoViewer from '../components/PhotoViewer';
import Card from '../components/Card';
import InputGroup from '../components/InputGroup/InputGroup';
import InputContainer from '../components/InputGroup/InputContainer';
import CardItem from '../components/Card/CardItem';
import CardCol from '../components/Card/CardColumn';
import HeaderProfileCard from '../../containers/HeaderProfileCard';
import CoDepartmentList from '../components/CoDepartment/List';

const personnelFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  birthDate: null,
  completeAddress: null,
  jobTitle: null,
  mobileNo: null,
  phoneNo: null,
  emergencyMobileNo: null,
  emergencyPhoneNo: null,
};

const userFields = {
  id: null,
  username: null,
  oldPassword: null,
  password: null,
  passwordConfirmation: null,
  userGroupId: null,
};

const userStatesAndErrors = {
  id: null,
  userUsername: null,
  userOldPassword: null,
  userPassword: null,
  userPasswordConfirmation: null,
};

export default {
  components: {
    PhotoViewer,
    Card,
    InputGroup,
    InputContainer,
    CardCol,
    CardItem,
    HeaderProfileCard,
    CoDepartmentList
  },
  mixins: [PersonnelApi, AuthApi],
  data() {
    return {

    };
  },
  created() {

  },
  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.main-container__content-area {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.main-container__side-panel {
  width: 320px;
  height: auto;
  margin-left: 15px;
}

.main-container {
  height: 100%;
  width: 100%;
  max-width: calc(#{$header-details-row-max-width} + 70px);
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @include for-size(phone-only) {
    flex-direction: column;
    padding: 20px 20px 0 20px;
  }
}

.main-container__main-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
}

</style>
