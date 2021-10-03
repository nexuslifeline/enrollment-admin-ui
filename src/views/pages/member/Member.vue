<template>
  <PageContent
    title="Member Management"
    description="Manage member's personal information, family background, educational background and other settings."
    :searchKeyword="filters.user.criteria"
    :pageFrom="paginations.user.from"
    :pageTo="paginations.user.to"
    :pageTotal="paginations.user.totalRows"
    :perPage="paginations.user.perPage"
    :currentPage.sync="paginations.user.page"
    @onPageChange="loadPersonnels"
    @onRefresh="loadPersonnels"
    @create="onAddNewMember"
    :isBusyCreating="isBusyCreating"
    :createButtonVisible="isAccessible($options.PersonnelPermissions.ADD.id)">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.user.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
        @update="loadPersonnels()"
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
        <b-table
          class="c-table"
          small
          hover
          outlined
          show-empty
          :fields="tables.users.fields"
          :busy="tables.users.isBusy"
          :items="tables.users.items"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @sort-changed="onSortChanged"
          responsive
        >
          <template v-slot:cell(account)="data">
            <MemberColumn
              :data="data.item"
              :callback="{ loadDetails: () => $router.push(`/master-files/member/${data.item.id}`) }"
            />
          </template>
          <template v-slot:cell(userGroup)="data">
            {{ data.item.user && data.item.user.userGroup && data.item.user.userGroup.name || '' }}
          </template>
          <template v-slot:cell(department)="data">
            {{ data.item.department && data.item.department.name || '' }}
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
              boundary="window"
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
                v-if="isAccessible($options.PersonnelPermissions.UPDATE_PERSONNEL_ACCOUNTid)"
                @click="onEditAccount(row)"
                :disabled="showModalConfirmation"
              >
                Edit Account
              </b-dropdown-item>
              <b-dropdown-item
                :disabled="showModalChangePassword"
                v-if="isAccessible($options.PersonnelPermissions.CHANGE_PASSWORD.id)"
                @click="onChangePassword(row)"
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
        <!-- <div class="d-flex">
          <div>
            Showing {{ paginations.user.from }} to
            {{ paginations.user.to }} of
            {{ paginations.user.totalRows }} records.
          </div>
          <div class="ml-auto">
            <b-pagination
              class="c-pagination"
              v-model="paginations.user.page"
              :total-rows="paginations.user.totalRows"
              :per-page="paginations.user.perPage"
              size="sm"
              align="end"
              @input="loadPersonnels()"
            />
          </div>
        </div> -->
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
            variant="primary"
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
            variant="dark"
            class=""
            @click="showModalConfirmation = false"
          >
            No
          </b-button>
        </div>
      </b-modal>
      <!-- End Modal Confirmation -->
      <router-view
        :user="selectedMember"
        :previousRoute="{ name: 'Member List' }">
      </router-view>
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
} from '../../../helpers/forms';
import Tables from '../../../helpers/tables';
import Access from '../../../mixins/utils/Access';
import { PersonnelPermissions, PersonnelStatuses, UserGroupPermissions } from '../../../helpers/enum';
import PageContent from "../../components/PageContainer/PageContent";
import { getFilePath } from '../../../helpers/utils';
import { MemberColumn } from "../../components/ColumnDetails";

export default {
  name: 'Personnel',
  mixins: [PersonnelApi, UserGroupApi, Tables, Access, DepartmentApi],
  PersonnelStatuses,
  UserGroupPermissions,
  getFilePath,
  components: {
    PageContent,
    MemberColumn
  },
  PersonnelPermissions,
  data() {
    return {
      selectedMember: {},
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
      sortBy: null,
      sortDesc: null,
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
              label: 'Member',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
              sortable: true
            },
            {
              key: 'completeAddress',
              label: 'Address',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'userGroup',
              label: 'User Group',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
              sortable: true
            },
            {
              key: 'department',
              label: 'Department',
              tdClass: 'align-middle',
              thStyle: { width: '18%' },
              sortable: true
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '20px' },
              sortable: true
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
      const { user, user: { perPage, page } } = this.paginations;
      const { userGroupId, departmentId, criteria } = this.filters.user

      users.isBusy = true;

      const params = {
          paginate: true,
          perPage,
          page,
          userGroupId,
          departmentId,
          criteria,
          ordering: this.getOrdering(this.sortBy, this.sortDesc) };

      this.getPersonnelList(params).then(({ data }) => {
        users.items = data.data;
        user.totalRows = data.meta.total;
        user.from = data.meta.from;
        user.to = data.meta.to;
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
            validate(user, errors, this);
            validate(personnel, errors, this);
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
            validate(personnel, errors, this);
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
            validate(user, errors, this);
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
            validate(user, errors, this);
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
    },
    onEditAccount(row) {
      this.selectedMember = row.item?.user || {};
      this.$router.push({
        name: 'List Change Member Username',
        params: { personnelId: row.item.id }
      })
    },
    onChangePassword(row) {
      this.selectedMember = row.item?.user || {};
      this.$router.push({
        name: 'List Change Member Password',
        params: { personnelId: row.item.id }
      })
    },
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      this.loadPersonnels();
    },
    getOrdering(sortBy, sortDesc = false) {
      if (!sortBy) return;
      const orderBy = this.mapOrdering(sortBy);
      if (!orderBy) return;
      return `${sortDesc ? '-' : ''}${orderBy}`;
    },
    mapOrdering(sortBy) {
      return ({
        account: 'first_name',
        department: 'department_name',
        userGroup: 'user_group_name',
      })?.[sortBy] || this.$options.camelToSnakeCase(sortBy);
    },
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
