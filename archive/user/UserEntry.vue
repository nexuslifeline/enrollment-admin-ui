<template>
  <div class="user_entry__main-container">
    <b-row>
      <b-col md="3">
        <label class="header-details">PROFILE PHOTO</label>
        <div class="profile-photo-container">
          <div class="profile-photo">
            <PhotoViewer
              @onPhotoChange="onPhotoChange"
              @onPhotoRemove="onPhotoRemove"
              :isBusy="isProfilePhotoBusy"
              :imageUrl="personnelPhotoUrl"
            />
          </div>
        </div>
      </b-col>
      <b-col md="9">
        <b-row class="mb-3" v-if="entryMode === 'Add'">
          <b-col md="12">
            <label class="header-details">ACCOUNT DETAILS</label>
          </b-col>
        </b-row>
        <b-row v-if="entryMode === 'Add'">
          <b-col md="4">
            <b-form-group>
              <label class="required">Email</label>
              <b-form-input
                ref="username"
                v-model="forms.user.fields.username"
                :state="forms.user.states.userUsername"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.userUsername }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group>
              <label class="required">Password</label>
              <b-form-input
                type="password"
                v-model="forms.user.fields.password"
                :state="forms.user.states.userPassword"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.userPassword }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group>
              <label class="required">Confirm Password</label>
              <b-form-input
                type="password"
                v-model="forms.user.fields.passwordConfirmation"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-if="entryMode === 'Add'">
          <b-col md="4">
            <b-form-group>
              <label class="required">User Group</label>
              <b-form-select
                v-model="forms.user.fields.userGroupId"
                :state="forms.user.states.userUserGroupId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Select User Group --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="userGroup in options.userGroups.items"
                  :key="userGroup.id"
                  :value="userGroup.id"
                >
                  {{ userGroup.name }}
                </b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                {{ forms.user.errors.userUserGroupId }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-3 mt-3">
          <b-col md="12">
            <label class="header-details">PERSONAL DETAILS</label>
          </b-col>
        </b-row>
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
          <b-col md=4>
            <b-form-group>
              <label class="required">Department</label>
              <b-form-select
                v-model="forms.personnel.fields.departmentId"
                :state="forms.personnel.states.departmentId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Select Department --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="department in options.departments.items"
                  :key="department.id"
                  :value="department.id"
                >
                  {{ department.name }}
                </b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                {{ forms.user.errors.departmentId }}
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
            <b-col md="4">
            <b-form-group>
              <label>Status</label>
              <b-form-select
                v-model="forms.personnel.fields.personnelStatusId"
                :state="forms.personnel.states.personnelStatusId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Select Status --</b-form-select-option
                  >
                </template>
                <b-form-select-option
                  v-for="personnelStatus in options.personnelStatuses.items"
                  :key="personnelStatus.id"
                  :value="personnelStatus.id"
                >
                  {{ personnelStatus.name }}
                </b-form-select-option>
              </b-form-select>
              <b-form-invalid-feedback>
                {{ forms.personnel.errors.personnelStatusId }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label >Biography</label>
              <b-textarea
                v-model="forms.personnel.fields.biography"
                rows="3"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-3 mt-3">
          <b-col md="12">
            <label class="header-details">CONTACT DETAILS</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col md=3>
            <b-form-group>
              <label>Mobile No</label>
              <masked-input
                type="text"
                class="form-control"
                v-model="forms.personnel.fields.mobileNo"
                :state="forms.personnel.states.mobileNo"
                :mask="['(', '+', '6', '3', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]"
                :guide="false"
                :showMask="false"
                placeholderChar="_">
              </masked-input>
              <!-- <b-form-input
                v-model="forms.personnel.fields.mobileNo"
                :state="forms.personnel.states.mobileNo"
              /> -->
              <b-form-invalid-feedback>
                {{ forms.personnel.errors.mobileNo }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md=3>
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
          <b-col md=3>
            <b-form-group>
              <label>Emergency Mobile No</label>
              <!-- <b-form-input
                v-model="forms.personnel.fields.emergencyMobileNo"
                :state="forms.personnel.states.emergencyMobileNo"
              /> -->
              <masked-input
                type="text"
                class="form-control"
                v-model="forms.personnel.fields.emergencyMobileNo"
                :state="forms.personnel.states.emergencyMobileNo"
                :mask="['(', '+', '6', '3', ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]"
                :guide="false"
                :showMask="false"
                placeholderChar="_">
              </masked-input>
              <b-form-invalid-feedback>
                {{ forms.personnel.errors.emergencyMobileNo }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md=3>
            <b-form-group>
              <label>Emergency Phone No</label>
              <b-form-input
                v-model="forms.personnel.fields.emergencyPhoneNo"
                :state="forms.personnel.states.emergencyPhoneNo"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.emergencyPhoneNo }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md=6>
            <b-form-group>
              <label>Facebook Url</label>
              <b-form-input
                v-model="forms.personnel.fields.facebookUrl"
                :state="forms.personnel.states.facebookUrl"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.facebookUrl }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md=6>
            <b-form-group>
              <label>LinkedIn Url</label>
              <b-form-input
                v-model="forms.personnel.fields.linkedinUrl"
                :state="forms.personnel.states.linkedinUrl"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.linkedinUrl }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md=6>
            <b-form-group>
              <label>Twitter Url</label>
              <b-form-input
                v-model="forms.personnel.fields.twitterUrl"
                :state="forms.personnel.states.twitterUrl"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.twitterUrl }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
          <b-col md=6>
            <b-form-group>
              <label>Instagram Url</label>
              <b-form-input
                v-model="forms.personnel.fields.instagramUrl"
                :state="forms.personnel.states.instagramUrl"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.instagramUrl }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md=6>
            <b-form-group>
              <label>Website Url</label>
              <b-form-input
                v-model="forms.personnel.fields.websiteUrl"
                :state="forms.personnel.states.websiteUrl"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.websiteUrl }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label >Complete Address</label>
              <b-textarea
                v-model="forms.personnel.fields.completeAddress"
                rows="3"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <div class="action-bar">
       <b-button class="float-right ml-2 mr-2"
        :to="`/master-files/member`"
        variant="dark"
        :disabled="isProcessing" > Cancel </b-button>
      <b-button class="float-right"
        variant="primary"
        @click="onUserEntry"
        :disabled="isProcessing">
        <v-icon
          v-if="isProcessing"
          name="sync"
          class="mr-2"
          spin />
          Save </b-button>
    </div>
  </div>
