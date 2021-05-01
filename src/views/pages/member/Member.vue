<template>
  <PageContent
    title="Member Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadPersonnels"
    :filterVisible="isFilterVisible"
    @create="onAddNewMember"
    :isBusyCreating="isBusyCreating"
    :createButtonVisible="isAccessible($options.PersonnelPermissions.ADD.id)">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.user.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
      />
      <v-select
        :options="options.userGroups.items"
        :value="filters.user.userGroupItem"
        @input="onUserGroupFilterChange"
        label="name"
        placeholder="User Group"
        class="mt-2"
      />
      <v-select
        :options="options.departments.items"
        :value="filters.user.departmentItem"
        @input="onDepartmentFilterChange"
        label="name"
        placeholder="Department"
        class="mt-2"
      />
    </template>
    <template v-slot:content >
      <div>
        <b-row>
          <b-col md="12">
            <b-table
              class="c-table"
              small
              hover
              outlined
              show-empty
              :fields="tables.users.fields"
              :busy="tables.users.isBusy"
              :items="tables.users.items"
              :current-page="paginations.user.page"
              :per-page="paginations.user.perPage"
              :filter="filters.user.criteria"
              @filtered="onFiltered($event, paginations.user)"
            >
              <template v-slot:cell(account)="data">
                <MemberColumn
                  :data="data.item"
                  :callback="{ loadDetails: () => $router.push(`/master-files/member/${data.item.id}`) }"
                />
              </template>
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(action)="row">
                <b-dropdown
                  v-if="
                    isAccessible([
                      $options.PersonnelPermissions.EDIT.id,
                      $options.PersonnelPermissions.UPDATE_PERSONNEL_ACCOUNT.id,
                      $options.PersonnelPermissions.DELETE.id,
                      $options.PersonnelPermissions.CHANGE_PASSWORD.id,
                      $options.UserGroupPermissions.SETUP_PERMISSION.id
                    ])
                  "
                  right
                  variant="link"
                  toggle-class="text-decoration-none"
                  no-caret
                >
                  <template v-slot:button-content>
                    <v-icon name="ellipsis-v" />
                  </template>
                  <b-dropdown-item
                    v-if="isAccessible($options.PersonnelPermissions.EDIT.id)"
                    :to="`/master-files/member/${row.item.id}`"
                    :disabled="showModalEntry"
                  >
                    Edit Profile
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="
                      isAccessible(
                        $options.PersonnelPermissions.UPDATE_PERSONNEL_ACCOUNT
                          .id
                      )
                    "
                    @click="setUpdateUser(row)"
                    :disabled="showModalConfirmation"
                  >
                    Edit Account
                  </b-dropdown-item>
                  <b-dropdown-item
                    @click="setChangePasword(row)"
                    :disabled="showModalChangePassword"
                    v-if="isAccessible($options.PersonnelPermissions.CHANGE_PASSWORD.id)"
                  >
                    Change Password
                  </b-dropdown-item>
                  <b-dropdown-item
                    @click="$router.push({ path: `/maintenance/user-group/${row.item.user.userGroupId}/permissions` })"
                    v-if="isAccessible($options.UserGroupPermissions.SETUP_PERMISSION.id)"
                  >
                    Update Persimission
                  </b-dropdown-item>
                  <b-dropdown-item
                    v-if="isAccessible($options.PersonnelPermissions.DELETE.id)"
                    @click="
                      (forms.user.fields.id = row.item.id),
                        (showModalConfirmation = true)
                    "
                  >
                    Delete
                  </b-dropdown-item>
                </b-dropdown>
              </template>
            </b-table>
            <b-row>
              <b-col md="6">
                Showing {{ paginations.user.from }} to
                {{ paginations.user.to }} of
                {{ paginations.user.totalRows }} records.
              </b-col>
              <b-col md="6">
                <b-pagination
                  class="c-pagination"
                  v-model="paginations.user.page"
                  :total-rows="paginations.user.totalRows"
                  :per-page="paginations.user.perPage"
                  size="sm"
                  align="end"
                  @input="recordDetails(paginations.user)"
                />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
        <!-- end table -->
      </div>

    <!-- Modal Confirmation -->
    <b-modal
      v-model="showModalConfirmation"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        Delete User Group
      </div>
      Are you sure you want to delete this user group?
      <div slot="modal-footer">
        <b-button
          :disabled="forms.user.isProcessing"
          variant="outline-primary"
          class="mr-2 btn-save"
          @click="onUserGroupDelete()"
        >
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Yes
        </b-button>
        <b-button
          variant="outline-danger"
          class="btn-close"
          @click="showModalConfirmation = false"
        >
          No
        </b-button>
      </div>
    </b-modal>
    <!-- End Modal Confirmation -->
    </template>
  </PageContent>
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
import { MemberColumn, AddressColumn } from "../../components/ColumnDetails";

