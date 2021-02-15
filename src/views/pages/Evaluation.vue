<template>
  <PageContent
    title="Evaluation and Admission Records"
    @toggleFilter="isFilterVisible = !isFilterVisible"
    @refresh="loadEvaluation"
    :filterVisible="isFilterVisible"
    :createButtonVisible="false">
    <template v-slot:filters>
      <b-form-input
        v-model="filters.student.criteria"
        debounce="500"
        @update="loadEvaluation()"
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
        :options="evaluationStatuses.values"
        :value="filters.student.evaluationStatusItem"
        @input="onStatusFilterChange"
        label="name"
        placeholder="Status"
        class="mt-2"
      />
    </template>
    <template v-slot:content>
      <!-- <div class="mb-2">
        <FilterButton />
      </div> -->
      <div v-if="checkIfHasSchoolCategoryAccess()">
        <b-table
          class="c-table"
          outlined
          small
          show-empty
          responsive
          :fields="tables.students.fields"
          :items="tables.students.items"
          :busy="tables.students.isBusy"
          @sort-changed="onSortChanged"
        >
          <template v-slot:head(attachments)>
            <div class="text-center">
              <v-icon name="paperclip" />
            </div>
          </template>
          <template v-slot:table-busy>
            <div class="text-center my-2">
              <v-icon name="spinner" spin class="mr-2" />
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(attachments)="data">
            <span
              >{{ data.item.filesCount }} &nbsp; &nbsp; &nbsp; &nbsp;
            </span>
            <v-icon name="paperclip" />
          </template>
          <template v-slot:cell(name)="data">
            <StudentColumn
              :data="data.item"
              :callback="{ loadDetails: () => loadDetails(data) }"
            />
          </template>
          <template v-slot:cell(address)="data">
            <AddressColumn :data="data.item" />
          </template>
          <template v-slot:cell(education)="data">
            <EducationColumn :data="data.item" />
          </template>
          <template
            v-slot:cell(studentCategory.name)="{
              item: { studentCategory, studentCategoryId },
            }"
          >
            <b-badge
              :variant="
                studentCategoryId === studentCategories.NEW.id
                  ? 'success'
                  : studentCategoryId === studentCategories.OLD.id
                  ? 'primary'
                  : 'warning'
              "
            >
              {{  studentCategoryId === studentCategories.TRANSFEREE_OLD.id ? 'TRANSFEREE' : studentCategory.name }}
            </b-badge>
          </template>
          <template v-slot:cell(status)="data">
            <b-badge
              :variant="
                data.item.evaluationStatusId ===
                evaluationStatuses.APPROVED.id
                  ? 'success'
                  : data.item.evaluationStatusId ===
                    evaluationStatuses.REJECTED.id
                  ? 'danger'
                  : 'warning'
              "
            >
              {{
                evaluationStatuses.getEnum(data.item.evaluationStatusId).name
              }}
            </b-badge>
          </template>
          <template v-slot:cell(attachments)="data">
            <span>{{ data.item.filesCount }} </span>
            <v-icon name="paperclip" class="ml-2" />
          </template>
          <template v-slot:cell(action)="row">
            <!-- <button type="button" @click="loadDetails(row)" class="btn-invisible">
              <BIconFolder2Open v-if="row.detailsShowing " />
              <BIconFolderSymlink v-else scale="1.2" />
            </button> -->
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
              <b-dropdown-item @click.prevent="loadDetails(row)">
                {{
                  row.item.evaluationStatusId ===
                  evaluationStatuses.APPROVED.id
                    ? 'View Details'
                    : 'Review Record'
                }}
              </b-dropdown-item>
            </b-dropdown>
          </template>
          <template v-slot:row-details="data">
            <ActiveRowViewer
              :isBusy="data.item.isLoading"
              backTitle="Go back to list"
              @onBack="data.toggleDetails()"
              :showOptions="
                data.item.evaluationStatusId ===
                  evaluationStatuses.SUBMITTED.id
              "
              :options="[
                {
                  label: 'Approve',
                  callback: () => setApproval(data),
                  isAllowed: isAccessible(
                    $options.EvaluationAndAdmissionPermissions.APPROVAL.id
                  ),
                },
                {
                  label: 'Reject',
                  callback: () => setDisapproval(data),
                  isAllowed: isAccessible(
                    $options.EvaluationAndAdmissionPermissions.DISAPPROVAL.id
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
                  <p class="active-view__header-date">
                    <BIconAlarm />
                    {{
                      $options.format(
                        new Date(data.item.submittedDate),
                        'MMMM dd, yyyy'
                      )
                    }}
                  </p>
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
                      text: 'Educational Background',
                      target: 'header-educational-background',
                    },
                    {
                      text: 'Application',
                      target: 'header-current-application',
                    },
                    {
                      text: 'Evaluation',
                      target: 'header-evaluation-student',
                    },
                  ]"
                />
              </template>

              <template v-slot:content>
                <div>
                  <ActiveViewHeader
                    id="header-student-information"
                    title="Review Student Information"
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
                            ? data.item.student.currentAddress
                            : ''
                        }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Category:">
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
                    </ActiveViewItem>
                  </ActiveViewItems>
                </div>

                <div>
                  <ActiveViewHeader
                    id="header-educational-background"
                    title="Review Previous Educational Background"
                    circleText="2"
                  />
                  <ActiveViewItems>
                    <ActiveViewItem label="Last School Attended:">
                      <p>
                        {{ data.item.lastSchoolAttended }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Last School Level:">
                      <p>
                        {{
                          data.item.lastSchoolLevel
                            ? data.item.lastSchoolLevel.name
                            : 'N/A'
                        }}
                      </p>
                    </ActiveViewItem>
                    <ActiveViewItem label="Attended Period:">
                      <p>
                        {{ data.item.lastSchoolYearFrom }}-{{
                          data.item.lastSchoolYearTo
                        }}
                      </p>
                    </ActiveViewItem>
                  </ActiveViewItems>
                </div>

                <div>
                  <ActiveViewHeader
                    id="header-current-application"
                    title="Review Application for current Academic Year"
                    circleText="3"
                  />

                  <ActiveViewItems>
                    <ActiveViewItem label="Curriculum:">
                      <div
                        v-if="!data.item.studentCurriculumEdit"
                        class="mb-3"
                      >
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
                            data.item.evaluationStatusId ===
                              evaluationStatuses.SUBMITTED.id
                          "
                          @click="
                            data.item.studentCurriculumEdit = !data.item
                              .studentCurriculumEdit
                          "
                        >
                          [Set Curriculum]
                        </b-link>
                      </div>
                      <div v-else class="w-75 ml-2 mb-3">
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
                      </div>
                    </ActiveViewItem>
                    <ActiveViewItem v-if="data.item.course" label="Course:">
                      <div v-if="!data.item.studentCourseEdit" class="mb-3">
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
                        <b-link
                          v-if="
                            data.item.evaluationStatusId ===
                              evaluationStatuses.SUBMITTED.id
                          "
                          @click="
                            data.item.studentCourseEdit = !data.item
                              .studentCourseEdit
                          "
                        >
                          [Change Course]
                        </b-link>
                      </div>
                      <div v-else class="w-75 ml-2 mb-3">
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
                      </div>
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
                    <ActiveViewItem label="Date Submitted:">
                      <p>
                        {{
                          $options.format(
                            new Date(data.item.submittedDate),
                            'MMMM dd, yyyy'
                          )
                        }}
                      </p>
                    </ActiveViewItem>
                  </ActiveViewItems>
                  <div class="p-4 mb-4">
                    <h5>Attachments</h5>
                    <AttachmentList
                      :items="data.item.files"
                      titleKey="name"
                      descriptionKey="notes"
                      documentTypeKey="documentType"
                      @onAttachmentItemDownload="
                        (file) => downloadFile(file, data)
                      "
                      @onAttachmentItemView="
                        (file) => previewFile(file, data)
                      "
                    />
                  </div>
                </div>
                <div>
                  <ActiveViewHeader
                    id="header-evaluation-student"
                    title="Evaluate Student Grade"
                    circleText="4"
                  />

                  <b-row class="mb-3 text-center">
                    <b-col md="12">
                      <h5>Evaluation Form</h5>
                      <div
                        v-if="!data.item.curriculumEdit"
                        :class="!data.item.curriculum ? 'text-danger' : ''"
                      >
                        <b>{{
                          data.item.curriculum
                            ? data.item.curriculum.name
                            : data.item.curriculumMsg
                            ? `There's no active curriculum set. Please set a curriculum`
                            : 'Nothing is Set'
                        }}</b
                        >&nbsp;
                        <b-link
                          v-if="
                            !data.item.curriculumMsg &&
                              data.item.evaluationStatusId ===
                                evaluationStatuses.SUBMITTED.id
                          "
                          @click="
                            data.item.curriculumEdit = !data.item
                              .curriculumEdit
                          "
                        >
                          [Change]
                        </b-link>
                      </div>
                      <b-form-select
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
                      </b-form-select>
                    </b-col>
                  </b-row>
                  <div v-if="data.item.subjects">
                    <b-row v-if="data.item.courseId === null">
                      <b-col md="12">
                        <b-row>
                          <b-col md="6">
                            <h5>{{ getName(data.item, 'level') }}</h5>
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
                          <template v-slot:head(pivot.isTaken)>
                            <b-form-checkbox
                              v-if="
                                data.item.evaluationStatusId ===
                                  evaluationStatuses.SUBMITTED.id
                              "
                              @input="
                                toggleCheckAll(data.item.subjects, $event)
                              "
                              v-model="data.item.isTakenAll"
                            >
                              Credited
                            </b-form-checkbox>
                          </template>
                          <template v-slot:cell(pivot.isTaken)="row">
                            <b-form-checkbox
                              :disabled="
                                data.item.evaluationStatusId !==
                                  evaluationStatuses.SUBMITTED.id
                              "
                              :value="1"
                              :unchecked-value="0"
                              v-model="row.item.pivot.isTaken"
                            />
                          </template>
                          <template v-slot:table-busy>
                            <div class="text-center my-2">
                              <v-icon name="spinner" spin class="mr-2" />
                              <strong>Loading...</strong>
                            </div>
                          </template>
                          <template v-slot:cell(pivot.grade)="row">
                            <vue-autonumeric
                              :disabled="
                                data.item.evaluationStatusId !==
                                  evaluationStatuses.SUBMITTED.id ||
                                  !row.item.pivot.isTaken
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
                                data.item.evaluationStatusId !==
                                  evaluationStatuses.SUBMITTED.id ||
                                  !row.item.pivot.isTaken
                              "
                              v-model="row.item.pivot.notes"
                            >
                            </b-form-input>
                          </template>
                          <template v-slot:cell(labs)="row">
                            {{
                              data.item.schoolCategoryId ===
                              options.schoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : row.item.labs
                            }}
                          </template>
                          <template v-slot:cell(units)="row">
                            {{
                              data.item.schoolCategoryId ===
                              options.schoolCategories.VOCATIONAL.id
                                ? 'N/A'
                                : row.item.units
                            }}
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
                                    options.schoolCategories.VOCATIONAL.id
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
                                    options.schoolCategories.VOCATIONAL.id
                                      ? 'N/A'
                                      : totalUnits(data.item.subjects, 'labs')
                                  }}
                                </span>
                              </b-td>
                              <b-td class="text-center">
                                <span class="text-danger">
                                  {{
                                    data.item.schoolCategoryId ===
                                    options.schoolCategories.VOCATIONAL.id
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
                                  <b-col md="3"> </b-col>
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
                                            data.item.evaluationStatusId !==
                                              evaluationStatuses.SUBMITTED
                                                .id || !row.item.pivot.isTaken
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
                                      <template
                                        v-slot:cell(pivot.notes)="row"
                                      >
                                        <b-form-input
                                          :disabled="
                                            data.item.evaluationStatusId !==
                                              evaluationStatuses.SUBMITTED
                                                .id || !row.item.pivot.isTaken
                                          "
                                          v-model="row.item.pivot.notes"
                                        >
                                        </b-form-input>
                                      </template>
                                      <template v-slot:cell(labs)="row">
                                        {{
                                          data.item.schoolCategoryId ===
                                          options.schoolCategories.VOCATIONAL
                                            .id
                                            ? 'N/A'
                                            : row.item.labs
                                        }}
                                      </template>
                                      <template v-slot:cell(units)="row">
                                        {{
                                          data.item.schoolCategoryId ===
                                          options.schoolCategories.VOCATIONAL
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
                                                options.schoolCategories
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
                                                options.schoolCategories
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
                                                options.schoolCategories
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
                                      <template v-slot:head(pivot.isTaken)>
                                        <b-form-checkbox
                                          v-if="
                                            data.item.evaluationStatusId ===
                                              evaluationStatuses.SUBMITTED.id
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
                                            data.item.evaluationStatusId !==
                                              evaluationStatuses.SUBMITTED.id
                                          "
                                          :value="1"
                                          :unchecked-value="0"
                                          v-model="row.item.pivot.isTaken"
                                        />
                                      </template>
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
                                  data.item.evaluationStatusId ===
                                    evaluationStatuses.SUBMITTED.id
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
                                  data.item.evaluationStatusId ===
                                    evaluationStatuses.SUBMITTED.id
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
                  data.item.evaluationStatusId ===
                    evaluationStatuses.SUBMITTED.id
                "
              >
                <b-button
                  v-if="
                    isAccessible(
                      $options.EvaluationAndAdmissionPermissions.DISAPPROVAL
                        .id
                    )
                  "
                  @click="setDisapproval(data)"
                  class="float-right my-2 mr-2"
                  variant="outline-danger"
                  >Reject</b-button
                >
                <b-button
                  v-if="
                    isAccessible(
                      $options.EvaluationAndAdmissionPermissions.APPROVAL.id
                    )
                  "
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
              @input="loadEvaluation()"
            />
          </b-col>
        </b-row>
      </div>
      <NoAccess v-if="!checkIfHasSchoolCategoryAccess()"/>
      <FileViewer
      :show="fileViewer.show"
      :file="file"
      :owner="file.owner"
      :isBusy="file.isLoading"
      @close="fileViewer.show = false"
      @onNavLeft="onFileNavLeft"
      @onNavRight="onFileNavRight"
      :navCount="fileViewer.activeNavCount"
      :navActiveIndex="fileViewer.activeNavIndex"
      :enableArrowNav="fileViewer.isActiveNavEnabled"
    />
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
            v-model="forms.evaluation.fields.approvalNotes"
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
            v-model="forms.evaluation.fields.disapprovalNotes"
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
    </template>
  </PageContent>
  <!-- main container -->
</template>
<script>
import {
  EvaluationApi,
  StudentFileApi,
  CurriculumApi,
  CourseApi,
  TranscriptRecordApi,
} from '../../mixins/api';
import {
  SchoolCategories,
  EvaluationStatuses,
  Semesters,
  UserGroups,
  StudentCategories,
  EvaluationAndAdmissionPermissions,
} from '../../helpers/enum';
import {
  showNotification,
  formatNumber,
  clearFields,
} from '../../helpers/forms';
import Tables from '../../helpers/tables';
import SchoolCategoryTabs from '../components/SchoolCategoryTabs';
import { copyValue } from '../../helpers/extractor';
import FileViewer from '../components/FileViewer';
import Access from '../../mixins/utils/Access';
import { camelToSnakeCase } from '../../helpers/utils';
import { format } from 'date-fns';
import { colorFactory, getColorFactoryLength } from '../../helpers/colors';
import ActiveRowViewer from '../components/ActiveRowViewer/ActiveRowViewer';
import ActiveViewHeader from '../components/ActiveRowViewer/ActiveViewHeader';
import ActiveViewItems from '../components/ActiveRowViewer/ActiveViewItems';
import ActiveViewItem from '../components/ActiveRowViewer/ActiveViewItem';
import ActiveViewLinks from '../components/ActiveRowViewer/ActiveViewLinks';
import AttachmentList from '../components/Attachment/AttachmentList';
import AvatarMaker from '../components/AvatarMaker';
import Card from '../components/Card';
import { StudentColumn, EducationColumn, AddressColumn } from '../components/ColumnDetails';
import PageContent from '../components/PageContainer/PageContent';
import FilterButton from '../components/PageContainer/FilterButton';
import NoAccess from '../components/NoAccess';

const COLOR_FACTORY_LENGTH = getColorFactoryLength();

const evaluationFields = {
  evaluationStatusId: null,
  approvalNotes: null,
  disapprovalNotes: null,
};

export default {
  name: 'Evaluation',
  constants: {
    COLOR_FACTORY_LENGTH,
  },
  colorFactory,
  camelToSnakeCase,
  format,
  mixins: [
    EvaluationApi,
    StudentFileApi,
    CurriculumApi,
    CourseApi,
    Tables,
    Access,
    TranscriptRecordApi,
  ],
  components: {
    SchoolCategoryTabs,
    FileViewer,
    ActiveRowViewer,
    ActiveViewHeader,
    AttachmentList,
    ActiveViewItems,
    ActiveViewItem,
    ActiveViewLinks,
    AvatarMaker,
    Card,
    StudentColumn,
    EducationColumn,
    AddressColumn,
    PageContent,
    FilterButton,
    NoAccess
  },
  EvaluationAndAdmissionPermissions,
  data() {
    return {
      sortBy: 'submittedDate',
      sortDesc: true,
      isFilterVisible: true,
      fileViewer: {
        isActiveNavEnabled: false,
        activeNavCount: 0,
        activeNavIndex: 0,
        show: false,
      },
      showModalApproval: false,
      showModalRejection: false,
      showModalSubjects: false,
      isLoading: false,
      evaluationStatuses: EvaluationStatuses,
      semesters: Semesters,
      studentCategories: StudentCategories,
      lastActiveEvaluation: null,
      lastActiveFile: null,
      file: {
        type: null,
        src: null,
        name: null,
        notes: null,
        isLoading: false,
      },
      forms: {
        evaluation: {
          fields: { ...evaluationFields },
          states: { ...evaluationFields },
          errors: { ...evaluationFields },
        },
      },
      tables: {
        students: {
          isBusy: false,
          filterIncludedFields: ['firstName', 'lastName'],
          fields: [
            {
              key: 'name',
              label: 'Name',
              tdClass: 'align-middle',
              thStyle: { width: 'auto' },
              sortable: false // allow first in backend
              // formatter: (value, key, item) => {
              // 	if(!item.student.middleName){
              // 		item.student.middleName = ""
              // 	}
              // 	item.student.name = item.student.firstName + " " + item.student.middleName + " " + item.student.lastName
              // }
            },
             {
              key: 'address',
              label: 'Address',
              tdClass: 'align-middle',
              thStyle: { width: '28%' },
            },
            {
              key: 'education',
              label: 'Education',
              tdClass: 'align-middle',
              thStyle: { width: '20%' },
            },
            {
              key: 'submittedDate',
              label: 'Submitted',
              tdClass: 'align-middle',
              thStyle: { width: '10%' },
              sortable: true,
              formatter: (value, key, item) => {
                if (!value) return '';

                return format(new Date(value), 'MM/dd/yyyy');
              },
            },
            {
              key: 'studentCategory.name',
              label: 'Category',
              tdClass: 'align-middle text-center font-weight-bold',
              thClass: 'text-center',
              thStyle: { width: '80px' },
            },
            {
              key: 'status',
              label: 'Status',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '50px' },
            },
            // {
            // 	key: "attachments",
            // 	label: "",
            // 	tdClass: "align-middle text-center",
            // 	thClass: "text-center",
            // 	thStyle: { width: "8%"}
            // },
            {
              key: 'action',
              label: '',
              tdClass: 'align-middle',
              thStyle: { width: '25px' },
            },
          ],
          items: [],
        },
        subjects: {
          isBusy: false,
          fields: [
            {
              key: 'pivot.isTaken',
              label: 'Credited',
              tdClass: 'align-middle text-center',
              thClass: 'text-center',
              thStyle: { width: '120px' },
            },
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
      },
      filters: {
        student: {
          criteria: null,
          schoolCategoryId: null,
          schoolCategoryItem: null,
          courseItem: null,
          courseId: null,
          evaluationStatusId: EvaluationStatuses.SUBMITTED.id,
          evaluationStatusItem: EvaluationStatuses.SUBMITTED
        },
        subject: {
          criteria: null,
          departmentId: null,
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
        curriculums: {
          isLoading: false,
          items: [],
        },
      },
      isProcessing: false,
      schoolCategoryId: null,
      row: [],
    };
  },
  created() {
    // this.checkRights()
    // to prevent show all evaluation with filtered school category
    const { student } = this.filters
    if (!this.checkIfSuperUser()) {
      student.schoolCategoryId =  this.getDefaultSchoolCategory()?.id
      student.schoolCategoryItem =  this.getDefaultSchoolCategory()
    }
    this.loadEvaluation();
    this.loadCourseList();
  },
  methods: {
    setApproval(row) {
      this.forms.evaluation.approvalNotes = null;
      if (row.item.curriculumMsg) {
        showNotification(
          this,
          'danger',
          'Please set a curriculum before approving.'
        );
        return;
      }
      this.row = row;
      this.showModalApproval = true;
    },
    onApproval() {
      this.isProcessing = true;
      const {
        item,
        item: {
          id: evaluationId,
          curriculumId,
          studentCurriculumId,
          courseId,
          schoolCategoryId,
          levelId,
        },
      } = this.row;

      const {
        evaluation: { fields: evaluation },
      } = this.forms;

      let subjects = [];

      item.subjects.forEach((subject) => {
        subjects.push({
          subjectId: subject.id,
          levelId: subject.pivot.levelId,
          semesterId: subject.pivot.semesterId,
          grade: subject.pivot.grade,
          notes: subject.pivot.notes,
          isTaken: subject.pivot.isTaken,
        });
      });

      evaluation.evaluationStatusId = EvaluationStatuses.APPROVED.id;
      // const curriculumId = item.curriculumId
      // const studentCurriculumId = item.studentCurriculumId

      //set transcript fields value
      const fullLevelSchoolCategory = [
        SchoolCategories.SENIOR_HIGH_SCHOOL.id,
        SchoolCategories.COLLEGE.id,
        SchoolCategories.GRADUATE_SCHOOL.id,
        SchoolCategories.VOCATIONAL.id,
      ];

      if (item.transcriptRecord) {
        item.transcriptRecord.curriculumId = curriculumId;
        item.transcriptRecord.studentCurriculumId = studentCurriculumId;
        item.transcriptRecord.courseId = courseId;
        item.transcriptRecord.schoolCategoryId = schoolCategoryId;
        item.transcriptRecord.levelId = fullLevelSchoolCategory.includes(
          schoolCategoryId
        )
          ? null
          : levelId;
      }

      const data = {
        ...evaluation,
        curriculumId,
        studentCurriculumId,
        courseId,
        subjects,
        transcriptRecord: {
          ...item.transcriptRecord,
        },
      };

      this.updateEvaluation(data, evaluationId)
        .then(({ data }) => {
          clearFields(evaluation);
          this.loadEvaluation();
          this.isProcessing = false;
          this.showModalApproval = false;
          showNotification(this, 'success', 'Approved Successfully.');
          this.$store.state.approvalCount.evaluation--;
        })
        .catch((error) => {
          this.isProcessing = false;
          const errors = error.response.data.errors;
          this.showBulletedNotification(errors);
        });
    },
    setDisapproval(row) {
      this.forms.evaluation.disapprovalNotes = null;
      this.row = row;
      this.showModalRejection = true;
    },
    onDisapproval() {
      this.isProcessing = true;
      const {
        item,
        item: { id: evaluationId },
      } = this.row;

      const {
        evaluation: { fields: evaluation },
      } = this.forms;

      evaluation.evaluationStatusId = EvaluationStatuses.REJECTED.id;

      const data = {
        ...evaluation,
      };

      this.updateEvaluation(data, evaluationId)
        .then(({ data }) => {
          clearFields(evaluation);
          this.loadEvaluation();
          this.isProcessing = false;
          this.showModalRejection = false;
          showNotification(this, 'success', 'Rejected Successfully.');
        })
        .catch((error) => {
          console.log(error);
          this.isProcessing = false;
        });
    },
    loadEvaluation() {
      const { students } = this.tables;
      const {
        student,
        student: { perPage, page },
      } = this.paginations;
      students.isBusy = true;
      const {
        evaluationStatusId,
        schoolCategoryId,
        courseId,
        criteria,
      } = this.filters.student;
      const applicationStatusId = EvaluationStatuses.SUBMITTED.id;
      const orderBy = this.$options.camelToSnakeCase(this.sortBy);
      const sort = this.sortDesc ? 'DESC' : 'ASC';
      let params = {
        paginate: true,
        perPage,
        page,
        evaluationStatusId,
        schoolCategoryId,
        courseId,
        orderBy,
        sort,
        criteria,
      };
      this.getEvaluationList(params).then((response) => {
        const res = response.data;
        students.items = res.data;
        student.from = res.meta.from;
        student.to = res.meta.to;
        student.totalRows = res.meta.total;
        students.isBusy = false;
      });
    },
    loadCourseList() {
      let params = { paginate: false };
      this.getCourseList(params).then(({ data }) => {
        this.options.courses.items = data;
      });
    },
    loadDetails(row) {
      if (!row.detailsShowing) {
        const {
          item,
          item: {
            id,
            schoolCategoryId,
            levelId,
            courseId,
            transcriptRecordId,
            studentId,
          },
        } = row;

        this.$set(item, 'isLoading', true);
        this.$set(item, 'curriculumEdit', false);
        this.$set(item, 'studentCurriculumEdit', false);
        this.$set(item, 'studentCourseEdit', false);
        this.$set(item, 'curriculums', false);

        let params = { paginate: false, schoolCategoryId, levelId };

        if (
          schoolCategoryId === SchoolCategories.SENIOR_HIGH_SCHOOL.id ||
          schoolCategoryId === SchoolCategories.COLLEGE.id
        ) {
          params = { paginate: false, schoolCategoryId, courseId };
        }
        item.isLoading = true;
        this.getStudentFileList(studentId, { paginate: false }).then(
          ({ data }) => {
            this.$set(row.item, 'files', data);
            if (item.evaluationStatusId === EvaluationStatuses.SUBMITTED.id) {
              // this.loadCurriculumList(params, row)
              this.getCurriculumList(params).then(({ data }) => {
                item.curriculums = data;
                if (data.length > 0) {
                  if (item.curriculumId === null) {
                    const activeCurriculum = data.find((c) => c.active === 1);
                    if (activeCurriculum) {
                      item.curriculumId = activeCurriculum.id;
                      if (item.studentCategoryId === StudentCategories.NEW.id) {
                        item.studentCurriculumId = activeCurriculum.id;
                        item.studentCurriculum = activeCurriculum;
                      }
                    } else {
                      this.$set(item, 'curriculumMsg', true);
                      item.isLoading = false;
                      return;
                    }
                  }
                  this.loadCurriculum(item.curriculumId, row);
                  // item.isLoading = false
                } else {
                  this.$set(item, 'curriculumMsg', true);
                  item.isLoading = false;
                }
              });
            } else {
              this.loadSubjectsOfTranscriptRecord(transcriptRecordId, row);
            }
          }
        );
      }
      row.toggleDetails();
    },
    onChangeCourse(row) {
      const {
        item,
        item: { schoolCategoryId, courseId },
      } = row;
      item.isLoading = true;
      const params = { paginate: false, schoolCategoryId, courseId };

      this.getCurriculumList(params).then(({ data }) => {
        item.curriculums = data;
        if (data.length > 0) {
          const activeCurriculum = data.find((c) => c.active === 1);
          if (activeCurriculum) {
            item.curriculumId = activeCurriculum.id;
            if (item.studentCategoryId === StudentCategories.NEW.id) {
              item.studentCurriculumId = activeCurriculum.id;
              item.studentCurriculum = activeCurriculum;
            }
            item.curriculumMsg = false;
            this.loadCurriculum(item.curriculumId, row);
          } else {
            item.curriculum = null;
            item.studentCurriculum = null;
            item.studentCurriculumId = null;
            item.curriculumId = null;
            item.subjects = null;
            item.curriculumMsg = true;
            return;
          }
        } else {
          item.curriculum = null;
          item.studentCurriculum = null;
          item.studentCurriculumId = null;
          item.curriculumId = null;
          item.subjects = null;
          item.curriculumMsg = true;
          return;
        }
      });
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
    setupActiveFileViewer(row, data) {
      this.lastActiveEvaluation = data;
      this.lastActiveFile = row;
      this.fileViewer.isActiveNavEnabled = !!data?.item?.files?.length;
      this.fileViewer.activeNavCount = data?.item?.files?.length;
      this.fileViewer.activeNavIndex = row.index;
    },
    previewFile(row, data) {
      this.setupActiveFileViewer(row, data);

      const { studentId, id, name, notes } = row.item;
      this.file.type = null;
      this.file.src = null;
      this.file.name = name;
      this.file.notes = notes;
      this.fileViewer.show = true;
      this.file.isLoading = true;
      this.file.owner = data.item.student;

      this.getStudentFilePreview(studentId, id).then((response) => {
        this.file.type = response.headers.contentType;
        this.file.isLoading = false;
        const file = new Blob([response.data], {
          type: response.headers.contentType,
        });
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        reader.readAsDataURL(file);
      });
    },
    downloadFile(row, data) {
      const { studentId, id, name } = row.item;

      this.getStudentFilePreview(studentId, id).then((response) => {
        const fileUrl = window.URL.createObjectURL(
          new Blob([response.data], {
            type: response.headers.contentType,
          })
        );
        const reader = new FileReader();
        reader.onload = (e) => (this.file.src = e.target.result);
        const fileLink = document.createElement('a');

        fileLink.href = fileUrl;
        fileLink.setAttribute('download', name);
        document.body.appendChild(fileLink);

        fileLink.click();
      });
    },
    loadCurriculum(id, row) {
      const { subjects } = this.tables;
      subjects.isBusy = true;
      row.item.isLoading = true;
      this.getCurriculum(id).then(({ data }) => {
        row.item.curriculum = data;
        const newSubjects = data.subjects.map((obj) => ({
          ...obj,
          pivot: { ...obj.pivot, isTaken: 0, grade: 0, notes: '' },
        }));
        this.$set(row.item, 'isTakenAll', false);
        this.$set(row.item, 'subjects', newSubjects);
        if (row.item.courseId) {
          this.loadLevelsOfCourse(row);
        } else {
          row.item.isLoading = false;
        }
        subjects.isBusy = false;
      });
    },
    loadStudentCurriculum(id, row) {
      const {
        item,
        item: { curriculum, curriculums },
      } = row;
      const studentCurr = curriculums.find((i) => i.id === id);
      item.curriculumId = id;
      item.studentCurriculum = studentCurr;
      item.isLoading = true;
      this.loadCurriculum(id, row);
    },
    loadSubjectsOfTranscriptRecord(transcriptRecordId, row) {
      const { subjects } = this.tables;
      subjects.isBusy = true;
      this.getSubjectsOfTranscriptRecord(transcriptRecordId, {
        paginate: false,
      }).then(({ data }) => {
        this.$set(row.item, 'isTakenAll', false);
        this.$set(row.item, 'subjects', data);
        if (row.item.courseId) {
          this.loadLevelsOfCourse(row);
        } else {
          row.item.isLoading = false;
        }
        subjects.isBusy = false;
      });
    },
    checkRights() {
      const userGroupId = localStorage.getItem('userGroupId');
      const userGroup = UserGroups.getEnum(Number(userGroupId));
      let result = false;
      if (userGroup) {
        this.filters.student.schoolCategoryId = userGroup.schoolCategoryId;
        this.schoolCategoryId = userGroup.schoolCategoryId;
      }
      this.loadEvaluation();
    },
    avatar(student) {
      let src = '';
      if (student.photo) {
        src = process.env.VUE_APP_PUBLIC_PHOTO_URL + student.photo.hashName;
      }
      return src;
    },
    loadLevelsOfCourse(row) {
      let params = { paginate: false };
      row.item.isLoading = true;
      this.getLevelsOfCourse(row.item.courseId, params).then(({ data }) => {
        this.$set(row.item, 'levels', data);
        row.item.isLoading = false;
      });
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
    filterSemester(row, level) {
      let defaultSemesters = this.semesters.values.slice(0, 2);
      if (level.isShowAll) {
        return this.semesters.values;
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
    toggleCheckAll(subjects, value) {
      subjects.forEach((subject) => {
        subject.pivot.isTaken = value ? 1 : 0;
      });
    },
    showBulletedNotification(errors) {
      const h = this.$createElement;
      const errorList = [];
      Object.keys(errors).forEach((key) => {
        errorList.push(h('li', errors[key][0]));
      });
      const vNodesMsg = h('ul', errorList);
      showNotification(this, 'danger', vNodesMsg);
    },
    getCurrentFiles() {
      const { index: studentIdx } = this.lastActiveEvaluation;
      const { files } = this.tables?.students?.items[studentIdx];
      return files;
    },
    getCurrentFileIndex() {
      const { index } = this.lastActiveFile;
      return index;
    },
    onFileNavLeft() {
      const files = this.getCurrentFiles();
      let currentIdx = this.getCurrentFileIndex();
      const isFirst = currentIdx === 0;
      currentIdx = isFirst ? files.length - 1 : currentIdx - 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewFile(currentFileItem, this.lastActiveEvaluation);
    },
    onFileNavRight() {
      const files = this.getCurrentFiles();
      let currentIdx = this.getCurrentFileIndex();
      const isLast = currentIdx === files.length - 1;
      currentIdx = isLast ? 0 : currentIdx + 1;
      const file = files[currentIdx];
      const currentFileItem = {
        ...this.lastActiveFile,
        index: currentIdx,
        item: file,
      };
      this.previewFile(currentFileItem, this.lastActiveEvaluation);
    },
    onCategoryFilterChange(item) {
      const { student } = this.filters;
      student.schoolCategoryId = item?.id || 0;
      student.schoolCategoryItem = item;
      this.loadEvaluation();
    },
    onStatusFilterChange(item) {
      const { student } = this.filters;
      student.evaluationStatusId = item?.id || 0;
      student.evaluationStatusItem = item;
      this.loadEvaluation();
    },
    onCourseFilterChange(item) {
      const { student } = this.filters;
      student.courseId = item?.id || 0;
      student.courseItem = item;
      this.loadEvaluation();
    },
    onSortChanged({ sortBy, sortDesc }) {
      this.sortBy = sortBy;
      this.sortDesc = sortDesc;
      this.loadEvaluation();
    }
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
.collapsed .when-open,
.not-collapsed .when-closed {
  display: none;
}
.evaluation__form-details-first {
  width: 25%;
}
.evaluation__form-details-second {
  width: 30%;
}

</style>