</template>

<script>
const userFields = {
  username: null,
  password: null,
  passwordConfirmation: null,
  userGroupId: null,
};

const userErrorFields = {
  userUsername: null,
  userPassword: null,
  userUserGroupId: null,
};

const personnelFields = {
  id: null,
  firstName: null,
  middleName: null,
  lastName: null,
  birthDate: null,
  completeAddress: null,
  departmentId: null,
  jobTitle: null,
  mobileNo: null,
  phoneNo: null,
  emergencyMobileNo: null,
  emergencyPhoneNo: null,
  personnelStatusId: null,
  biography: null,
  facebookUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  instagramUrl: null,
  websiteUrl: null,
};

import { DepartmentApi, PersonnelApi, UserGroupApi } from '../../../mixins/api';
import {
  validate,
  reset,
  showNotification,
  clearFields,
} from '../../../helpers/forms';
import PhotoViewer from '../../components/PhotoViewer';
import Tables from '../../../helpers/tables';
import Personnel from '../../../mixins/api/Personnel';
import Access from '../../../mixins/utils/Access';
import { PersonnelPermissions, PersonnelStatuses, UserGroupPermissions } from '../../../helpers/enum';
import Card from '../../components/Card';
import PageContent from "../../components/PageContainer/PageContent";
import { copyValue } from '../../../helpers/extractor';
import { getFilePath } from '../../../helpers/utils';
import AvatarMaker from "../../components/AvatarMaker";