export default {
  name: 'Personnel',
  mixins: [PersonnelApi, UserGroupApi, Tables, Access, DepartmentApi],
  PersonnelStatuses,
  UserGroupPermissions,
  getFilePath,
  components: {
    PhotoViewer,
    Card,
    PageContent,
    AvatarMaker,
    MemberColumn
  },
  PersonnelPermissions,
  data() {
    return {
      isBusyCreating: false,
      isFilterVisible: true,
      showModalEntry: false,
      showModalUpdatePersonnel: false,
      showModalUpdateUser: false,
      showModalChangePassword: false,
      showModalConfirmation: false,
      isProfilePhotoBusy: false,
      selectedPhoto: null,
      personnelPhotoUrl: null,
      entryMode: '',
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
      tables: {
        users: {
          isBusy: false,
          fields: [
            {
              key: 'account',
              label: 'Account',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'completeAddress',
              label: 'Address',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'user.userGroup.name',
              label: 'User Group',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'department.name',
              label: 'Department',
              tdClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '20px' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        user: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        user: {
          criteria: null,
          userGroupId: null,
          userGroupItem: null,
          departmentId: null,
          departmentItem: null,
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
    };
  },
  created() {
    this.loadPersonnels();
    this.getUserGroupList({ paginate: false }).then(({ data }) => {
      this.options.userGroups.items = data;
    });

    this.getDepartmentList({ paginate: false }).then(({ data }) => {
      this.options.departments.items = data;
    });
  },
  methods: {
    loadPersonnels() {
      const { users } = this.tables;
      const { user } = this.paginations;
      const { userGroupId, departmentId } = this.filters.user

      users.isBusy = true;

      const params = { paginate: false, userGroupId, departmentId };
      this.getPersonnelList(params).then(({ data }) => {
        users.items = data;
        user.totalRows = data.length;
        this.recordDetails(user);
        users.isBusy = false;
      });
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
      const { users } = this.tables;
      user.isProcessing = true;
      reset(user);
      reset(personnel);
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

            this.addRow(users, this.paginations.user, newPersonnel);
            user.isProcessing = false;
            showNotification(this, 'success', 'User created successfully.');
            this.showModalEntry = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            user.isProcessing = false;
            validate(user, errors);
            validate(personnel, errors);
          });
      } else if (this.entryMode == 'Edit Personnel') {
        this.updatePersonnel(personnel.fields, id)
          .then(({ data }) => {
            this.updateRow(users, data);
            user.isProcessing = false;
            showNotification(this, 'success', 'User updated successfully.');
            this.showModalUpdatePersonnel = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            user.isProcessing = false;
            validate(personnel, errors);
          });
      } else if (this.entryMode == 'Edit User') {
        const data = { user: { username, userGroupId }, id: personnel.fields.id };
        this.updatePersonnel(data, id)
          .then(({ data }) => {
            this.updateRow(users, data);
            user.isProcessing = false;
            showNotification(this, 'success', 'User updated successfully.');
            this.showModalUpdateUser = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            user.isProcessing = false;
            validate(user, errors);
          });
      } else if (this.entryMode == 'Change Password') {
        const data = { user: { password, passwordConfirmation }, id: personnel.fields.id };
        this.updatePersonnel(data, id)
          .then(({ data }) => {
            this.updateRow(users, data);
            user.isProcessing = false;
            showNotification(this, 'success', 'Change Password successfully.');
            this.showModalChangePassword = false;
          })
          .catch((error) => {
            const errors = error.response.data.errors;
            user.isProcessing = false;
            validate(user, errors);
          });
      }
    },
    onUserGroupDelete() {
      const {
        user,
        user: {
          fields: { id },
        },
      } = this.forms;
      const { users } = this.tables;
      user.isProcessing = true;
      this.deletePersonnel(id).then(({ data }) => {
        this.deleteRow(users, this.paginations.user, id);
        user.isProcessing = false;
        showNotification(this, 'success', 'User deleted successfully.');
        this.showModalConfirmation = false;
      });
    },
    setUpdateUser(row) {
      const {
        personnel,
        user,
        user: { fields },
      } = this.forms;
      user.isLoading = true;
      const { item } = row;
      clearFields(fields);
      reset(user);

      personnel.fields.id = item.id;
      fields.username = item.user.username;
      fields.userGroupId = item.user.userGroupId;

      this.entryMode = 'Edit User';
      this.showModalUpdateUser = true;
      user.isLoading = false;
    },
    setChangePasword(row) {
      const {
        personnel,
        user,
        user: { fields },
      } = this.forms;
      user.isLoading = true;
      const { item } = row;
      clearFields(fields);
      reset(user);

      personnel.fields.id = item.id;
      fields.username = item.user.username;
      fields.userGroupId = item.user.userGroupId;

      this.entryMode = 'Change Password';
      this.showModalChangePassword = true;
      user.isLoading = false;
    },
    setUpdatePersonnel(row) {
      this.personnelPhotoUrl = null;
      const {
        personnel,
        personnel: { fields },
      } = this.forms;
      const { item } = row;
      this.showModalUpdatePersonnel = true;
      personnel.isLoading = true;
      clearFields(fields);
      reset(personnel);
      copyValue(item, fields)

      if (item.photo)
        this.personnelPhotoUrl =
          process.env.VUE_APP_PUBLIC_PHOTO_URL + item.photo.hashName;

      this.entryMode = 'Edit Personnel';
      personnel.isLoading = false;
    },
    setCreate() {
      this.personnelPhotoUrl = null;
      const { user, personnel } = this.forms;
      this.showModalEntry = true;
      personnel.isLoading = true;
      reset(user);
      reset(personnel);
      clearFields(user.fields);
      clearFields(personnel.fields);
      personnel.fields.personnelStatusId = this.$options.PersonnelStatuses.ACTIVE.id
      user.fields.userGroupId = null;
      this.entryMode = 'Add';
      personnel.isLoading = false;
    },
    onPhotoChange(file) {
      this.personnelPhotoUrl = null;
      this.isProfilePhotoBusy = true;

      if (this.entryMode == 'Add') {
        this.createBase64Image(file);
        this.selectedPhoto = file;
      } else if (this.entryMode == 'Edit Personnel') {
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
        const { id: studentId } = this.forms.student.fields;

        this.deletePhoto(studentId).then(({ data }) => {
          this.personnelPhotoUrl = '';
        });
      }
      this.selectedPhoto = null;
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.personnelPhotoUrl = e.target.result;
      };
      reader.readAsDataURL(fileObject);
      setTimeout(() => (this.isProfilePhotoBusy = false), 1000);
    },
    avatar(personnel) {
      let src = '';
      if (personnel.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + personnel.photo.hashName;
      }
      return src;
    },
    onUserGroupFilterChange(item) {
      const { user } = this.filters;
      user.userGroupId = item?.id || 0;
      user.userGroupItem = item;
      this.loadPersonnels();
    },
    onDepartmentFilterChange(item) {
      const { user } = this.filters;
      user.departmentId = item?.id || 0;
      user.departmentItem = item;
      this.loadPersonnels();
    },
    onAddNewMember() {
      this.isBusyCreating = true;
      this.addPersonnel({}).then(({ data }) => {
        this.isBusyCreating = false;
        this.$router.push({ name: 'Member Edit', params: { personnelId: data?.id } });
      }).catch((error) => {
        console.log(error);
        this.isBusyCreating = false;
      });
    }
  },
};
</script>
<style lang="scss">
  @import '../../../assets/scss/shared.scss';
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
</style>
