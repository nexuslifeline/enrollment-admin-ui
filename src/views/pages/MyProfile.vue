<template>
  <div class="c-page-content">
    <div class="main-container">
      <Card title="About">
        <template>
          <InputGroup>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
          </InputGroup>
          <InputGroup>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
          </InputGroup>
        </template>
      </Card>

      <Card title="Contact">
        <template>
          <InputGroup>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
            <InputContainer>
              <label class="required">Firstname</label>
                <b-form-input
                  ref="firstName"
                  v-model="forms.personnel.fields.firstName"
                  :state="forms.personnel.states.firstName"
                />
                <b-form-invalid-feedback>
                  {{ forms.personnel.errors.firstName }}
                </b-form-invalid-feedback>
            </InputContainer>
          </InputGroup>
        </template>
      </Card>
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
    CardItem
  },
  mixins: [PersonnelApi, AuthApi],
  data() {
    return {
      selectedIndex: 0,
      isProcessing: false,
      items: [
        {
          label: 'Personal Details',
        },
        {
          label: 'Account Setting',
        },
      ],
      forms: {
        personnel: {
          fields: { ...personnelFields },
          states: { ...personnelFields },
          errors: { ...personnelFields },
        },
        user: {
          fields: { ...userFields },
          states: { ...userFields },
          errors: { ...userFields },
        },
      },
      personnelPhotoUrl: null,
      isProfilePhotoBusy: false,
    };
  },
  created() {
    this.getAuthenticatedUser().then(({ data }) => {
      const { userable: personnelData } = data;
      const { personnel, user } = this.forms;
      copyValue(personnelData, personnel.fields);
      copyValue(data, user.fields);

      if (personnelData.photo) {
        this.personnelPhotoUrl =
        process.env.VUE_APP_PUBLIC_PHOTO_URL + personnelData.photo.hashName;
      }
    });
  },
  methods: {
    onPhotoChange(file) {
      const formData = new FormData();
      const { id: personnelId } = this.forms.personnel.fields;
      formData.append('photo', file);

      this.savePhoto(formData, personnelId).then(({ data }) => {
        this.personnelPhotoUrl =
          process.env.VUE_APP_PUBLIC_PHOTO_URL + data.hashName;
        setTimeout(() => (this.isProfilePhotoBusy = false), 2000);
      });
    },
    onPhotoRemove() {
      const { id: personnelId } = this.forms.personnel.fields;

      this.deletePhoto(personnelId).then(({ data }) => {
        this.personnelPhotoUrl = '';
      });
    },
    onUpdateProfile() {
      this.isProcessing = true;
      const {
        user,
        personnel,
        personnel: { fields },
      } = this.forms;
      if (this.selectedIndex === 0) {
        reset(personnel);
        this.updatePersonnel(fields, fields.id)
          .then(({ data }) => {
            this.isProcessing = false;
            showNotification(this, 'success', 'Profile updated successfully.');
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            this.isProcessing = false;
            validate(personnel, errors);
          });
      } else {
        const data = { user: user.fields, id: fields.id };
        reset(user);
        this.updatePersonnel(data, fields.id)
          .then(({ data }) => {
            this.isProcessing = false;
            this.selectedIndex = 0
            showNotification(this, 'success', 'Profile updated successfully.');
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            this.isProcessing = false;
            validate(user, errors);
          });
      }
    },
    onSelectedIndexChange(idx) {
      this.selectedIndex = idx
      const { fields } = this.forms.user
      fields.password = null
      fields.oldPassword = null
      fields.passwordConfirmation = null
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.main-container {
  height: 100%;
  width: 100%;
  max-width: calc(#{$header-details-row-max-width} + 70px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  @include for-size(phone-only) {
    flex-direction: column;
    padding: 20px 20px 0 20px;
  }
}

.sub-nav {
  list-style: none;
  padding: 0;

  &:hover {
    cursor: pointer;
  }
}

.sub-nav__item {
  margin-bottom: 10px;
  padding: 6px 20px;

  &.active {
    background-color: $light-blue-10;
    border-radius: 3px;

    .sub-nav__link {
      color: $brand-primary;
      font-weight: 500;
    }
  }
}

.sub-nav__title {
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

.left-pane {
  min-width: 200px;
  display: flex;
  flex-direction: column;
  padding: 20px;
  // border-right: 1px solid $light-gray-10;
}

.sub-nav__link {
  font-size: 14px;
  color: $black;
}

.right-pane {
  flex: 1;
  border: solid whitesmoke 1px;
  padding: 30px;

  @include for-size(phone-only) {
    margin-top: 20px;
  }

  .action-bar {
    border-top: 1px solid lightgray;

    .btn-save {
      margin-top: 10px;
      width: 150px;
    }
  }
}

.personal-details {
  display: flex;

  .profile-photo__container {
    display: flex;
    flex-direction: column;
    margin-right: 15px;

    .profile-photo {
      height: 200px;
      width: 200px;
      @include for-size(phone-only) {
        height: 150px;
        width: 150px;
      }
    }
  }

  .profile-info__container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
