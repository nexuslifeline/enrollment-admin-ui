<template>
  <div class="c-page-content">
    <div class="main-container">
      <div class="left-pane">
        <p class="sub-nav__title">Profile</p>
        <ul class="sub-nav">
          <li
            v-for="(item, idx) in items"
            @click="selectedIndex = idx"
            :key="idx"
            class="sub-nav__item"
            :class="{ active: idx === selectedIndex }"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div class="right-pane">
        <div v-if="selectedIndex === 0">
          <div class="personal-details">
            <div class="profile-photo__container">
              <div class="profile-photo">
                <PhotoViewer
                  @onPhotoChange="onPhotoChange"
                  @onPhotoRemove="onPhotoRemove"
                  :isBusy="isProfilePhotoBusy"
                  :imageUrl="personnelPhotoUrl"
                />
              </div>
            </div>
            <div class="profile-info__container">
              <b-row>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Firstname</label>
                  <b-form-input
                    ref="firstName"
                    v-model="forms.personnel.fields.firstName"
                    :state="forms.personnel.states.firstName"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.firstName }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label>Middlename</label>
                  <b-form-input
                    v-model="forms.personnel.fields.middleName"
                    :state="forms.personnel.states.middleName"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.middleName }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Lastname</label>
                  <b-form-input
                    v-model="forms.personnel.fields.lastName"
                    :state="forms.personnel.states.lastName"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.lastName }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Job Title</label>
                  <b-form-input
                    v-model="forms.personnel.fields.jobTitle"
                    :state="forms.personnel.states.jobTitle"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.jobTitle }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <label class="required">Birthdate</label>
                  <b-form-input
                    type="date"
                    v-model="forms.personnel.fields.birthDate"
                    :state="forms.personnel.states.birthDate"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.birthDate }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=4>
                <b-form-group>
                  <label>Mobile No</label>
                  <b-form-input
                    v-model="forms.personnel.fields.mobileNo"
                    :state="forms.personnel.states.mobileNo"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.mobileNo }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md=4>
                <b-form-group>
                  <label>Phone No</label>
                  <b-form-input
                    v-model="forms.personnel.fields.phoneNo"
                    :state="forms.personnel.states.phoneNo"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.phoneNo }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md=4>
                <b-form-group>
                  <label>Emergency Mobile No</label>
                  <b-form-input
                    v-model="forms.personnel.fields.emergencyMobileNo"
                    :state="forms.personnel.states.emergencyMobileNo"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.emergencyMobileNo }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
              <b-col md=4>
                <b-form-group>
                  <label>Emergency Phone No</label>
                  <b-form-input
                    v-model="forms.personnel.fields.emergencyPhoneNo"
                    :state="forms.personnel.states.emergencyPhoneNo"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.emergencyPhoneNo }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <b-form-group>
                  <label class="required">Complete Address</label>
                  <b-textarea
                    v-model="forms.personnel.fields.completeAddress"
                    rows="3"
                    :state="forms.personnel.states.completeAddress"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.personnel.errors.completeAddress }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="account-details">
            <b-row class="justify-content-md-center">
              <b-col md="6">
                <b-form-group label="Email" labelClass="required">
                  <b-form-input
                    debounce="500"
                    v-model="forms.user.fields.username"
                    :state="forms.user.states.userUsername"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.user.errors.username }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Old Password" labelClass="required">
                  <b-form-input
                    debounce="500"
                    type="password"
                    v-model="forms.user.fields.oldPassword"
                    :state="forms.user.states.userOldPassword"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.user.errors.userOldPassword }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="New Password" labelClass="required">
                  <b-form-input
                    debounce="500"
                    type="password"
                    v-model="forms.user.fields.password"
                    :state="forms.user.states.userPassword"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.user.errors.userPassword }}
                  </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="Confirm Password" labelClass="required">
                  <b-form-input
                    type="password"
                    debounce="500"
                    v-model="forms.user.fields.passwordConfirmation"
                    :state="forms.user.states.userPasswordConfirmation"
                  />
                  <b-form-invalid-feedback>
                    {{ forms.user.errors.userPasswordConfirmation }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>
          </div>
        </div>
        <div class="action-bar">
          <b-button
            class="btn-save float-right"
            variant="outline-primary"
            @click="onUpdateProfile"
            :disabled="isProcessing"
          >
            <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
            Save
          </b-button>
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
            showNotification(this, 'success', 'Profile updated successfully.');
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            this.isProcessing = false;
            validate(user, errors);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.main-container {
  height: 100%;
  display: flex;
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
