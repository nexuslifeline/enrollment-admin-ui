<template>
  <PageContent
    :title="`Subject Enlistment (${$store.state.schoolYear.name})`"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadAcademicRecord"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        debounce="500"
        @update="loadAcademicRecord()"
        type="text"
        placeholder="Search"
      >
      </b-form-input>
      <v-select
        :options="options.schoolCategories.values"
        :value="filters.student.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />
      <v-select
        v-if="isCourseVisible"
        :options="options.courses.items"
        :value="filters.student.courseItem"
        @input="onCourseFilterChange"
        label="name"
        placeholder="Course"
        class="mt-2"
      />
      <v-select
        :options="AcademicRecordStatuses.values"
        :value="filters.student.academicRecordStatusItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
    <!-- <Card
      title="Subject Enlistment"
      :showRefresh="true"
      @onRefresh="loadAcademicRecord()"
    > -->
      <!-- <SchoolCategoryTabs
        :showAll="true"
        @loadSchoolCategoryId="
          (filters.student.schoolCategoryId = $event), loadAcademicRecord()
        "
        @clickAll="
          (filters.student.schoolCategoryId = null),
            (filters.student.courseId = null),
            loadAcademicRecord()
        "
        @click="
          (filters.student.schoolCategoryId = $event),
            (filters.student.courseId = null),
            loadAcademicRecord()
        "
      /> -->
      <div v-if="checkIfHasSchoolCategoryAccess()">
        <!-- <b-row class="mb-2">
          <b-col md="6">
            <b-form-radio-group
              @input="loadAcademicRecord()"
              v-model="filters.student.academicRecordStatusId"
            >
              <b-form-radio :value="null">Show All</b-form-radio>
              <b-form-radio
                v-for="status in AcademicRecordStatuses.values"
                :value="status.id"
                :key="status.id"
              >
                {{ status.name }}
              </b-form-radio>
            </b-form-radio-group>
          </b-col>
          <b-col md="3">
            <b-form-select
              v-if="
                filters.student.schoolCategoryId ===
                  options.schoolCategories.SENIOR_HIGH_SCHOOL.id ||
                  filters.student.schoolCategoryId ===
                    options.schoolCategories.COLLEGE.id ||
                  filters.student.schoolCategoryId ===
                    options.schoolCategories.GRADUATE_SCHOOL.id
              "
              @change="loadAcademicRecord()"
              v-model="filters.student.courseId"
              class="float-right"
            >
              <template v-slot:first>
                <b-form-select-option :value="null" disabled
                  >-- Course --</b-form-select-option
                >
              </template>
              <b-form-select-option :value="null">None</b-form-select-option>
              <b-form-select-option
                v-for="course in options.courses.items"
                :key="course.id"
                :value="course.id"
              >
                {{ course.description }}
                {{ course.major ? `(${course.major})` : '' }}
              </b-form-select-option>
            </b-form-select>
          </b-col>
          <b-col md="3">
            <b-form-input
              v-model="filters.student.criteria"
              debounce="500"
              @update="loadAcademicRecord()"
              type="text"
              placeholder="Search"
            >
            </b-form-input>
          </b-col>
        </b-row> -->
        <!-- row button and search input -->
        <b-table
          class="c-table"
          hover
          outlined
          small
          show-empty
          :fields="tables.students.fields"
          :items="tables.students.items"
          :busy="tables.students.isBusy"
        >
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(name)="data">
            <StudentColumn
              :showIsManual="true"
              :data="data.item"
              :callback="{ loadDetails: () => loadDetails(data) }"
            />
          </template>
          <!-- <template v-slot:cell(contact)="data">
            Email : {{ data.item.student.email }} <br>
            <small>Phone : {{ data.item.student.phoneNo }}</small> <br>
            <small>Mobile : {{ data.item.student.mobileNo }}</small> <br>
          </template> -->
          <template v-slot:cell(address)="data">
            <AddressColumn :data="data.item" />
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item" :showSchoolYear="false"/>
          </template>
          <template v-slot:cell(status)="data">
            <b-badge
              :variant="
                data.item.academicRecordStatusId ===
                AcademicRecordStatuses.ENROLLED.id
                  ? 'success'
                  : data.item.academicRecordStatusId ===
                    AcademicRecordStatuses.FINALIZED.id
                  ? 'primary'
                  : 'warning'
              "
            >
              {{
                AcademicRecordStatuses.getEnum(data.item.academicRecordStatusId)
                  .name
              }}
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              right
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <v-icon name="ellipsis-v" />
              </template>
              <b-dropdown-item @click.prevent="loadDetails(row)">
                View Details
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:row-details="data">
            <ActiveRowViewer
              :isBusy="data.item.isLoading"
              backTitle="Go back to list"
              @onBack="data.toggleDetails()"
              :showOptions="
                data.item.academicRecordStatusId ===
                  AcademicRecordStatuses.DRAFT.id
              "
              :showActionBar="
                data.item.academicRecordStatusId ===
                  AcademicRecordStatuses.DRAFT.id
              "
              :options="[
                {
                  label: 'Approve',
                  callback: () => setApproval(data),
                  isAllowed: isAccessible(
                    $options.StudentSubjectPermissions.APPROVAL.id
                  ),
                },
                {
                  label: 'Reject',
                  callback: () => setDisapproval(data),
                  isAllowed: isAccessible(
                    $options.StudentSubjectPermissions.DISAPPROVAL.id
                  ),
                },
              ]"
            >
              <template v-slot:header>
                <div class="active-view__header-details-container">
                  <AvatarMaker
                    :avatarId="data.item.student.id"
                    :size="50"
                    :text="
                      `${data.item.student.firstName.charAt(
                        0
                      )}${data.item.student.lastName.charAt(0)}`
                    "
                    :src="avatar(data.item.student)"
                  />
                  <div class="active-view__header-details">
                    <p class="active-view__header-name">
                      {{ data.item.student.name }}
                    </p>
                    <p class="active-view__header-email">
                      {{ data.item.student.email }}
                    </p>
                  </div>
                </div>
              </template>
              <template v-slot:content>
                <div>
                  <ActiveViewItems>
                    <ActiveViewItem label="Level: ">
                      <p>
                        {{ getName(data.item, 'level') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Course: ">
                      <p>
                        {{ getName(data.item, 'course') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem
                      v-if="!!getName(data.item, 'course')"
                      label="Semester: "
                    >
                      <p>
                        {{ getName(data.item, 'semester') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="School Year: ">
                      <p>
                        {{ getName(data.item, 'schoolYear') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Section: ">
                      <p>
                        <template v-if="!changeSection">
                          {{
                            !data.item.sectionId
                              ? 'No Section'
                              : data.item.sectionId
                          }}
                          <!---- get section value here -->
                          <span class="ml-2"
                            >[<a href="#" @click.prevent="changeSection = true"
                              >Change</a
                            >]</span
                          >
                        </template>
                        <b-form-select
                          v-else
                          class="section-select"
                          v-model="data.item.sectionId"
                          @change="prePopulateStudentSubjects(data)"
                          :disabled="
                            data.item.academicRecordStatusId !==
                              AcademicRecordStatuses.DRAFT.id
                          "
                        >
                          <template v-slot:first>
                            <b-form-select-option :value="null" disabled
                              >-- Section --</b-form-select-option
                            >
                          </template>
                          <b-form-select-option
                            v-for="section in filterSection(data)"
                            :key="section.id"
                            :value="section.id"
                          >
                            {{ section.name }}
                          </b-form-select-option>
                        </b-form-select>
                      </p>
                    </ActiveViewItem>
                  </ActiveViewItems>
                </div>
                <div>
                  <div class="details__section-button-container">
                    <button
                      class="btn btn-outline-primary add-subject-button"
                      v-if="
                        data.item.academicRecordStatusId ===
                          AcademicRecordStatuses.DRAFT.id
                      "
                      @click="onAddSubject(data.item)"
                    >
                      <v-icon name="plus-circle" /> ADD SUBJECT
                    </button>
                  </div>
                  <b-table
                    class="mb-4"
                    hover
                    outlined
                    small
                    responsive
                    show-empty
                    :fields="tables.subjects.fields"
                    :items="data.item.subjects"
                    :busy="tables.subjects.isBusy"
                  >
                    <template v-slot:cell(name)="row">
                      <div v-if="!!row.item.name && !!row.item.name">
                        {{ row.item.name }}
                      </div>
                      <div v-if="!!row.item.description">
                        {{ row.item.description }}
                      </div>
                    </template>
                    <template v-slot:cell(action)="row">
                      <b-button
                        v-if="
                          data.item.academicRecordStatusId ===
                            AcademicRecordStatuses.DRAFT.id
                        "
                        @click="removeSubject(data.item.subjects, row)"
                        size="sm"
                        variant="danger"
                      >
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                    <template v-slot:cell(section)="row">
                      <span>{{
                        row.item.section ? row.item.section.name : ''
                      }}</span>
                      <b-dropdown
                        right
                        variant="link"
                        toggle-class="text-decoration-none"
                        no-caret
                      >
                        <template v-slot:button-content>
                          <v-icon name="ellipsis-v" />
                        </template>
                        <!-- v-if="isAccessible($options.StudentPermissions.UPDATE_ACADEMIC_RECORDS.id)" -->
                        <b-dropdown-item
                          v-if="
                            data.item.academicRecordStatusId ===
                              AcademicRecordStatuses.DRAFT.id
                          "
                          @click.prevent="onShowModalSection(row.item, data)"
                        >
                          Change
                        </b-dropdown-item>
                        <b-dropdown-item
                          @click.prevent="onSectionSubjectClear(row)"
                        >
                          Clear
                        </b-dropdown-item>
                      </b-dropdown>
                      <!-- <span v-if="data.item.academicRecordStatusId === AcademicRecordStatuses.DRAFT.id">
                        <a class="float-right" href="#" @click.prevent="onShowModalSection(row.item, data)">[Change]</a>
                        <br>
                        <a class="float-right" href="#" @click.prevent="onSectionSubjectClear(row)">[Clear]</a>
                      </span> -->
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon name="spinner" spin class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                    <template v-slot:custom-foot>
                      <b-tr class="font-weight-bold">
                        <b-td class="text-right">
                          <span class="text-danger">Total Units </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ totalUnits(data.item.subjects, 'units') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ totalUnits(data.item.subjects, 'labs') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ totalUnits(data.item.subjects, 'totalUnits') }}
                          </span>
                        </b-td>
                        <b-td colspan="2"></b-td>
                      </b-tr>
                    </template>
                  </b-table>
                </div>
              </template>
              <template v-slot:actionBar>
                <div class="float-right">
                  <b-button
                    @click="setApproval(data)"
                    class="mr-2" variant="outline-primary"
                    v-if="isAccessible($options.StudentSubjectPermissions.APPROVAL.id)"> Approve</b-button>
                  <b-button variant="outline-danger"
                    @click="setDisapproval(data)"
                    v-if="isAccessible(
                    $options.StudentSubjectPermissions.DISAPPROVAL.id)"> Reject</b-button>
                </div>
              </template>
            </ActiveRowViewer>
            <b-overlay :show="isLoading" rounded="sm">
              <b-row class="m-2">
                <b-col md="3">
                  <h6>Level</h6>
                  <h6>{{ getName(data.item, 'level') }}</h6>
                </b-col>
                <b-col md="4">
                  <div v-if="getName(data.item, 'course') != ''">
                    <h6>Course</h6>
                    <h6>
                      {{ data.item.course.description }}
                      {{
                        data.item.course.major
                          ? `(${data.item.course.major})`
                          : ''
                      }}
                    </h6>
                  </div>
                </b-col>
                <b-col md="2">
                  <div v-show="getName(data.item, 'course') != ''">
                    <h6>Semester</h6>
                    <h6>{{ getName(data.item, 'semester') }}</h6>
                  </div>
                </b-col>
                <b-col md="3">
                  <h6>School Year</h6>
                  <h6>{{ getName(data.item, 'schoolYear') }}</h6>
                </b-col>
              </b-row>
              <b-card>
                <div v-if="data.item.subjects">
                  <b-row class="mb-3">
                    <b-col md="12">
                      <h5 class="pt-2">SUBJECTS</h5>
                    </b-col>
                  </b-row>
                  <b-table
                    class="mb-4"
                    hover
                    outlined
                    small
                    responsive
                    show-empty
                    :fields="tables.subjects.fields"
                    :items="data.item.subjects"
                    :busy="tables.subjects.isBusy"
                  >
                    <template v-slot:cell(action)="row">
                      <b-button
                        v-if="
                          data.item.academicRecordStatusId ===
                            AcademicRecordStatuses.DRAFT.id
                        "
                        @click="removeSubject(data.item.subjects, row)"
                        size="sm"
                        variant="danger"
                      >
                        <v-icon name="trash" />
                      </b-button>
                    </template>
                    <template v-slot:cell(section)="row">
                      <span>{{
                        row.item.section ? row.item.section.name : ''
                      }}</span
                      >xxxx
                      <span
                        v-if="
                          data.item.academicRecordStatusId ===
                            AcademicRecordStatuses.DRAFT.id
                        "
                      >
                        <a
                          class="float-right"
                          href="#"
                          @click.prevent="onShowModalSection(row.item, data)"
                          >[Change]</a
                        >
                        <br />
                        <a
                          class="float-right"
                          href="#"
                          @click.prevent="onSectionSubjectClear(row)"
                          >[Clear]</a
                        >
                      </span>
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon name="spinner" spin class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                    <template v-slot:custom-foot>
                      <b-tr class="font-weight-bold">
                        <b-td class="text-right">
                          <span class="text-danger">Total Units </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ totalUnits(data.item.subjects, 'units') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ totalUnits(data.item.subjects, 'labs') }}
                          </span>
                        </b-td>
                        <b-td class="text-center">
                          <span class="text-danger">
                            {{ totalUnits(data.item.subjects, 'totalUnits') }}
                          </span>
                        </b-td>
                        <b-td colspan="2"></b-td>
                      </b-tr>
                    </template>
                  </b-table>
                </div>
                <!-- <div v-if="data.item.admissionId">
                  <h5>Files</h5>
                  <b-table
                    v-if="data.item.files"
                    hover outlined small responsive show-empty
                    :fields="tables.files.fields"
                    :items="data.item.files"
                    :busy="tables.files.isBusy">
                    <template v-slot:cell(action)="row">
                      <b-button
                        @click="previewFile(row)"
                        size="sm" variant="secondary">
                        <v-icon
                          name="search"/>
                      </b-button>
                    </template>
                    <template v-slot:table-busy>
                      <div class="text-center my-2">
                        <v-icon
                          name="spinner"
                          spin
                          class="mr-2" />
                        <strong>Loading...</strong>
                      </div>
                    </template>
                  </b-table>
                </div> -->
              </b-card>
              <b-button
                v-if="
                  !isAccessible(
                    $options.StudentSubjectPermissions.DISAPPROVAL.id
                  )
                    ? false
                    : data.item.academicRecordStatusId ===
                      AcademicRecordStatuses.DRAFT.id
                "
                @click="setDisapproval(data)"
                class="float-right my-2 mr-2"
                variant="outline-danger"
                >Reject</b-button
              >
              <b-button
                v-if="
                  !isAccessible($options.StudentSubjectPermissions.APPROVAL.id)
                    ? false
                    : data.item.academicRecordStatusId ===
                      AcademicRecordStatuses.DRAFT.id
                "
                @click="setApproval(data)"
                class="float-right m-2"
                variant="outline-primary"
                >Approve</b-button
              >
            </b-overlay>
          </template>
        </b-table>
        <b-row>
          <b-col md="6">
            Showing {{ paginations.student.from }} to
            {{ paginations.student.to }} of
            {{ paginations.student.totalRows }} records.
          </b-col>
          <b-col md="6">
            <b-pagination
              class="c-pagination"
              v-model="paginations.student.page"
              :total-rows="paginations.student.totalRows"
              :per-page="paginations.student.perPage"
              size="sm"
              align="end"
              @input="loadAcademicRecord()"
            />
          </b-col>
        </b-row>
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
    <!-- </Card> -->

    <!-- Modal Preview -->
    <b-modal
      v-model="showModalPreview"
      size="xl"
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Preview
      </div>
      <!-- modal title -->
      <b-row class="justify-content-md-center">
        <!-- modal body -->
        <b-col md="12">
          <div v-if="file.src">
            <center>
              <b-img
                fluid
                v-if="file.type.substr(0, file.type.indexOf('/')) == 'image'"
                :src="file.src"
              />
              <b-embed
                v-else
                type="iframe"
                aspect="16by9"
                allowfullscreen
                :src="file.src"
              ></b-embed>
            </center>
          </div>
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          class="float-right"
          variant="outline-danger"
          @click="showModalPreview = false"
        >
          Close
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <!-- Modal Preview -->
    <!-- Modal Approval -->
    <b-modal
      v-model="showModalApproval"
      centered
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Finalize Approval
      </div>
      <!-- modal title -->
      <b-row>
        <!-- modal body -->
        <b-col md="12">
          <label>Notes</label>
          <b-textarea
            v-model="forms.applicationAdmission.fields.approvalNotes"
            rows="7"
          />
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button class="float-left" @click="showModalApproval = false">
          Cancel
        </b-button>
        <b-button
          @click="onApproval()"
          class="float-right"
          variant="outline-primary"
          :disabled="isProcessing"
        >
          <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
          Confirm
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <!-- Modal Approval -->
    <!-- Modal Reject -->
    <b-modal
      v-model="showModalRejection"
      centered
      header-bg-variant="danger"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Confirm Rejection
      </div>
      <!-- modal title -->
      <b-row>
        <!-- modal body -->
        <b-col md="12">
          <label>Reason</label>
          <b-textarea
            v-model="forms.applicationAdmission.fields.disapprovalNotes"
            rows="7"
          />
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button class="float-left" @click="showModalRejection = false">
          Cancel
        </b-button>
        <b-button
          @click="onDisapproval()"
          class="float-right"
          variant="outline-primary"
          :disabled="isProcessing"
        >
          <v-icon v-if="isProcessing" name="sync" class="mr-2" spin />
          Confirm
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <!-- Modal Reject -->
    <!-- Modal Subject -->
    <b-modal
      v-model="showModalSubjects"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
      size="xl"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Subjects
      </div>
      <!-- modal title -->
      <b-row>
        <!-- modal body -->
        <b-col md="12">
          <b-row class="mb-2">
            <b-col md="4">
              <!-- <b-form-select
                v-if="showDepartment"
                @change="filterByDepartment()"
                v-model="filters.subject.departmentId">
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Department --</b-form-select-option>
                </template>
                <b-form-select-option :value="null">None</b-form-select-option>
                <b-form-select-option
                  v-for="department in options.departments.items"
                  :key="department.id"
                  :value="department.id">
                  {{department.name}}
                </b-form-select-option>
              </b-form-select> -->
            </b-col>
            <b-col offset-md="4" md="4">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text"
                placeholder="Search"
                @update="loadSubjects()"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-table
            small
            hover
            outlined
            show-empty
            :items.sync="tables.subjects.items"
            :fields="tables.subjects.fields2"
            :busy="tables.subjects.isBusy2"
          >
            <template v-slot:cell(action)="row">
              <b-button @click="addSubject(row)" size="sm" variant="success">
                <v-icon name="plus" />
              </b-button>
            </template>
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.subject.from }} to
              {{ paginations.subject.to }} of
              {{ paginations.subject.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.subject.page"
                :total-rows="paginations.subject.totalRows"
                :per-page="paginations.subject.perPage"
                size="sm"
                align="end"
                @input="loadSubjects()"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          class="float-right"
          variant="outline-danger"
          @click="showModalSubjects = false"
        >
          Close
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <b-modal
      v-model="showModalSection"
      size="xl"
      header-bg-variant="success"
      header-text-variant="light"
      :noCloseOnEsc="true"
      :noCloseOnBackdrop="true"
    >
      <div slot="modal-title">
        <!-- modal title -->
        Select Section
      </div>
      <!-- modal title -->
      <b-row class="justify-content-md-center">
        <!-- modal body -->
        <b-col md="12">
          <b-table
            class="c-app__table"
            small
            hover
            outlined
            show-empty
            :items.sync="tables.sectionsOfSubjects.items"
            :fields="tables.sectionsOfSubjects.fields"
            :busy="tables.sectionsOfSubjects.isBusy"
            :current-page="paginations.sectionsOfSubject.page"
            :per-page="paginations.sectionsOfSubject.perPage"
          >
            <template v-slot:table-busy>
              <div class="text-center my-2">
                <v-icon name="spinner" spin class="mr-2" />
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(schedule)="row">
              <span>
                {{ row.item.schedules[0].personnel.name }}
              </span>
              <br />
              <span
                v-for="schedule in row.item.schedules"
                :key="schedule.id"
                class="item"
              >
                <small>{{
                  `${days.getEnum(schedule.dayId).abbrev} - Time: ${
                    schedule.startTime
                  } - ${schedule.endTime}`
                }}</small>
              </span>
            </template>
            <template v-slot:cell(action)="row">
              <b-button @click="onChangeSection(row)" variant="success">
                <v-icon name="check" />
              </b-button>
            </template>
          </b-table>
          <b-row>
            <b-col md="6">
              Showing {{ paginations.sectionsOfSubject.from }} to
              {{ paginations.sectionsOfSubject.to }} of
              {{ paginations.sectionsOfSubject.totalRows }} records.
            </b-col>
            <b-col md="6">
              <b-pagination
                v-model="paginations.sectionsOfSubject.page"
                :total-rows="paginations.sectionsOfSubject.totalRows"
                :per-page="paginations.sectionsOfSubject.perPage"
                size="sm"
                align="end"
                @input="recordDetails(paginations.sectionsOfSubject)"
              />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <!-- modal body -->
      <div slot="modal-footer" class="w-100">
        <!-- modal footer buttons -->
        <b-button
          class="float-right"
          variant="outline-danger"
          @click="showModalSection = false"
        >
          Close
        </b-button>
      </div>
      <!-- modal footer buttons -->
    </b-modal>
    <div v-if="showModalPreview" class="preview__modal-description">
      <div class="mx-auto">
        Filename : {{ file.name }}<br />
        Notes : {{ file.notes }}
      </div>
    </div>
    </template>
    <!-- Modal Subject -->
  </PageContent>
  <!-- main container -->
</template>
<script>
import {
  StudentApi,
  CourseApi,
  AcademicRecordApi,
  AdmissionFileApi,
  SubjectApi,
  DepartmentApi,
  SectionApi,
  SchoolYearApi
} from '../../mixins/api';
import {
  SchoolCategories,
  ApplicationStatuses,
  AcademicRecordStatuses,
  StudentFeeStatuses,
  Days,
  UserGroups,
  StudentSubjectPermissions,
} from '../../helpers/enum';
import { showNotification, formatNumber } from '../../helpers/forms';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import Tables from '../../helpers/tables';
import Access from '../../mixins/utils/Access';
import Card from '../components/Card';
import AvatarMaker from '../components/AvatarMaker';
import ActiveRowViewer from '../components/ActiveRowViewer/ActiveRowViewer';
import ActiveViewHeader from '../components/ActiveRowViewer/ActiveViewHeader';
import ActiveViewItems from '../components/ActiveRowViewer/ActiveViewItems';
import ActiveViewItem from '../components/ActiveRowViewer/ActiveViewItem';
import ActiveViewLinks from '../components/ActiveRowViewer/ActiveViewLinks';
import AttachmentList from '../components/Attachment/AttachmentList';
import { StudentColumn,AddressColumn , EducationColumn } from '../components/ColumnDetails';
import PageContent from "../components/PageContainer/PageContent";
import FilterButton from '../components/PageContainer/FilterButton';
import NoAccess from "../components/NoAccess";


const acdemicRecordFields = {
  academicRecordStatusId: null,
  sectionId: null,
};

const studentFeeFields = {
  schoolYearId: null,
  semesterId: null,
  levelId: null,
  courseId: null,
  academicRecordId: null,
  studentFeeStatusId: null,
};

const applicationAdmissionFields = {
  approvalNotes: null,
  disapprovalNotes: null,
};

export default {
  name: 'Student',
  mixins: [
    StudentApi,
    CourseApi,
    AcademicRecordApi,
    AdmissionFileApi,
    SubjectApi,
    DepartmentApi,
    SectionApi,
    Tables,
    Access,
    SchoolYearApi
  ],
  components: {
    SchoolCategoryTabs,
    Card,
    AvatarMaker,
    StudentColumn,
    EducationColumn,
    ActiveRowViewer,
    ActiveViewHeader,
    ActiveViewItems,
    ActiveViewItem,
    PageContent,
    FilterButton,
    NoAccess,
    AddressColumn
  },
  StudentSubjectPermissions,
  data() {
    return {
      isFilterVisible: true,
      showModalPreview: false,
      showModalApproval: false,
      showModalRejection: false,
      showModalSubjects: false,
      showModalSection: false,
      isLoading: false,
      AcademicRecordStatuses: AcademicRecordStatuses,
      changeSection: false,
      days: Days,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
      },
      forms: {
        academicRecord: {
          fields: { ...acdemicRecordFields },
          states: { ...acdemicRecordFields },
          errors: { ...acdemicRecordFields },
        },
        studentFee: {
          fields: { ...studentFeeFields },
        },
        applicationAdmission: {
          fields: { ...applicationAdmissionFields },
        },
        subjects: [],
      },
      tables: {
        students: {
          isBusy: false,
          isBusy2: false, //isbusy state of modal subjects
          filterIncludedFields: ['firstName', 'lastName'],
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: '25%' },
              // formatter: (value, key, item) => {
              // 	if(!item.student.middleName){
              // 		item.student.middleName = ""
              // 	}
              // 	item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
              // }
            },
            {
            	key: "address",
            	label: "ADDRESS",
            	tdClass: "align-middle",
            	thStyle: { width: '30%' },

            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: '30%' },
            },
            {
              key: 'status',
              label: 'Status',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '40px' },
            },
          ],
          items: [],
        },
        subjects: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right text-center',
              thStyle: { width: '8%' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            // {
            // 	key: "amountPerLab",
            // 	label: "Amount per Lab",
            // 	tdClass: "align-middle text-right",
            // 	thClass: "text-right",
            // 	thStyle: {width: "13%"}
            // },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'section',
              label: 'Section',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          fields2: [
            {
              key: 'name',
              label: 'Subject Code',
              tdClass: 'align-middle',
              thStyle: { width: '12%' },
            },
            {
              key: 'description',
              label: 'Description',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right text-center',
              thStyle: { width: '8%' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '12%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
          filteredItems: [],
        },
        files: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'Filename',
              tdClass: 'align-middle',
              thStyle: { width: '40%' },
            },
            {
              key: 'notes',
              label: 'Notes',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '35px' },
            },
          ],
          items: [],
        },
        sectionsOfSubjects: {
          isBusy: false,
          fields: [
            {
              key: 'name',
              label: 'SECTION',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'level.name',
              label: 'LEVEL',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'course.name',
              label: 'COURSE',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'semester.name',
              label: 'SEMESTER',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'schedule',
              label: 'SCHEDULE',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: 'AUTO' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
        },
        scheduledSubjects: {
          isBusy: false,
          fields: [
            {
              key: 'isAllowed',
              label: 'Allowed',
              thClass: 'align-middle',
              tdClass: 'align-middle text-center',
              thStyle: { width: '25px' },
            },
            {
              key: 'subject',
              label: 'SUBJECT',
              tdClass: 'align-middle ',
              thClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'schedule',
              label: 'SCHEDULE',
              tdClass: 'align-middle',
              thClass: 'align-middle',
              thStyle: { width: 'auto', minWidth: '500px' },
            },
            {
              key: 'units',
              label: 'Lec Units',
              tdClass: 'align-middle text-right',
              thClass: 'align-middle text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'labs',
              label: 'Lab Units',
              tdClass: 'align-middle text-right',
              thClass: 'align-middle text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'totalUnits',
              label: 'TOTAL UNITS',
              tdClass: 'align-middle text-right',
              thClass: 'text-right',
              thStyle: { width: '8%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          items: [],
        },
      },
      paginations: {
        student: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        subject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        scheduledSubject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
        sectionsOfSubject: {
          from: 0,
          to: 0,
          totalRows: 0,
          page: 1,
          perPage: 10,
        },
      },
      filters: {
        student: {
          criteria: null,
          schoolCategoryId: 0,
          schoolCategoryItem: null,
          courseItem: null,
          courseId: null,
          academicRecordStatusId: AcademicRecordStatuses.DRAFT.id,
          academicRecordStatusItem: AcademicRecordStatuses.DRAFT
        },
        subject: {
          criteria: null,
          schoolCategoryId: null,
          departmentId: null,
        },
        scheduledSubject: {
          criteria: null,
          levelId: null,
          courseId: null,
          semesterId: null,
          sectionId: null,
          schoolCategory: null,
        },
        sectionsOfSubject: {
          criteria: null,
        },
      },
      options: {
        courses: {
          items: [],
        },
        departments: {
          items: [],
        },
        schoolCategories: SchoolCategories,
        sections: {
          items: [],
        },
        schoolYears: {
          items: []
        }
      },
      isProcessing: false,
      showDepartment: false,
      schoolCategoryId: null,
      studentSubjects: [],
      row: [],
      selectedLevelSubject: null,
    };
  },
  created() {
    // this.checkRights()
    const { student } = this.filters
    if (!this.checkIfSuperUser()) {
      student.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      student.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }

    this.loaSchoolYears();
    this.loadCourseList();
    // this.loadDepartmentList()
    this.loadSections();
    // this.filters.student.academicRecordStatusId = this.AcademicRecordStatuses.DRAFT.id
    // this.filters.student.academicRecordStatusItem = this.AcademicRecordStatuses.DRAFT
    this.loadAcademicRecord()
  },
  methods: {
    loaSchoolYears() {
      const params = { paginate: false}
      const { schoolYears } = this.options
      this.getSchoolYearList(params).then(({data}) => {
        schoolYears.items = data
      })
    },
    setApproval(row) {
      this.forms.applicationAdmission.fields.approvalNotes = null;
      if (!row.item.subjects) {
        const { id: academicRecordId } = row.item;
        const params = { paginate: false };
        this.getSubjectsOfAcademicRecord(academicRecordId, params).then(
          ({ data }) => {
            this.$set(row.item, 'subjects', data);
            this.$set(row.item, 'isBusy', false);
            this.row = row.item;
            this.showModalApproval = true;
          }
        );
      } else {
        this.row = row.item;
        this.showModalApproval = true;
      }
    },
    onApproval() {
      const { id: academicRecordId, applicationId, admissionId } = this.row;

      const {
        applicationAdmission: { fields: application },
        applicationAdmission: { fields: admission },
        academicRecord: { fields: academicRecord },
        studentFee: { fields: studentFee },
      } = this.forms;

      const applicationAdmission = [{ application }, { admission }];

      const index = applicationId ? 0 : 1;

      let subjects = this.row.subjects.map((subject) => {
        const {
          id: subjectId,
          pivot: { sectionId },
        } = subject;
        return { subjectId, sectionId };
      });

      (studentFee.schoolYearId = this.row.schoolYearId),
        (studentFee.semesterId = this.row.semesterId),
        (studentFee.levelId = this.row.levelId),
        (studentFee.courseId = this.row.courseId),
        (studentFee.studentFeeStatusId = StudentFeeStatuses.DRAFT.id);
      studentFee.academicRecordId = academicRecordId;

      academicRecord.academicRecordStatusId =
        AcademicRecordStatuses.FINALIZED.id;
      academicRecord.sectionId = this.row.sectionId;

      const data = {
        ...applicationAdmission[index],
        studentFee,
        ...academicRecord,
        subjects,
      };

      this.isProcessing = true;
      this.updateAcademicRecord(data, academicRecordId)
        .then(({ data }) => {
          this.row.academicRecordStatusId = AcademicRecordStatuses.FINALIZED.id;
          this.isProcessing = false;
          this.showModalApproval = false;
          showNotification(this, 'success', 'Approved Successfully.');
          this.loadAcademicRecord();
          this.$store.state.approvalCount.enlistment--;
        })
        .catch((error) => {
          const errors = error.response.data.errors;
          // if (errors['sectionId']) {
          // 	showNotification(this, "danger", 'Section is required.')
          // 	this.showModalApproval = false
          // }
          this.isProcessing = false;
        });
    },
    setDisapproval(row) {
      this.forms.applicationAdmission.fields.disapprovalNotes = null;
      this.row = row.item;
      this.showModalRejection = true;
    },
    onDisapproval() {
      this.isProcessing = true;
      const { id: academicRecordId, applicationId, admissionId } = this.row;

      const {
        applicationAdmission: { fields: application },
        applicationAdmission: { fields: admission },
        academicRecord: { fields: academicRecord },
      } = this.forms;

      const data = applicationId
        ? {
            application: {
              ...application,
              applicationStatusId: ApplicationStatuses.REJECTED.id,
              applicationStepId: this.row.application.applicationStepId - 1,
            },
          }
        : {
            admission: {
              ...admission,
              applicationStatusId: ApplicationStatuses.REJECTED.id,
              admissionStepId: this.row.admission.admissionStepId - 1,
            },
          };

      this.updateAcademicRecord(data, academicRecordId)
        .then(({ data }) => {
          this.loadAcademicRecord();
          this.isProcessing = false;
          this.showModalRejection = false;
          showNotification(this, 'success', 'Rejected Successfully.');
        })
        .catch((error) => {
          console.log(error);
          this.isProcessing = false;
        });
    },
    loadAcademicRecord() {
      const { students } = this.tables;
      const {
        student,
        student: { perPage, page },
      } = this.paginations;
      students.isBusy = true;
      const {
        academicRecordStatusId,
        schoolCategoryId,
        courseId,
        criteria,
      } = this.filters.student;
      const notApplicationStatusId = ApplicationStatuses.DRAFT.id;
      const orderBy = 'updated_at';
      const sort = 'DESC';
      let params = {
        paginate: true,
        perPage,
        page,
        academicRecordStatusId,
        schoolCategoryId,
        courseId,
        notApplicationStatusId,
        schoolYearId: this.$store.state.schoolYear.id,
        orderBy,
        sort,
        criteria,
      };
      this.getAcademicRecordList(params).then((response) => {
        const res = response.data;
        students.items = res.data;
        student.from = res.meta.from;
        student.to = res.meta.to;
        student.totalRows = res.meta.total;
        students.isBusy = false;
        this.forms.academicRecord.sectionId = res.data.sectionId;
      });
    },
    loadDepartmentList() {
      let params = { paginate: false };
      const { departments } = this.options;
      this.getDepartmentList(params).then(({ data }) => {
        departments.items = data;
      });
    },
    loadCourseList() {
      let params = { paginate: false };
      this.getCourseList(params).then((response) => {
        const res = response.data;
        this.options.courses.items = res;
      });
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
        const { id: academicRecordId, admissionId } = row.item;

        const params = { paginate: false };

        this.isLoading = true;
        this.tables.subjects.isBusy = true;
        this.getSubjectsOfAcademicRecord(academicRecordId, params).then(
          ({ data }) => {
            this.$set(row.item, 'subjects', data);
            this.isLoading = false;
            this.tables.subjects.isBusy = false;
          }
        );

        // if (admissionId) {
        // 	this.isLoading = true
        // 	this.getAdmissionFileList(admissionId, params)
        // 		.then(({ data }) => {
        // 			this.$set(row.item, 'files', data)
        // 			this.isLoading = false
        // 	})
        // }
      }
      row.toggleDetails();
    },
    getName(item, child) {
      if (item) {
        let value = item[child];
        if (value) {
          return value['name'];
        }
      }
      return '';
    },
    previewFile(row) {
      const { admissionId, id, name, notes } = row.item;
      this.file.type = null;
      this.file.src = null;
      this.file.name = name;
      this.file.notes = notes;
      this.getAdmissionFilePreview(admissionId, id).then((response) => {
        this.file.type = response.headers.contentType;
        const file = new Blob([response.data], {
          type: response.headers.contentType,
        });
        const reader = new FileReader();

        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.showModalPreview = true;
      });
    },
    loadSubjects() {
      const { subjects } = this.tables;
      const { criteria, schoolCategoryId } = this.filters.subject;
      const {
        subject,
        subject: { perPage, page },
      } = this.paginations;
      subjects.items = [];

      if (
        [
          SchoolCategories.SENIOR_HIGH_SCHOOL.id,
          SchoolCategories.COLLEGE.id,
          SchoolCategories.GRADUATE_SCHOOL.id,
        ].includes(schoolCategoryId)
      ) {
        this.showDepartment = true;
      }

      subjects.isBusy2 = true;
      let params = {
        paginate: true,
        schoolCategoryId,
        perPage,
        page,
        criteria,
      };

      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data.data;
        subject.from = data.meta.from;
        subject.to = data.meta.to;
        subject.totalRows = data.meta.total;
        subjects.isBusy2 = false;
      });
    },
    loadSections() {
      let params = { paginate: false };
      this.getSectionList(params).then(({ data }) => {
        this.options.sections.items = data;
      });
    },
    onAddSubject(row) {
      this.studentSubjects = row.subjects;
      this.showModalSubjects = true;
      this.showDepartment = false;
      this.filters.subject.criteria = null;
      this.filters.subject.schoolCategoryId = row.schoolCategoryId;
      this.loadSubjects();
    },
    addSubject(row) {
      const { item } = row;
      // check if subject exist in the table
      const result = this.studentSubjects.find(
        (subject) => subject.id === item.id
      );
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      this.$set(item, 'pivot', {});
      this.$set(item.pivot, 'sectionId', null);
      this.studentSubjects.push(item);
    },
    removeSubject(subjects, row) {
      subjects.splice(row.index, 1);
    },
    checkRights() {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      let result = false;
      if (userGroup) {
        this.filters.student.schoolCategoryId = userGroup.schoolCategoryId;
        this.schoolCategoryId = userGroup.schoolCategoryId;
      }
      this.loadAcademicRecord();
    },
    // filterByDepartment() {
    //   const { subjects } = this.tables
    //   const { subject } = this.paginations
    //   const { departmentId } = this.filters.subject
    //   if (departmentId) {
    //     subjects.filteredItems = subjects.items.filter(s => s.departmentId === departmentId)
    //   }
    //   else {
    //     subjects.filteredItems = subjects.items
    //   }
    //   this.onFiltered(subjects.filteredItems, subject)
    // },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    filterSection(data) {
      const sect = this.options.sections.items.filter(
        (s) =>
          s.schoolYearId === data.item.schoolYearId &&
          s.levelId === data.item.levelId &&
          s.courseId === data.item.courseId &&
          s.semesterId === data.item.semesterId
      );
      return sect;
    },
    onShowModalSection(subject, data) {
      this.showModalSection = true;
      const { sectionsOfSubjects } = this.tables;
      const { sectionsOfSubject } = this.paginations;
      const { id: subjectId } = subject;
      const { schoolYearId } = data.item;

      this.selectedLevelSubject = null;
      this.selectedLevelSubject = subject;

      const params = { paginate: false, subjectId, schoolYearId };
      sectionsOfSubjects.isBusy = true;

      this.getSectionsOfSubject(params, subjectId)
        .then(({ data }) => {
          sectionsOfSubjects.items = data;
          sectionsOfSubject.totalRows = data.length;
          this.recordDetails(sectionsOfSubject);
          sectionsOfSubjects.isBusy = false;
        })
        .catch((error) => {
          sectionsOfSubjects.isBusy = false;
        });
    },
    onSectionSubjectClear(row) {
      this.$set(row.item.pivot, 'sectionId', null);
      this.$set(row.item, 'section', null);
    },
    onChangeSection(row) {
      // const { subjects } = this.tables
      this.$set(this.selectedLevelSubject.pivot, 'sectionId', row.item.id);
      this.$set(this.selectedLevelSubject, 'section', {
        id: row.item.id,
        name: row.item.name,
      });
      this.showModalSection = false;
    },
    prePopulateStudentSubjects(row) {
      const {
        item,
        item: { curriculumId, sectionId },
      } = row;
      const params = { paginate: false, curriculumId };
      const { subjects } = this.tables;
      subjects.isBusy = true;
      this.changeSection = false;

      if (!sectionId) {
        subjects.subjects = [];
        item.isBusy = false;
        return;
      }

      this.getSectionScheduledSubjectsWithStatus(params, sectionId).then(
        ({ data }) => {
          const allowedSubjects = data.filter((s) => s.isAllowed === true);
          item.subjects = allowedSubjects;
          const section = this.options.sections.items.find(
            (s) => s.id === sectionId
          );
          item.subjects.forEach((item) => {
            this.$set(item, 'pivot', {});
            this.$set(item.pivot, 'sectionId', section ? section.id : null);
            this.$set(item, 'section', section ? section : null);
          });
          subjects.isBusy = false;
        }
      );
    },
    onCategoryFilterChange(item) {
      const { student } = this.filters;
      student.schoolCategoryId = item?.id || 0;
      student.schoolCategoryItem = item;
      this.loadAcademicRecord();
    },
    onStatusFilterChange(item) {
      const { student } = this.filters;
      student.academicRecordStatusId = item?.id || 0;
      student.academicRecordStatusItem = item;
      this.loadAcademicRecord();
    },
    onCourseFilterChange(item) {
      const { student } = this.filters;
      student.courseId = item?.id || 0;
      student.courseItem = item;
      this.loadAcademicRecord();
    },
  },
  computed: {
    totalUnits() {
      return (subjects, field) => {
        let units = 0;
        subjects.forEach((s) => {
          units += Number(s[field]);
        });
        return units;
      };
    },
    isCourseVisible() {
      const { schoolCategoryId } = this.filters.student;
      const { schoolCategories } = this.options;
      return [
        schoolCategories.SENIOR_HIGH_SCHOOL.id,
        schoolCategories.COLLEGE.id,
        schoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    },
    // selectedSchoolYear() {
    //   const { schoolYearId } = this.$store.state
    //   const { schoolYears } = this.options
    //   return schoolYears.items.find(sy => sy.id ===  schoolYearId)
    // }
  },
  watch: {
    '$store.state.schoolYear': function(newVal) {
      this.loadAcademicRecord();
    },
  },
};
</script>
<style scoped lang="scss">
@import '../../assets/scss/shared.scss';

.preview__modal-description {
  z-index: 5000;
  position: fixed;
  height: 50px;
  background-color: white;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 30px;
}
.details__section-button-container {
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  @include for-size(phone-only) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.add-subject-button {
  width: 175px;

  @include for-size(phone-only) {
    width: 100%;
  }
}

.section__container {
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 10px;

  label {
    margin-right: 10px;
  }

  .section-select {
    width: 200px;
  }

  @include for-size(phone-only) {
    flex-direction: column;
    align-items: flex-start;
    margin-right: 0;
    margin-bottom: 10px;
    width: 100%;

    .section-select {
      width: 100%;
    }
  }
}
</style>
