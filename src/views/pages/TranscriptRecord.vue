<template>
  <PageContent title="Transcripts"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadTranscriptRecords"
    :filterVisible="isFilterVisible"
    @create="setCreate()"
    :createButtonVisible="false">
    <template v-slot:extra-buttons>
      <button 
        @click="$router.push({path: `/registrar/student-grade`})"
        class="for-approval-button">
        For Approval {{studentGradeCount > 0 ? `(${studentGradeCount})` : ''}}
      </button>
    </template>
    <template v-slot:filters>
      <b-form-input
        v-model="filters.transcriptRecord.criteria"
        debounce="500"
        type="text"
        placeholder="Search"
        @update="loadTranscriptRecords"
      />
      <!--<v-select
        :options="$options.SchoolCategories.values"
        :value="filters.transcriptRecord.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
        :searchable="checkIfAllowedAll() || checkIfSuperUser()"
        :selectable="option =>  checkIfSuperUser() || isAccessibleSchoolCategory(option.id)"
        :clearable="checkIfAllowedAll()"
      />-->
      <SelectCategory
        :value="filters.transcriptRecord.schoolCategoryItem"
        @input="onCategoryFilterChange"
        label="name"
        placeholder="School Category"
        class="mt-2"
      />
      <v-select
        :options="options.levels.items"
        :value="filters.transcriptRecord.levelItem"
        @input="onLevelFilterChange"
        label="name"
        placeholder="Level"
        class="mt-2"
      />
      <v-select
        v-if="isCourseVisible"
        :options="options.courses.items"
        :value="filters.transcriptRecord.courseItem"
        @input="onCourseFilterChange"
        label="name"
        placeholder="Course"
        class="mt-2"
      />
      <v-select
        :options="$options.TranscriptRecordStatuses.values"
        :value="filters.transcriptRecord.transcriptRecordStatusItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <!-- <div>
        <SchoolCategoryTabs
          :showAll="true"
          @loadSchoolCategoryId="
            (filters.transcriptRecord.schoolCategoryId = $event), loadLevels();
            loadTranscriptRecords();
          "
          @clickAll="
            (filters.transcriptRecord.schoolCategoryId = null),
              (filters.transcriptRecord.courseId = null),
              loadTranscriptRecords()
          "
          @click="
            (filters.transcriptRecord.schoolCategoryId = $event),
              (filters.transcriptRecord.courseId = null),
              loadCourses();
            loadTranscriptRecords();
          "
        />
        <div> -->
          <!-- <b-row class="mb-2">
            <b-col md="3">
              <b-form-radio-group
                @input="loadTranscriptRecords()"
                v-model="filters.transcriptRecord.transcriptRecordStatusId"
              >
                <b-form-radio :value="null">All</b-form-radio>
                <b-form-radio
                  v-for="status in $options.TranscriptRecordStatuses.values"
                  v-if="
                    status.id !== $options.TranscriptRecordStatuses.PENDING.id
                  "
                  :value="status.id"
                  :key="status.id"
                >
                  {{ status.name }}
                </b-form-radio>
              </b-form-radio-group>
            </b-col>
            <b-col md="3">
              <b-form-select
                @change="loadTranscriptRecords()"
                v-model="filters.transcriptRecord.levelId"
              >
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled
                    >-- Level --</b-form-select-option
                  >
                </template>
                <b-form-select-option :value="null">None</b-form-select-option>
                <b-form-select-option
                  v-for="level in options.levels.items.filter((l) =>
                    filters.transcriptRecord.schoolCategoryId
                      ? l.schoolCategoryId ===
                        filters.transcriptRecord.schoolCategoryId
                      : true
                  )"
                  :key="level.id"
                  :value="level.id"
                >
                  {{ level.name }}
                </b-form-select-option>
              </b-form-select>
            </b-col>
            <b-col md="3">
              <b-form-select
                v-if="
                  filters.transcriptRecord.schoolCategoryId ===
                    $options.SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
                    filters.transcriptRecord.schoolCategoryId ===
                      $options.SchoolCategories.COLLEGE.id ||
                    filters.transcriptRecord.schoolCategoryId ===
                      $options.SchoolCategories.GRADUATE_SCHOOL.id ||
                    filters.transcriptRecord.schoolCategoryId ===
                      $options.SchoolCategories.VOCATIONAL.id
                "
                @change="loadTranscriptRecords()"
                v-model="filters.transcriptRecord.courseId"
                class="float-right"
                :disabled="options.courses.isLoading"
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
                v-model="filters.transcriptRecord.criteria"
                debounce="500"
                @update="loadTranscriptRecords()"
                type="text"
                placeholder="Search"
              >
              </b-form-input>
            </b-col>
          </b-row> -->
          <!-- row button and search input -->
      <div v-if="checkIfHasSchoolCategoryAccess()">
        <b-table
          class="c-table"
          outlined
          small
          show-empty
          responsive
          :fields="tables.transcriptRecords.fields"
          :items="tables.transcriptRecords.items"
          :busy="tables.transcriptRecords.isBusy"
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
          <template v-slot:cell(curriculum)="data">
            <CurriculumColumn :data="data.item" />
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item" />
          </template>
          <template v-slot:cell(status)="data">
            <b-badge
              :variant="
                data.item.transcriptRecordStatusId ===
                $options.TranscriptRecordStatuses.FINALIZED.id
                  ? 'success'
                  : 'warning'
              "
            >
              {{
                $options.TranscriptRecordStatuses.getEnum(
                  data.item.transcriptRecordStatusId
                ).name
              }}
            </b-badge>
          </template>
          <template v-slot:cell(action)="row">
            <b-dropdown
              v-if="
                isAccessible([
                  $options.TranscriptRecordPermissions.PRINT.id,
                  $options.TranscriptRecordPermissions.REVIEW.id,
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
              <!-- v-if="isAccessible($options.StudentPermissions.UPDATE_ACADEMIC_RECORDS.id)" -->
              <b-dropdown-item
                v-if="
                  row.item.transcriptRecordStatusId ===
                    $options.TranscriptRecordStatuses.FINALIZED.id &&
                    isAccessible(
                      $options.TranscriptRecordPermissions.PRINT.id
                    )
                "
                @click.prevent="printTranscriptRecord(row.item.id)"
              >
                Print
              </b-dropdown-item>
              <b-dropdown-item
                v-if="
                  row.item.transcriptRecordStatusId !==
                    $options.TranscriptRecordStatuses.FINALIZED.id &&
                    isAccessible(
                      $options.TranscriptRecordPermissions.REVIEW.id
                    )
                "
                @click.prevent="loadDetails(row)"
              >
                Review Record
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:row-details="data">
            <ActiveRowViewer
              :isBusy="data.item.isLoading"
              backTitle="Go back to list"
              @onBack="data.toggleDetails()"
              :showOptions="
                data.item.transcriptRecordStatusId ===
                  $options.TranscriptRecordStatuses.DRAFT.id
              "
              :options="[
                {
                  label: 'Update',
                  callback: () => onUpdateTranscriptRecord(data),
                  isAllowed: true,
                },
                {
                  label: 'Finalized',
                  callback: () => onUpdateTranscriptRecord(data, true),
                  isAllowed: true,
                },
                {
                  label: 'Cancel',
                  callback: () => data.toggleDetails(),
                  isAllowed: true,
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
                  <!-- <p class="active-view__header-date">
                    <BIconAlarm />
                    {{
                      $options.format(
                        new Date(data.item.submittedDate),
                        'MMMM dd, yyyy'
                      )
                    }}
                  </p> -->
                </div>
              </template>

              <template v-slot:navigation>
                <ActiveViewLinks
                  :items="[
                    {
                      text: 'Student Information',
                      target: 'header-student-information',
                    },
                    {
                      text: 'Transcript Information',
                      target: 'header-transcript-information',
                    },
                    {
                      text: 'Subjects Information',
                      target: 'header-subjects-information',
                    },
                  ]"
                />
              </template>

              <template v-slot:content>
                <div>
                  <ActiveViewHeader
                    id="header-student-information"
                    title="Student Information"
                    circleText="1"
                  />

                  <ActiveViewItems>
                    <ActiveViewItem label="Student Number:">
                      <p>
                        {{
                          data.item.student.studentNo
                            ? data.item.student.studentNo
                            : 'Awaiting Confirmation'
                        }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Name:">
                      <p>
                        {{ data.item.student.name }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem
                      v-if="!!data.item.student.email"
                      label="Email:"
                    >
                      <p>
                        {{ data.item.student.email }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem
                      v-if="!!data.item.student.mobileNo"
                      label="Mobile Number:"
                    >
                      <p>
                        {{ data.item.student.mobileNo }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Address:">
                      <p>
                        {{
                          data.item.student.currentAddress ||
                          data.item.student.address
                            ? data.item.student.address.currentCompleteAddress
                            : ''
                        }}
                      </p>
                    </ActiveViewItem>
                    <!-- <ActiveViewItem label="Category:">
                      <p>
                        <b-badge
                          :variant="
                            data.item.studentCategoryId ===
                            studentCategories.NEW.id
                              ? 'success'
                              : data.item.studentCategoryId ===
                                studentCategories.OLD.id
                              ? 'primary'
                              : 'warning'
                          "
                        >
                          {{ data.item.studentCategory.name }}
                        </b-badge>
                      </p>
                    </ActiveViewItem> -->
                  </ActiveViewItems>
                </div>

                <div>
                  <ActiveViewHeader
                    id="header-transcript-information"
                    title="Transcript Information"
                    circleText="2"
                  />

                  <ActiveViewItems>
                    <ActiveViewItem label="Curriculum:">
                      <!-- v-if="!data.item.studentCurriculumEdit" -->
                      <div class="mb-3">
                        <span
                          :class="
                            `font-weight-bold ${
                              !data.item.studentCurriculum
                                ? 'text-danger'
                                : ''
                            }`
                          "
                        >
                          {{
                            data.item.studentCurriculum
                              ? data.item.studentCurriculum.name
                              : 'Nothing is Set'
                          }} </span
                        >&nbsp;
                        <!-- <b-link
                          v-if="
                            data.item.transcriptRecordStatusId ===
                              $options.TranscriptRecordStatuses.DRAFT.id
                          "
                          @click="
                            data.item.studentCurriculumEdit = !data.item
                              .studentCurriculumEdit
                          "
                        >
                          [Set Curriculum]
                        </b-link> -->
                      </div>
                      <!-- <div v-else class="w-75 ml-2 mb-3">
                        <b-form-select
                          @change="
                            loadStudentCurriculum($event, data),
                              (data.item.studentCurriculumEdit = !data.item
                                .studentCurriculumEdit)
                          "
                          v-model="data.item.studentCurriculumId"
                        >
                          <template v-slot:first>
                            <b-form-select-option :value="null" disabled
                              >-- Curriculum --</b-form-select-option
                            >
                          </template>
                          <b-form-select-option
                            v-for="curriculum in data.item.curriculums"
                            :key="curriculum.id"
                            :value="curriculum.id"
                          >
                            {{ curriculum.name }}
                          </b-form-select-option>
                        </b-form-select>
                      </div> -->
                    </ActiveViewItem>
                    <ActiveViewItem v-if="data.item.course" label="Course:">
                      <!-- v-if="!data.item.studentCourseEdit" -->
                      <div class="mb-3">
                        <span>
                          {{
                            data.item.course
                              ? data.item.course.description
                              : ''
                          }}
                          {{
                            data.item.course && data.item.course.major
                              ? ' - ' + data.item.course.major
                              : ''
                          }} </span
                        >&nbsp;&nbsp;
                        <!-- <b-link
                          v-if="
                            data.item.transcriptRecordStatusId ===
                              $options.TranscriptRecordStatuses.DRAFT.id
                          "
                          @click="
                            data.item.studentCourseEdit = !data.item
                              .studentCourseEdit
                          "
                        >
                          [Change Course]
                        </b-link> -->
                      </div>
                      <!-- <div v-else class="w-75 ml-2 mb-3">
                        <b-form-select
                          @change="onChangeCourse(data)"
                          v-model="data.item.courseId"
                          class="float-right"
                        >
                          <template v-slot:first>
                            <b-form-select-option :value="null" disabled
                              >-- Course --</b-form-select-option
                            >
                          </template>
                          <b-form-select-option :value="null"
                            >None</b-form-select-option
                          >
                          <b-form-select-option
                            v-for="course in options.courses.items"
                            :key="course.id"
                            :value="course.id"
                          >
                            {{ course.description }}
                            {{ course.major ? `(${course.major})` : '' }}
                          </b-form-select-option>
                        </b-form-select>
                      </div> -->
                    </ActiveViewItem>
                    <ActiveViewItem label="Level:">
                      <p>
                        {{ getName(data.item, 'level') }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem
                      v-if="data.item.semesterId"
                      label="Semester:"
                    >
                      <p>
                        {{ semesters.getEnum(data.item.semesterId).name }}
                      </p>
                    </ActiveViewItem>
                    <!-- <ActiveViewItem label="Date Submitted:">
                      <p>
                        {{
                          $options.format(
                            new Date(data.item.submittedDate),
                            'MMMM dd, yyyy'
                          )
                        }}
                      </p>
                    </ActiveViewItem> -->
                  </ActiveViewItems>
                </div>

                <!-- <div class="p-4" v-if="data.item.files">
                  <b-table
                    outlined responsive show-empty
                    :fields="tables.files.fields"
                    :items="data.item.files"
                    :busy="tables.files.isBusy">
                    <template v-slot:cell(action)="row">
                      <b-button
                        @click="previewFile(row, data)"
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

                <div>
                  <ActiveViewHeader
                    id="header-subjects-information"
                    title="Subjects Information"
                    circleText="3"
                  />

                  <b-row class="mb-3 text-center">
                    <b-col md="12">
                      <h5>Transcript of Records</h5>
                      <!-- v-if="!data.item.curriculumEdit" -->
                      <div
                        :class="!data.item.curriculum ? 'text-danger' : ''"
                      >
                        <b>{{
                          data.item.curriculum
                            ? data.item.curriculum.name
                            : 'Nothing is Set'
                        }}</b
                        >&nbsp;
                        <!-- <b-link
                          v-if="
                            !data.item.curriculumMsg &&
                              data.item.transcriptRecordStatusId ===
                                $options.TranscriptRecordStatuses.DRAFT.id
                          "
                          @click="
                            data.item.curriculumEdit = !data.item
                              .curriculumEdit
                          "
                        >
                          [Change]
                        </b-link> -->
                      </div>
                      <!-- <b-form-select
                        class="w-50"
                        v-else
                        @change="
                          loadCurriculum($event, data),
                            (data.item.curriculumEdit = !data.item
                              .curriculumEdit)
                        "
                        v-model="data.item.curriculumId"
                      >
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled
                            >-- Curriculum --</b-form-select-option
                          >
                        </template>
                        <b-form-select-option
                          v-for="curriculum in data.item.curriculums"
                          :key="curriculum.id"
                          :value="curriculum.id"
                        >
                          {{ curriculum.name }}
                        </b-form-select-option>
                      </b-form-select> -->
                    </b-col>
                  </b-row>
                  <div v-if="data.item.subjects">
                    <b-row v-if="data.item.courseId === null">
                      <b-col md="12">
                        <b-row>
                          <b-col md="9">
                            <h5>{{ getName(data.item, 'level') }}</h5>
                          </b-col>
                          <b-col md="3">
                            <b-button
                              class="float-right mb-2"
                              variant="outline-primary"
                              @click="onAddSubject(data.item.level.id)"
                            >
                              <v-icon name="plus-circle" /> ADD NEW SUBJECT
                            </b-button>
                          </b-col>
                        </b-row>
                        <b-table
                          class="mb-4"
                          outlined
                          responsive
                          show-empty
                          :fields="tables.subjects.fields"
                          :items="data.item.subjects"
                          :busy="tables.subjects.isBusy"
                        >
                          <!-- <template v-slot:head(pivot.isTaken)>
                            <b-form-checkbox
                              v-if="
                                data.item.transcriptRecordStatusId ===
                                  $options.TranscriptRecordStatuses.DRAFT.id
                              "
                              @input="
                                toggleCheckAll(data.item.subjects, $event)
                              "
                              v-model="data.item.isTakenAll"
                            >
                            </b-form-checkbox>
                          </template>
                          <template v-slot:cell(pivot.isTaken)="row">
                            <b-form-checkbox
                              :disabled="
                                data.item.transcriptRecordStatusId !==
                                  $options.TranscriptRecordStatuses.DRAFT.id
                              "
                              :value="1"
                              :unchecked-value="0"
                              v-model="row.item.pivot.isTaken"
                            />
                          </template> -->
                          <template v-slot:table-busy>
                            <div class="text-center my-2">
                              <v-icon name="spinner" spin class="mr-2" />
                              <strong>Loading...</strong>
                            </div>
                          </template>
                          <template v-slot:cell(pivot.grade)="row">
                            <vue-autonumeric
                              :disabled="
                                data.item.transcriptRecordStatusId !==
                                  $options.TranscriptRecordStatuses.DRAFT.id
                              "
                              v-model="row.item.pivot.grade"
                              class="form-control text-right"
                              :options="[
                                {
                                  minimumValue: 0,
                                  modifyValueOnWheel: false,
                                  emptyInputBehavior: 0,
                                },
                              ]"
                            >
                            </vue-autonumeric>
                          </template>
                          <template v-slot:cell(pivot.notes)="row">
                            <b-form-input
                              :disabled="
                                data.item.transcriptRecordStatusId !==
                                  $options.TranscriptRecordStatuses.DRAFT.id
                              "
                              v-model="row.item.pivot.notes"
                            >
                            </b-form-input>
                          </template>
                          <template v-slot:cell(labs)="row">
                            {{
                              data.item.schoolCategoryId ===
                              $options.SchoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : row.item.labs
                            }}
                          </template>
                          <template v-slot:cell(units)="row">
                            {{
                              data.item.schoolCategoryId ===
                              $options.SchoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : row.item.units
                            }}
                          </template>
                          <template v-slot:cell(action)="row">
                            <b-button
                              @click="removeSubject(row)"
                              size="sm"
                              variant="danger"
                            >
                              <v-icon name="trash" />
                            </b-button>
                          </template>
                          <template v-slot:custom-foot>
                            <b-tr>
                              <b-td colspan="5" class="text-right">
                                <span class="text-danger">Total Units </span>
                              </b-td>
                              <b-td class="text-center">
                                <span class="text-danger">
                                  {{
                                    data.item.schoolCategoryId ===
                                    $options.SchoolCategories.VOCATIONAL.id
                                      ? 'N/A'
                                      : totalUnits(
                                          data.item.subjects,
                                          'units'
                                        )
                                  }}
                                </span>
                              </b-td>
                              <b-td class="text-center">
                                <span class="text-danger">
                                  {{
                                    data.item.schoolCategoryId ===
                                    $options.SchoolCategories.VOCATIONAL.id
                                      ? 'N/A'
                                      : totalUnits(data.item.subjects, 'labs')
                                  }}
                                </span>
                              </b-td>
                              <b-td class="text-center">
                                <span class="text-danger">
                                  {{
                                    data.item.schoolCategoryId ===
                                    $options.SchoolCategories.VOCATIONAL.id
                                      ? 'N/A'
                                      : totalUnits(
                                          data.item.subjects,
                                          'totalUnits'
                                        )
                                  }}
                                </span>
                              </b-td>
                            </b-tr>
                          </template>
                        </b-table>
                      </b-col>
                    </b-row>
                    <b-row v-else>
                      <b-col md="12">
                        <b-list-group>
                          <b-list-group-item
                            v-for="(level, idx) in data.item.levels"
                            :key="level.id"
                          >
                            <div
                              v-b-toggle="'level' + level.id"
                              class="d-flex justify-content-between align-items-center"
                            >
                              <h5>{{ level.name }}</h5>
                              <span class="when-open">
                                <v-icon name="caret-down" />
                              </span>
                              <span class="when-closed">
                                <v-icon name="caret-left" />
                              </span>
                            </div>
                            <b-collapse
                              :id="'level' + level.id"
                              class="mt-2"
                              role="tabpanel"
                              active
                            >
                              <b-form-checkbox
                                class="mb-2"
                                @input="getSemesters(level, $event)"
                              >
                                Show All Semesters
                              </b-form-checkbox>
                              <div
                                v-for="semester in filterSemester(
                                  data,
                                  level
                                )"
                                :key="semester.id"
                              >
                                <b-row>
                                  <b-col md="9">
                                    <h6>{{ semester.name }}</h6>
                                  </b-col>
                                  <b-col md="3">
                                    <b-button
                                      class="float-right mb-2"
                                      variant="outline-primary"
                                      @click="
                                        onAddSubject(level.id, semester.id)
                                      "
                                    >
                                      <v-icon name="plus-circle" /> ADD NEW
                                      SUBJECT
                                    </b-button>
                                  </b-col>
                                </b-row>
                                <b-row>
                                  <b-col md="12">
                                    <b-table
                                      responsive
                                      hover
                                      striped
                                      show-empty
                                      :items="
                                        filterSubjects(
                                          data,
                                          level.id,
                                          semester.id
                                        ).items
                                      "
                                      :fields="tables.subjects.fields"
                                      :busy="tables.subjects.isBusy"
                                    >
                                      <template v-slot:table-busy>
                                        <div class="text-center my-2">
                                          <v-icon
                                            name="spinner"
                                            spin
                                            class="mr-2"
                                          />
                                          <strong>Loading...</strong>
                                        </div>
                                      </template>
                                      <template
                                        v-slot:cell(pivot.grade)="row"
                                      >
                                        <vue-autonumeric
                                          :disabled="
                                            data.item
                                              .transcriptRecordStatusId !==
                                              $options
                                                .TranscriptRecordStatuses
                                                .DRAFT.id
                                          "
                                          v-model="row.item.pivot.grade"
                                          class="form-control text-right"
                                          :options="[
                                            {
                                              minimumValue: 0,
                                              modifyValueOnWheel: false,
                                              emptyInputBehavior: 0,
                                            },
                                          ]"
                                        >
                                        </vue-autonumeric>
                                      </template>
                                      <template v-slot:cell(action)="row">
                                        <b-button
                                          @click="removeSubject(row)"
                                          size="sm"
                                          variant="danger"
                                        >
                                          <v-icon name="trash" />
                                        </b-button>
                                      </template>
                                      <template
                                        v-slot:cell(pivot.notes)="row"
                                      >
                                        <b-form-input
                                          :disabled="
                                            data.item
                                              .transcriptRecordStatusId !==
                                              $options
                                                .TranscriptRecordStatuses
                                                .DRAFT.id
                                          "
                                          v-model="row.item.pivot.notes"
                                        >
                                        </b-form-input>
                                      </template>
                                      <template v-slot:cell(labs)="row">
                                        {{
                                          data.item.schoolCategoryId ===
                                          $options.SchoolCategories.VOCATIONAL
                                            .id
                                            ? 'N/A'
                                            : row.item.labs
                                        }}
                                      </template>
                                      <template v-slot:cell(units)="row">
                                        {{
                                          data.item.schoolCategoryId ===
                                          $options.SchoolCategories.VOCATIONAL
                                            .id
                                            ? 'N/A'
                                            : row.item.units
                                        }}
                                      </template>
                                      <template v-slot:custom-foot>
                                        <b-tr>
                                          <b-td
                                            colspan="5"
                                            class="text-right"
                                          >
                                            <span class="text-danger"
                                              >Total Units
                                            </span>
                                          </b-td>
                                          <b-td class="text-center">
                                            <span class="text-danger">
                                              {{
                                                data.item.schoolCategoryId ===
                                                $options.SchoolCategories
                                                  .VOCATIONAL.id
                                                  ? 'N/A'
                                                  : totalUnits(
                                                      filterSubjects(
                                                        data,
                                                        level.id,
                                                        semester.id
                                                      ).items,
                                                      'units'
                                                    )
                                              }}
                                            </span>
                                          </b-td>
                                          <b-td class="text-center">
                                            <span class="text-danger">
                                              {{
                                                data.item.schoolCategoryId ===
                                                $options.SchoolCategories
                                                  .VOCATIONAL.id
                                                  ? 'N/A'
                                                  : totalUnits(
                                                      filterSubjects(
                                                        data,
                                                        level.id,
                                                        semester.id
                                                      ).items,
                                                      'labs'
                                                    )
                                              }}
                                            </span>
                                          </b-td>
                                          <b-td class="text-center">
                                            <span class="text-danger">
                                              {{
                                                data.item.schoolCategoryId ===
                                                $options.SchoolCategories
                                                  .VOCATIONAL.id
                                                  ? 'N/A'
                                                  : totalUnits(
                                                      filterSubjects(
                                                        data,
                                                        level.id,
                                                        semester.id
                                                      ).items,
                                                      'totalUnits'
                                                    )
                                              }}
                                            </span>
                                          </b-td>
                                        </b-tr>
                                      </template>
                                      <!-- <template v-slot:head(pivot.isTaken)>
                                        <b-form-checkbox
                                          v-if="
                                            data.item
                                              .transcriptRecordStatusId ===
                                              $options
                                                .TranscriptRecordStatuses
                                                .DRAFT.id
                                          "
                                          @input="
                                            toggleCheckAll(
                                              filterSubjects(
                                                data,
                                                level.id,
                                                semester.id
                                              ).items,
                                              $event
                                            )
                                          "
                                          v-model="
                                            filterSubjects(
                                              data,
                                              level.id,
                                              semester.id
                                            ).isTakenAll
                                          "
                                        >
                                          Credited
                                        </b-form-checkbox>
                                      </template>
                                      <template
                                        v-slot:cell(pivot.isTaken)="row"
                                      >
                                        <b-form-checkbox
                                          :disabled="
                                            data.item
                                              .transcriptRecordStatusId !==
                                              $options
                                                .TranscriptRecordStatuses
                                                .DRAFT.id
                                          "
                                          :value="1"
                                          :unchecked-value="0"
                                          v-model="row.item.pivot.isTaken"
                                        />
                                      </template> -->
                                    </b-table>
                                  </b-col>
                                </b-row>
                              </div>
                            </b-collapse>
                          </b-list-group-item>
                        </b-list-group>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </template>

              <b-tabs content>
                <b-tab title="Details">
                  <div class="p-4">
                    <div class="mt-2 mb-4">
                      <b-row class="my-2 pb-1">
                        <b-col md="12">
                          <span class="h5">Applying for Academic Record</span>
                          <hr class="bg-light mt-1 mb-2" />
                        </b-col>
                      </b-row>
                      <b-row class="pb-1">
                        <b-col md="12">
                          <div class="d-flex flex-row">
                            <div class="mr-2">Curriculum:</div>
                            <div v-if="!data.item.studentCurriculumEdit">
                              <span
                                :class="
                                  `font-weight-bold ${
                                    !data.item.studentCurriculum
                                      ? 'text-danger'
                                      : ''
                                  }`
                                "
                              >
                                {{
                                  data.item.studentCurriculum
                                    ? data.item.studentCurriculum.name
                                    : 'Nothing is Set'
                                }} </span
                              >&nbsp;
                              <b-link
                                v-if="
                                  data.item.transcriptRecordStatusId ===
                                    $options.TranscriptRecordStatuses.DRAFT.id
                                "
                                @click="
                                  data.item.studentCurriculumEdit = !data.item
                                    .studentCurriculumEdit
                                "
                              >
                                [Set Curriculum]
                              </b-link>
                            </div>
                            <div v-else class="w-75 ml-2">
                              <b-form-select
                                @change="
                                  loadStudentCurriculum($event, data),
                                    (data.item.studentCurriculumEdit = !data
                                      .item.studentCurriculumEdit)
                                "
                                v-model="data.item.studentCurriculumId"
                              >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled
                                    >-- Curriculum --</b-form-select-option
                                  >
                                </template>
                                <b-form-select-option
                                  v-for="curriculum in data.item.curriculums"
                                  :key="curriculum.id"
                                  :value="curriculum.id"
                                >
                                  {{ curriculum.name }}
                                </b-form-select-option>
                              </b-form-select>
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                      <b-row class="pb-1">
                        <b-col md="12" v-if="data.item.course">
                          <div class="d-flex flex-row">
                            <div class="mr-2">Course:</div>
                            <div v-if="!data.item.studentCourseEdit">
                              <span>
                                {{ data.item.course.description }}
                                {{
                                  data.item.course.major
                                    ? ' - ' + data.item.course.major
                                    : ''
                                }} </span
                              >&nbsp;&nbsp;
                              <b-link
                                v-if="
                                  data.item.transcriptRecordStatusId ===
                                    $options.TranscriptRecordStatuses.DRAFT.id
                                "
                                @click="
                                  data.item.studentCourseEdit = !data.item
                                    .studentCourseEdit
                                "
                              >
                                [Change Course]
                              </b-link>
                            </div>
                            <div v-else class="w-75 ml-2">
                              <b-form-select
                                @change="onChangeCourse(data)"
                                v-model="data.item.courseId"
                                class="float-right"
                              >
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled
                                    >-- Course --</b-form-select-option
                                  >
                                </template>
                                <b-form-select-option :value="null"
                                  >None</b-form-select-option
                                >
                                <b-form-select-option
                                  v-for="course in options.courses.items"
                                  :key="course.id"
                                  :value="course.id"
                                >
                                  {{ course.description }}
                                  {{
                                    course.major ? `(${course.major})` : ''
                                  }}
                                </b-form-select-option>
                              </b-form-select>
                            </div>
                          </div>
                        </b-col>
                      </b-row>
                      <b-row class="pb-1">
                        <b-col md="12">
                          Level:<span class="ml-2">{{
                            getName(data.item, 'level')
                          }}</span>
                        </b-col>
                      </b-row>
                      <b-row class="pb-1">
                        <b-col md="12" v-if="data.item.semesterId">
                          Semester:<span class="ml-2">{{
                            semesters.getEnum(data.item.semesterId).name
                          }}</span>
                        </b-col>
                      </b-row>
                      <b-row class="pb-1">
                        <b-col md="12">
                          Date Submitted:<span class="ml-2">{{
                            data.item.submittedDate
                          }}</span>
                        </b-col>
                      </b-row>
                    </div>
                  </div>
                </b-tab>
                <b-tab title="Evaluation Form"> </b-tab>
                <b-tab>
                  <template v-slot:title>
                    Attachments
                    <span v-if="data.item.filesCount > 0">
                      ({{ data.item.filesCount }})
                    </span>
                  </template>
                </b-tab>
              </b-tabs>
              <div
                v-if="
                  data.item.transcriptRecordStatusId ===
                    $options.TranscriptRecordStatuses.DRAFT.id
                "
              >
                <!-- v-if="
                    isAccessible(
                      $options.EvaluationAndAdmissionPermissions.DISAPPROVAL
                        .id
                    )
                  " -->
                <b-button
                  @click="setDisapproval(data)"
                  class="float-right my-2 mr-2"
                  variant="outline-danger"
                  >Reject</b-button
                >
                <!-- v-if="
                    isAccessible(
                      $options.EvaluationAndAdmissionPermissions.APPROVAL.id
                    )
                  " -->
                <b-button
                  @click="setApproval(data)"
                  class="float-right m-2"
                  variant="outline-primary"
                  >Approve</b-button
                >
              </div>
            </ActiveRowViewer>
          </template>
        </b-table>
        <b-row>
          <b-col md="6">
            Showing {{ paginations.transcriptRecord.from }} to
            {{ paginations.transcriptRecord.to }} of
            {{ paginations.transcriptRecord.totalRows }} records.
          </b-col>
          <b-col md="6">
            <b-pagination
              class="c-pagination"
              v-model="paginations.transcriptRecord.page"
              :total-rows="paginations.transcriptRecord.totalRows"
              :per-page="paginations.transcriptRecord.perPage"
              size="sm"
              align="end"
              @input="loadTranscriptRecords()"
            />
          </b-col>
        </b-row>
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
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
            <b-col md="4"> </b-col>
            <b-col offset-md="4" md="4">
              <b-form-input
                v-model="filters.subject.criteria"
                type="text"
                placeholder="Search"
                debounce="500"
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
            :filter="filters.subject.criteria"
            :busy="tables.subjects.isBusy2"
            :current-page="paginations.subject.page"
            :per-page="paginations.subject.perPage"
            @filtered="onFiltered($event, paginations.subject)"
          >
            <template class="d-none" v-slot:cell(prerequisites)>
              <b-tr class="d-none"> </b-tr>
            </template>
            <template v-slot:cell(action)="data">
              <b-button @click="addSubject(data)" size="sm" variant="success">
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
                @input="recordDetails(paginations.subject)"
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
      <FileViewer
        :show="fileViewer.show"
        :file="file"
        :owner="file.owner"
        :isBusy="file.isLoading"
        @close="fileViewer.show = false"
      />
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import FileViewer from '../components/FileViewer';
import {
  CourseApi,
  CurriculumApi,
  LevelApi,
  ReportApi,
  SchoolCategoryApi,
  StudentGradeApi,
  SubjectApi,
  TranscriptRecordApi,
} from '../../mixins/api';
import {
  SchoolCategories,
  TranscriptRecordStatuses,
  StudentCategories,
  Semesters,
  TranscriptRecordPermissions,
  StudentGradeStatuses
} from '../../helpers/enum';
import {
  showNotification,
  formatNumber,
  clearFields,
} from '../../helpers/forms';
import Tables from '../../helpers/tables';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import { copyValue } from '../../helpers/extractor';
import { format } from 'date-fns';
import { colorFactory, getColorFactoryLength } from '../../helpers/colors';
import AvatarMaker from '../components/AvatarMaker';
import Card from '../components/Card';
import ActiveRowViewer from '../components/ActiveRowViewer/ActiveRowViewer';
import ActiveViewHeader from '../components/ActiveRowViewer/ActiveViewHeader';
import ActiveViewItems from '../components/ActiveRowViewer/ActiveViewItems';
import ActiveViewItem from '../components/ActiveRowViewer/ActiveViewItem';
import ActiveViewLinks from '../components/ActiveRowViewer/ActiveViewLinks';
import AttachmentList from '../components/Attachment/AttachmentList';
import Access from '../../mixins/utils/Access';
import PageContent from  '../components/PageContainer/PageContent'
import NoAccess from "../components/NoAccess";
import { StudentColumn, CurriculumColumn, EducationColumn } from '../components/ColumnDetails';

const COLOR_FACTORY_LENGTH = getColorFactoryLength();

export default {
  name: 'TranscriptRecord',
  constants: {
    COLOR_FACTORY_LENGTH,
  },
  colorFactory,
  format,
  mixins: [
    Tables,
    TranscriptRecordApi,
    SchoolCategoryApi,
    LevelApi,
    CourseApi,
    CurriculumApi,
    SubjectApi,
    ReportApi,
    Access,
    StudentGradeApi
  ],
  components: {
    SchoolCategoryTabs,
    Card,
    AvatarMaker,
    ActiveRowViewer,
    ActiveViewHeader,
    AttachmentList,
    ActiveViewItems,
    ActiveViewItem,
    ActiveViewLinks,
    FileViewer,
    PageContent,
    NoAccess,
    StudentColumn,
    CurriculumColumn,
    EducationColumn
  },
  TranscriptRecordStatuses,
  SchoolCategories,
  StudentCategories,
  Semesters,
  TranscriptRecordPermissions,
  StudentGradeStatuses,
  data() {
    return {
      isFilterVisible: true,
      studentGradeCount: 0,
      fileViewer: {
        isActiveNavEnabled: false,
        activeNavCount: 0,
        activeNavIndex: 0,
        show: false,
      },
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      tables: {
        transcriptRecords: {
          isBusy: false,
          filterIncludedFields: ['firstName', 'lastName'],
          fields: [
             {
              key: 'id',
              label: 'ID',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'curriculum',
              label: 'Curriculum',
              tdClass: 'align-middle',
              thStyle: { width: '35%' },
            },
            {
              key: 'education',
              label: 'Education (Recent)',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'status',
              label: 'Status',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '7%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '20px' },
            },
          ],
          items: [],
        },
        subjects: {
          isBusy: false,
          fields: [
            // {
            //   key: 'pivot.isTaken',
            //   label: 'Credited',
            //   tdClass: 'align-middle text-center',
            //   thClass: 'text-center',
            //   thStyle: { width: '120px' },
            // },
            {
              key: 'pivot.grade',
              label: 'Grade',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
            },
            {
              key: 'pivot.notes',
              label: 'Remarks',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
            },
            {
              key: 'name',
              label: 'Subject',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              formatter: (value, key, item) => {
                return `${value} - ${item.description}`;
              },
            },
            // {
            // 	key: "description",
            // 	label: "Description",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "auto"}
            // },
            {
              key: 'prerequisites',
              label: 'Prerequisites',
              tdClass: 'align-middle',
              thStyle: { width: '15%' },
              formatter: (value, key, item) => {
                if (value.length > 0) {
                  return value
                    .map((subject) => {
                      return subject.name;
                    })
                    .join(', ');
                }
                return '';
              },
            },
            {
              key: 'units',
              label: 'Lec',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '6%' },
            },
            {
              key: 'labs',
              label: 'Lab',
              tdClass: 'align-middle text-center',
              thClass: 'text-right',
              thStyle: { width: '6%' },
            },
            {
              key: 'totalUnits',
              label: 'Total Units',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle text-center',
              thStyle: { width: '5%' },
            },
          ],
          fields2: [
            // {
            // 	key: "code",
            // 	label: "CODE",
            // 	tdClass: "align-middle",
            // 	thStyle: {width: "15%"}
            // },
            {
              key: 'name',
              label: 'SUBJECT CODE',
              tdClass: 'align-middle',
              thStyle: { width: '18%' },
            },
            {
              key: 'description',
              label: 'DESCRIPTION',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
            },
            {
              key: 'labs',
              label: 'LAB UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'units',
              label: 'LEC UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '10%' },
            },
            {
              key: 'totalUnits',
              label: 'TOTAL UNITS',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '15%' },
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
      },
      paginations: {
        transcriptRecord: {
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
      },
      filters: {
        transcriptRecord: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          courseId: null,
          courseItem: null,
          transcriptRecordStatusId: null,
          transcriptRecordStatusItem: null,
          levelId: null,
          levelItem: null,
        },
        subject: {
          criteria: null,
          departmentId: null,
        },
      },
      options: {
        courses: {
          isLoading: false,
          items: [],
        },
        levels: {
          isLoading: false,
          items: [],
        },
      },
      isProcessing: false,
      schoolCategoryId: null,
      row: [],
      levelId: null,
      semesterId: null,
      showModalSubjects: false,
    };
  },
  created() {
    if (this.$route.query?.success) {
      showNotification(this, "success", "Updated Successfully.")
      this.$router.replace({'query': null});
    }
    const { transcriptRecord } = this.filters
    if (!this.checkIfSuperUser()) {
      transcriptRecord.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      transcriptRecord.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    this.loadLevels()
    this.loadCourses()
    this.loadTranscriptRecords();
    this.loadStudentGrades();
  },
  methods: {
    loadStudentGrades() {
      const { StudentGradeStatuses } = this.$options
      const params = { studentGradeStatusId: StudentGradeStatuses.SUBMITTED.id, paginate: false }
      this.getStudentGradeList(params).then(({ data }) => {
        this.studentGradeCount = data.length
      })
    },
    loadTranscriptRecords() {
      const {
        transcriptRecordStatusId,
        schoolCategoryId,
        courseId,
        levelId,
        criteria,
      } = this.filters.transcriptRecord;
      const {
        transcriptRecord,
        transcriptRecord: { perPage, page },
      } = this.paginations;
      let params = {
        paginate: true,
        perPage,
        page,
        transcriptRecordStatusId,
        notTranscriptRecordStatusId: this.$options.TranscriptRecordStatuses
          .PENDING.id,
        schoolCategoryId,
        courseId,
        levelId,
        criteria,
      };
      const { transcriptRecords } = this.tables;
      transcriptRecords.isBusy = true
      this.getTranscriptRecordList(params).then(({ data }) => {
        transcriptRecords.items = data.data;
        transcriptRecord.from = data.meta.from;
        transcriptRecord.to = data.meta.to;
        transcriptRecord.totalRows = data.meta.total;
        transcriptRecords.isBusy = false;
      });
    },
    loadCourses() {
      const { schoolCategoryId } = this.filters.transcriptRecord;
      const { courses } = this.options;
      let params = { paginate: false };
      courses.isLoading = true;

      if (schoolCategoryId) {
        this.getCoursesOfSchoolCategoryList(schoolCategoryId, params).then(
          ({ data }) => {
            courses.isLoading = false;
            courses.items = data;
          }
        );
      }
    },
    loadLevels() {
      const params = { paginate: false };
      const { levels } = this.options;
      const { schoolCategoryId } = this.filters.transcriptRecord;
      this.getLevelList(params).then(({ data }) => {
        levels.items = schoolCategoryId ? data.filter(e => e.schoolCategoryId === schoolCategoryId) : data;
      });
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
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
    loadDetails(row) {
      this.$router.push({
        path: `/registrar/academic-transcript/${row.item.id}`,
      })
      // if (!row.detailsShowing) {
      //   const {
      //     item,
      //     item: { id, schoolCategoryId, levelId, courseId, studentId },
      //   } = row;
      //   this.$set(item, 'isLoading', true);
      //   this.loadTranscriptRecord(id, row);
      //   this.loadSubjects(schoolCategoryId);
      // }
      // row.toggleDetails();
    },
    loadSubjects(schoolCategoryId) {
      const { subjects } = this.tables;
      const { subject } = this.paginations;
      subjects.isBusy2 = true;
      let params = { paginate: false, schoolCategoryId };
      this.getSubjectList(params).then(({ data }) => {
        subjects.items = data;
        // subjects.filteredItems = data
        subject.totalRows = data.length;
        this.recordDetails(subject);
        subjects.isBusy2 = false;
      });
    },
    loadTranscriptRecord(id, row) {
      const { subjects } = this.tables;
      subjects.isBusy = true;
      row.item.isLoading = true;
      this.getTranscriptRecord(id).then(({ data }) => {
        const newSubjects = data.subjects.map((obj) => ({
          ...obj,
          pivot: {
            ...obj.pivot,
            isTaken: obj.pivot.isTaken ?? 0,
            grade: obj.pivot.grade ?? 0,
            notes: obj.pivot.notes ?? 0,
          },
        }));
        this.$set(row.item, 'isTakenAll', false);
        this.$set(row.item, 'subjects', newSubjects);
        if (row.item.courseId) {
          this.loadLevelsOfCourse(row);
        } else {
        }
        row.item.isLoading = false;
        subjects.isBusy = false;
        this.row = row;
      });
    },
    loadLevelsOfCourse(row) {
      let params = { paginate: false };
      row.item.isLoading = true;
      this.getLevelsOfCourse(row.item.courseId, params).then(({ data }) => {
        this.$set(row.item, 'levels', data);
        row.item.isLoading = false;
      });
    },
    filterSemester(row, level) {
      let defaultSemesters = this.$options.Semesters.values.slice(0, 2);
      if (level.isShowAll) {
        return this.$options.Semesters.values;
      } else {
        const { subjects } = row.item;
        let filteredSubjects = subjects.filter(
          (subject) => subject.pivot.levelId === level.id
        );
        let distinctSemesters = [
          ...new Set(filteredSubjects.map((x) => x.pivot.semesterId)),
        ];
        distinctSemesters.forEach((d) => {
          if (d) {
            if (!defaultSemesters.map((x) => x.id).includes(d)) {
              defaultSemesters.push(Semesters.getEnum(d));
            }
          }
        });
        return defaultSemesters;
      }
    },
    filterSubjects(row, levelId, semesterId = null) {
      const { subjects } = row.item;
      let filteredSubjects = subjects.filter(
        (subject) =>
          subject.pivot.levelId === levelId &&
          subject.pivot.semesterId === semesterId
      );
      const data = { items: filteredSubjects, isTakenAll: false };
      return data;
    },
    getSemesters(level, event) {
      this.$set(level, 'isShowAll', event);
    },
    toggleCheckAll(subjects, value) {
      subjects.forEach((subject) => {
        subject.pivot.isTaken = value ? 1 : 0;
      });
    },
    onAddSubject(levelId, semesterId = null) {
      this.levelId = levelId;
      this.semesterId = semesterId;
      this.showModalSubjects = true;
      this.filters.subject.criteria = null;
    },
    addSubject(data) {
      const { item } = data;
      const { item: transcriptRecord } = this.row;
      // check if subject exist in the table
      const result = transcriptRecord.subjects.find(
        (subject) => subject.id === item.id
      );
      if (result) {
        showNotification(this, 'danger', item.name + ' is already added.');
        return;
      }
      transcriptRecord.subjects.push({
        ...item,
        prerequisites: [],
        pivot: {
          grade: 0,
          notes: '',
          isTaken: 0,
          levelId: this.levelId,
          semesterId: this.semesterId,
        },
      });
    },
    removeSubject(data) {
      const { item } = data;
      const { item: transcriptRecord } = this.row;
      const index = transcriptRecord.subjects.findIndex(
        (i) => i.id === item.id
      );
      transcriptRecord.subjects.splice(index, 1);
    },
    onUpdateTranscriptRecord(transcriptRecord, isFinalized = false) {
      const {
        id,
        curriculumId,
        studentCurriculumId,
        studentId,
        schoolCategoryId,
        levelId,
        courseId,
        subjects,
      } = transcriptRecord.item;

      const transcriptRecordSubjects = subjects.map((subject) => {
        return {
          subjectId: subject.id,
          levelId: subject.pivot.levelId,
          semesterId: subject.pivot.semesterId,
          grade: subject.pivot.grade,
          notes: subject.pivot.notes,
          isTaken: subject.pivot.isTaken,
        };
      });
      const { TranscriptRecordStatuses } = this.$options;
      const transcriptRecordStatusId = isFinalized
        ? TranscriptRecordStatuses.FINALIZED.id
        : TranscriptRecordStatuses.DRAFT.id;
      const data = {
        id,
        curriculumId,
        studentCurriculumId,
        studentId,
        schoolCategoryId,
        levelId,
        courseId,
        transcriptRecordStatusId,
        subjects: transcriptRecordSubjects,
      };
      this.updateTranscriptRecord(id, data).then(({ data }) => {
        this.loadTranscriptRecords();
        showNotification(this, 'success', 'Updated Successfully.');
        transcriptRecord.toggleDetails();
      });
    },
    printTranscriptRecord(id) {
      this.file.type = null;
      this.file.src = null;
      this.fileViewer.show = true;
      this.file.isLoading = true;
      this.file.name = 'Transcript Of Record';
      this.previewTranscriptRecord(id).then(({ data, headers }) => {
        this.file.type = headers.contentType;
        const file = new Blob([data], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
        this.file.isLoading = false;
      });
    },
    onCategoryFilterChange(item) {
      const { transcriptRecord } = this.filters;
      transcriptRecord.schoolCategoryId = item?.id || 0;
      transcriptRecord.schoolCategoryItem = item;
      transcriptRecord.levelId = null
      transcriptRecord.levelItem = null
      transcriptRecord.courseId = null
      transcriptRecord.courseItem = null
      this.loadLevels()
      this.loadCourses()
      this.loadTranscriptRecords();
    },
    onStatusFilterChange(item) {
      const { transcriptRecord } = this.filters;
      transcriptRecord.transcriptRecordStatusId = item?.id || 0;
      transcriptRecord.transcriptRecordStatusItem = item;
      this.loadTranscriptRecords();
    },
    onLevelFilterChange(item) {
      const { transcriptRecord } = this.filters;
      transcriptRecord.levelId = item?.id || 0;
      transcriptRecord.levelItem = item;
      this.loadTranscriptRecords();
    },
    onCourseFilterChange(item) {
      const { transcriptRecord } = this.filters;
      transcriptRecord.courseId = item?.id || 0;
      transcriptRecord.courseItem = item;
      this.loadTranscriptRecords();
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
      const { schoolCategoryId } = this.filters.transcriptRecord;
      const { SchoolCategories } = this.$options;
      return [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id
      ].includes(schoolCategoryId);
    }
  },
};
</script>
<style lang="scss" scoped>
@import '../../assets/scss/shared.scss';

.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}
.for-approval-button {
  background: none;
  outline: 0;
  border: 1px solid $light-gray-10;
  border-radius: 4px;
  padding: 4px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;

  &:hover {
    background-color: $light-gray-50;
  }
}
</style>
