<template>
  <PageContent
    title="User Management"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadPersonnels"
    :filterVisible="isFilterVisible"
    @create="$router.push(`/master-files/user/add`)"
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
              <template v-slot:cell(photo)="data">
                <b-media>
                  <template v-slot:aside>
                    <AvatarMaker
                      :avatarId="data.item.id"
                      :size="33"
                      :text="
                        `${data.item.firstName.charAt(0)}${data.item.lastName.charAt(
                          0
                        )}`
                      "
                      :src="
                        $options.getFilePath(
                          (data.item.photo && data.item.photo.hashName) || ''
                        )
                      "
                    />
                  </template>
                </b-media>
              </template>
              <template v-slot:table-busy>
                <div class="text-center my-2">
                  <v-icon name="spinner" spin class="mr-2" />
                  <strong>Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(user.username)="row">
                <b-link
                  :to="`/master-files/user/${row.item.id}`"
                  :disabled="
                    !isAccessible($options.PersonnelPermissions.EDIT.id)
                  "
                  >{{ row.item.user.username }}
                </b-link>
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
                    :to="`/master-files/user/${row.item.id}`"
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
      <!-- Modal Entry Add -->
    <b-modal
      @shown="$refs.username.focus()"
      v-model="showModalEntry"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl"
    >
      <div slot="modal-title">
        <!-- modal title -->
        User - Add
      </div>
      <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.personnel.isLoading" rounded="sm">
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
            <b-row>
              <b-col md="12">
                <label class="header-details">ACCOUNT DETAILS</label>
              </b-col>
            </b-row>
            <b-row>
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
            <b-row>
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
            <b-row>
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
              <b-col md=3>
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
                  <b-form-input
                    v-model="forms.personnel.fields.emergencyMobileNo"
                    :state="forms.personnel.states.emergencyMobileNo"
                  />
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
      </b-overlay>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalEntry = false"
        >
          Close
        </b-button>
        <b-button
          :disabled="forms.user.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onUserEntry()"
        >
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Save
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <!-- End Modal Entry -->
    <!-- Modal Entry Edit Personnel info -->
    <b-modal
      @shown="$refs.firstName.focus()"
      v-model="showModalUpdatePersonnel"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl"
    >
      <div slot="modal-title">
        <!-- modal title -->
        User - Edit
      </div>
      <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.personnel.isLoading" rounded="sm">
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
            <b-row>
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
              <b-col md=3>
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
                  <b-form-input
                    v-model="forms.personnel.fields.emergencyMobileNo"
                    :state="forms.personnel.states.emergencyMobileNo"
                  />
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
                    {{ forms.personnel.errors.emergencyPhoneNo }}
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
                  <label>Complete Address</label>
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
          </b-col>
        </b-row>
      </b-overlay>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalUpdatePersonnel = false"
        >
          Close
        </b-button>
        <b-button
          :disabled="forms.user.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onUserEntry()"
        >
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Save
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <!-- End Modal Entry Edit Personnel info -->
    <!-- Modal Entry Edit User info -->
    <b-modal
      @shown="$refs.username.focus()"
      v-model="showModalUpdateUser"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        User Account - Edit
      </div>
      <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.user.isLoading" rounded="sm">
        <b-row>
          <b-col md="12">
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
      </b-overlay>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalUpdateUser = false"
        >
          Close
        </b-button>
        <b-button
          :disabled="forms.user.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onUserEntry()"
        >
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Save
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <!-- End Modal Entry Edit User info -->
    <b-modal
      @shown="$refs.password.focus()"
      v-model="showModalChangePassword"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        User Account - Change Password
      </div>
      <!-- modal title -->
      <!-- modal body -->
      <b-overlay :show="forms.user.isLoading" rounded="sm">
        <b-row>
          <b-col md="12">
            <b-form-group>
              <label class="required">Password</label>
              <b-form-input
                ref="password"
                type="password"
                v-model="forms.user.fields.password"
                :state="forms.user.states.userPassword"
              />
              <b-form-invalid-feedback>
                {{ forms.user.errors.userPassword }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group>
              <label class="required">Confirm Password</label>
              <b-form-input
                type="password"
                v-model="forms.user.fields.passwordConfirmation"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-overlay>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          variant="outline-danger"
          class="float-left btn-close"
          @click="showModalUpdateUser = false"
        >
          Close
        </b-button>
        <b-button
          :disabled="forms.user.isProcessing"
          variant="outline-primary"
          class="float-right btn-save"
          @click="onUserEntry()"
        >
          <v-icon
            v-if="forms.user.isProcessing"
            name="sync"
            spin
            class="mr-2"
          />
          Save
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
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
    AvatarMaker
  },
  PersonnelPermissions,
  data() {
    return {
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
              key: 'photo',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '64px', maxWidth: '64px' },
            },
            {
              key: 'user.username',
              label: 'Email',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
              formatter: (value, key, item) => {
                if (!item.middleName) {
                  item.middleName = '';
                }
                return (item.name =
                  item.firstName + ' ' + item.middleName + ' ' + item.lastName);
              },
            },
            {
              key: 'user.userGroup.name',
              label: 'User Group',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'department.name',
              label: 'User Group',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px', maxWidth: '40px' },
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