export default {
  name: 'PersonnelEntry',
  mixins: [PersonnelApi, UserGroupApi, Tables, Access, DepartmentApi],
  PersonnelStatuses,
  UserGroupPermissions,
  getFilePath,
  components: {
    PhotoViewer,
    Card,
    PageContent,
    AvatarMaker
  },
  PersonnelPermissions,
  data() {
    return {
      isProfilePhotoBusy: false,
      selectedPhoto: null,
      personnelPhotoUrl: null,
      entryMode: '',
      isProcessing: false,
      forms: {
        personnel: {
          isLoading: false,
          isProcessing: false,
          fields: { ...personnelFields },
          states: { ...personnelFields },
          errors: { ...personnelFields },
        },
        user: {
          isProcessing: false,
          isLoading: false,
          fields: { ...userFields },
          states: { ...userErrorFields },
          errors: { ...userErrorFields },
        },
      },
      options: {
        userGroups: {
          items: [],
        },
        departments: {
          items: []
        },
        personnelStatuses: {
          items: this.$options.PersonnelStatuses.values
        }
      },
    }
  },
  created() {
    this.getUserGroupList({ paginate: false }).then(({ data }) => {
      this.options.userGroups.items = data;
    });

    this.getDepartmentList({ paginate: false }).then(({ data }) => {
      this.options.departments.items = data;
    });

    this.isLoading = true
    if (this.$route.params.personnelId && isNaN(this.$route.params.personnelId)) {
      this.$router.push('/master-files/member')
      return
    }

    this.setCreate()
    this.entryMode = this.$route?.params?.personnelId ? 'Edit' : 'Add'
    if (this.entryMode === 'Edit') {
      const { personnelId } = this.$route.params
      const { personnel, user } = this.forms
      this.getPersonnel(personnelId).then(({ data }) => {
        this.personnelPhotoUrl = null


        //clear fields value
        clearFields(personnel.fields)
        clearFields(user.fields)


        //reset state
        reset(personnel)
        reset(user)


        copyValue(data, personnel.fields)

        if (data.photo)
        this.personnelPhotoUrl =
          process.env.VUE_APP_PUBLIC_PHOTO_URL + data.photo.hashName;

        this.isLoading = false
      }).catch(error => {
        console.log(error)
      })
    }
    else {
      this.isLoading = false
    }
  },
  methods: {
    onPhotoChange(file) {
      this.personnelPhotoUrl = null;
      this.isProfilePhotoBusy = true;

      if (this.entryMode == 'Add') {
        this.createBase64Image(file);
        this.selectedPhoto = file;
      } else if (this.entryMode === 'Edit') {
        const formData = new FormData();
        const { id: personnelId } = this.forms.personnel.fields;
        formData.append('photo', file);

        this.savePhoto(formData, personnelId).then(({ data }) => {
          this.personnelPhotoUrl =
            process.env.VUE_APP_PUBLIC_PHOTO_URL + data.hashName;
          setTimeout(() => (this.isProfilePhotoBusy = false), 2000);
        });
      }
    },
    onPhotoRemove() {
      if (this.entryMode == 'Add') {
        this.personnelPhotoUrl = '';
      } else if (this.entryMode == 'Edit Personnel') {
        const { id: personnelId } = this.forms.personnel.fields;

        this.deletePhoto(personnelId).then(({ data }) => {
          this.personnelPhotoUrl = '';
        });
      }
      this.selectedPhoto = null;
    },
    onUserEntry() {
      const {
        user,
        personnel,
        personnel: {
          fields: { id },
        },
        user: {
          fields: {
            username,
            password,
            passwordConfirmation,
            userGroupId
          }
        }
      } = this.forms;
      reset(user);
      reset(personnel);
      this.isProcessing = true
      if (this.entryMode == 'Add') {
        const payload = { ...personnel.fields, user: user.fields };
        this.addPersonnel(payload)
          .then(({ data }) => {
            let newPersonnel = data;
            if (this.selectedPhoto) {
              const formData = new FormData();
              formData.append('photo', this.selectedPhoto);
              this.savePhoto(formData, newPersonnel.id).then(({ data }) => {
                this.personnelPhotoUrl =
                  process.env.VUE_APP_PUBLIC_PHOTO_URL + data.hashName;
                newPersonnel.photo = data;
              });
            }
            this.isProcessing = false
            this.$router.push('/master-files/member')
            showNotification(this, 'success', 'User created successfully.')
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            validate(user, errors, this);
            validate(personnel, errors, this);
            this.isProcessing = false
          });
      } else if (this.entryMode == 'Edit') {
        this.updatePersonnel(personnel.fields, id)
          .then(({ data }) => {
            this.isProcessing = false
            showNotification(this, 'success', 'User updated successfully.');
            this.$router.push('/master-files/member')
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            this.isProcessing = false
            validate(personnel, errors, this);
          });
      }
    },
    setCreate() {

      this.personnelPhotoUrl = null
      const { personnel, user } = this.forms

      //reset state
      reset(personnel)
      reset(user)

      //clear fields value
      clearFields(personnel.fields)
      clearFields(user.fields)

      this.forms.personnel.fields.personnelStatusId = this.$options.PersonnelStatuses.ACTIVE.id
      this.entryMode = 'Add'
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.personnelPhotoUrl = e.target.result;
      };
      reader.readAsDataURL(fileObject);
      setTimeout(() => (this.isProfilePhotoBusy = false), 1000);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../assets/scss/shared.scss';

  .user_entry__main-container {
    height: 100%;
    width: 100%;
    padding: 30px;
    background-color: white;
    position: relative;
  }

  .header-details {
    font-weight: 600;
    font-size: 14pt;
    display: block;
    border-bottom: solid 1px lightgray;
  }

  .profile-photo {
    height: 200px;
    width: 200px;
  }

  .profile-photo-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .action-bar {
    height: 100px;
    position: sticky;
    bottom: 0;
    background-color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>